import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(config: ConfigService, private prisma: PrismaService)
    {
        const url =  `http://localhost:${config.get("NESTJS_PORT")}/auth/google/redirect`
        super({
            clientID : config.get("GOOGLE_ID"),
            clientSecret : config.get("GOOGLE_SECRET"),
            callbackURL : url,
            scope : ['email', 'profile']
        });
        
    };

    async validate(accessToken: string, refreshToken: string,  profile :any, done: VerifyCallback)
    {
        const {name, emails, photos, displayName} = profile;
        console.log(profile);
        const user = await this.prisma.user.findUnique({
            where: {
                email: emails[0].value
            }
        });
        
        if (user) {
        delete user.hash;
        done(null, user);
        }
        else{
            const newUser = await this.prisma.user.create({
                data: {
                email: emails[0].value,
                profileImage: photos[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                pseudo: displayName
                },
            });
            delete newUser.hash;
            done(null, newUser);
        }
    }
};