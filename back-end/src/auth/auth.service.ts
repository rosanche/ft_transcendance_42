import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthInDto, AuthUpDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    async signup(dto: AuthUpDto) {
        try {
            console.log("yo");
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                email: dto.email,
                pseudo: dto.pseudo,
                hash
                },
            });
            console.log("user");
            console.log(user);
            return this.signToken(user.id, user.email);
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
        if (!user) throw new ForbiddenException('Credentials incorrect');
        const pwdMatches = await argon.verify(user.hash, dto.password);
        if (!pwdMatches) throw new ForbiddenException('Credentials incorrect');
        
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string) : Promise<{access_token: string}>
    {
        const payload = {
            sub: userId, email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {expiresIn: '15m', secret: secret});
        return {access_token: token};
    }
}