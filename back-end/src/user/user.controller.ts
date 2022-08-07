import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { Jwt2FAGuard } from 'src/auth/guard';

@UseGuards(Jwt2FAGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser() user: User) {
        delete user.hash;
        delete user.twoFactorAuthenticationSecret;
        return user;
        
    }
}
