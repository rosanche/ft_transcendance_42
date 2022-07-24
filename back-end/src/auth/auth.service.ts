import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from 'bcrypt';
import {toDataURL} from 'qrcode';
import { authenticator } from 'otplib';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { TokenPayload } from "./entities/payload.entity";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}

    exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> 
    {
        for (let key of keys) {
          delete user[key]
        }
        return user
    }

    async signup(dto: AuthDto) {
        try {
            const pass = dto.password;
            const hash = bcrypt.hashSync(pass, 10);
            const user = await this.prisma.user.create({
                data: {
                email: dto.email,
                hash
                },
            });
            console.log("user");
            console.log(user);
            return this.login(user);
        }
        catch(error)
        {
            console.log("error");
            if (error instanceof PrismaClientKnownRequestError)
            {
                if (error.code === "P2002")
                {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }
    
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) throw new ForbiddenException('Credentials incorrect');
        if (!user.hash) throw new ForbiddenException('Wrong authentication method');
        const pwdMatches = bcrypt.compareSync(dto.password, user.hash) // 
        if (!pwdMatches) throw new ForbiddenException('Credentials incorrect');
        return this.login(user);
    }

    async signToken(payload :Partial<TokenPayload>) : Promise<{access_token: string}>
    {
        const secret = this.config.get('JWT_SECRET');
        
        const token = await this.jwt.signAsync(payload, {expiresIn: '60m', secret: secret});
        return {access_token: token};
    }

    login(user: Partial<User>)
    {
        if(!user) {
            throw new ForbiddenException('Credentials incorrect');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
            isTwoFactorAuthenticated: false,
          };
        return this.signToken(payload);
    }

    async setTwoFactorAuthenticationSecret(secret: string, id: number) {
        await this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                twoFactorAuthenticationSecret: secret
            }
        });
    };
    
    async turnOnTwoFactorAuthentication(userId: number) {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                isTwoFactorAuthenticationEnabled: true
            }
        });
    };

    async loginWith2fa(user: Partial<User>) {

        const payload = {
            email: user.email,
            sub: user.id,
            isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
            isTwoFactorAuthenticated: true,
          };
        return await this.signToken(payload);
    }

    async generateTwoFactorAuthenticationSecret(user: Partial<User>) {
        const secret = authenticator.generateSecret();
    
        const otpAuthUrl = authenticator.keyuri(
          user.email,
          'Trancendence',
          secret,
        );
    
        await this.setTwoFactorAuthenticationSecret(
          secret,
          user.id,
        );
    
        return {
          secret,
          otpAuthUrl,
        };
      }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
      }
    

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: Partial<User>) {
        return authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: user.twoFactorAuthenticationSecret
        });
      }
}