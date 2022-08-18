import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthInDto, AuthUpDto } from "./dto";
import * as bcrypt from 'bcrypt';
import {toDataURL} from 'qrcode';
import { authenticator } from 'otplib';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from 'argon2';
import { User } from "@prisma/client";
import { TokenPayload } from "./entities/payload.entity";
import { Request, Response } from "express";
import { parse } from "cookie"
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

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


    async getUserFromSocket(socket: Socket) {
        const cookie : string = socket.handshake.headers.cookie || "" ;
        if (!cookie)
        {
            //throw new WsException('cookie missing');
            return null;
        }
        const { access_token: access_token } = parse(cookie);
        if (!access_token)
        {
            //throw new WsException('Authentication cookie missing');
            return null;
        }
    
        const payload: TokenPayload = this.jwt.verify(access_token, {
            secret: this.config.get('JWT_SECRET')
          });
        const user = await this.prisma.user.findUnique({
                where: {
                    id: payload.sub
                }
        });      
        if (!user) {
          //throw new WsException('Invalid credentials.');
          return null;
        }
        return user;


    }

    async test_pseudo(string : string)
    {
        const users  = await this.prisma.user.findUnique(
            {
                where: {
                pseudo: string
            }
    }) !== null;
        console.log(users)
        return (users )
    }


    async signup(dto: AuthUpDto) {
        try {
            while(await this.test_pseudo(dto.pseudo))
            {
            console.log(this.test_pseudo(dto.pseudo));
                dto.pseudo += '_';
            console.log(dto.pseudo);
            }
            console.log(this.test_pseudo(dto.pseudo));
            const hash = await bcrypt.hash(dto.password, 3);
            const user = await this.prisma.user.create({
                data: {
                email: dto.email,
                pseudo: dto.pseudo,
                hash
                },
            });
            console.log("user");
            console.log(user);
            return user;
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
    
    async signin(dto: AuthInDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        console.log(user);
        console.log('compare');
        if (!user) throw new ForbiddenException('Credentials incorrect');
        if (!user.hash) throw new ForbiddenException('Wrong authentication method');
            const isVerify =await bcrypt.compare(dto.password, user.hash);
            console.log('compare after');
            if (isVerify){
                return user;
            } else {
              throw new ForbiddenException('Wrong Password');
            }
        return user;
    }

    async signToken(payload :Partial<TokenPayload>) : Promise<{access_token: string, isTwoFactorAuthenticationEnabled :boolean}>
    {
        const secret = this.config.get('JWT_SECRET');
        
        const token = await this.jwt.signAsync(payload, {expiresIn: '60m', secret: secret});
        console.log(token);
        return {access_token: token, isTwoFactorAuthenticationEnabled: payload.isTwoFactorAuthenticationEnabled};
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
          console.log(payload);
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