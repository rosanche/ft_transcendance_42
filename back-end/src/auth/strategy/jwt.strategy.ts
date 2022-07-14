import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


export type JWTPayload = {sub: number, email: string};

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy)
{
    constructor(config: ConfigService, private prisma: PrismaService)
    {
        const extractJwtFromCookie = (req) => {
            let token =  null;
            if (req && req.cookie) {
                token = req.cookie['jwt'];
            }
            return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        };

        super({
            jwtFromRequest: extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")
        });
    };

    async validate(payload: JWTPayload)
    {
        console.log(payload);
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        delete user.hash;
        return user;
    }
};