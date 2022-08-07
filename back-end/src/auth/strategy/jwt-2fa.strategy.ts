import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { TokenPayload } from "../entities/payload.entity";


@Injectable()
export class Jwt2FAStrategy extends PassportStrategy(Strategy, 'jwt-2fa')
{
    constructor(config: ConfigService, private prisma: PrismaService)
    {
        const extractJwtFromCookie = (req :Request) => {
            let token =  null;
            if (req && req.cookies) {
                token = req.cookies['access_token'];
            }
            console.log(token);
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
        console.log(payload);
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        console.log(user);
        delete user.hash;
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isTwoFactorAuthenticated) {
            return user;
        }
    }
};