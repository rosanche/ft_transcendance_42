import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { TokenPayload } from "../entities/payload.entity";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt')
{
    constructor(config: ConfigService, private prisma: PrismaService)
    {
        const extractJwtFromCookie = (req :Request) => {
            let token =  null;
            if (req && req.cookies) {
                token = req.cookies['access_token'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        };

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    };

    async validate(payload: TokenPayload)
    {
        console.log("payload, authenticator validate", payload);
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });


        delete user.hash;
        return user;
    }
};