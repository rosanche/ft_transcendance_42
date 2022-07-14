import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
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
            const access_token = this.signToken(user.id, user.email);
            return access_token;
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
        const pwdMatches = bcrypt.compareSync(dto.password, user.hash) //  await argon.verify(user.hash, dto.password);
        if (!pwdMatches) throw new ForbiddenException('Credentials incorrect');
        
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string) : Promise<{access_token: string}>
    {
        const payload = {
            sub: userId, email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {expiresIn: '60m', secret: secret});
        return {access_token: token};
    }

    login(user)
    {
        if(!user) {
            return 'No user'
        }
        return this.signToken(user.id, user.email);
    }
}