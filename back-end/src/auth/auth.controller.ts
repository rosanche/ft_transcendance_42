import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}

    //Classic Authentification

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    //Google Oauth 2.0 Authentification 

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request)
    {
        console.log(req.user);
        return this.authService.login(req);
    }

    //42 API Oauth 2.0 Authentification

    @Get('42api')
    @UseGuards(AuthGuard('42'))
    async api42Auth(@Req() req: Request) {
        
    }

    @Get('42api/redirect')
    @UseGuards(AuthGuard('42'))
    async api42AuthRedirect(@Req() req: Request)
    {
        console.log(req.user);
        return this.authService.login(req);
    }
}