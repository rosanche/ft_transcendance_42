import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-42";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class API42Strategy extends PassportStrategy(Strategy)
{
    constructor(config: ConfigService, private prisma: PrismaService)
    {
        const url =  `http://localhost:${config.get("NESTJS_PORT")}/auth/42api/redirect`
        super({
            clientID : config.get("42API_ID"),
            clientSecret : config.get("42API_SECRET"),
            callbackURL : url,
            profileFields: {
                'username': 'login',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'profileUrl': 'url',
                'emails.0.value': 'email',
                'photos.0.value': 'image_url'}
        });
    };

    async validate(accessToken: string, refreshToken: string,  profile :any, done : VerifyCallback) : Promise<any>
    {
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: profile.emails[0].value
            }
        });
        
        if (user){
            console.log("already a user");
            delete user.hash;
            delete user.twoFactorAuthenticationSecret;
            done(null,user);
            
        }
        else
        {
            const newUser = await this.prisma.user.create({
                data: {
                email: profile.emails[0].value,
                // profileImage: profile.photos[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                pseudo: profile.username,
                },
            });
            delete newUser.hash;
            delete newUser.twoFactorAuthenticationSecret;
            done(null, newUser);
        }   
    }
};