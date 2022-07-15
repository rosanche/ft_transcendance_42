import { UnauthorizedException } from "@nestjs/common";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto, CodeAuthDto } from "./dto";
import { JwtGuard } from "./guard";

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
        const user : Partial<User> = req.user;
        return this.authService.login(user);
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
        const user : Partial<User> = req.user;
        return this.authService.login(user);
    }

    //2FA Auth
    @Post('2fa/generate')
    @UseGuards(JwtGuard)
    async register(@Res() response: Response, @Req() request: Request) {
      const { otpAuthUrl } =
        await this.authService.generateTwoFactorAuthenticationSecret(
          request.user,
        );

      return response.json(
        await this.authService.generateQrCodeDataURL(otpAuthUrl),
      );
    }

    @Post('2fa/turn-on')
    @UseGuards(JwtGuard)
    async turnOnTwoFactorAuthentication(@Req() request, @Body() body: CodeAuthDto) {

        if (!request.user.twoFactorAuthenticationSecret){
            throw new UnauthorizedException('Two Factor Authentication Secret Not Generate');
        }
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            body.twoFactorAuthenticationCode,
            request.user,
        );
        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.turnOnTwoFactorAuthentication(request.user.id);
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    async authenticate(@Req() request, @Body() body: CodeAuthDto) {
        if (!request.user.isTwoFactorAuthenticationEnabled){
            throw new UnauthorizedException('Two Factor Authentication Disabled');
        }
        if (!request.user.twoFactorAuthenticationSecret){
            throw new UnauthorizedException('Two Factor Authentication Secret Not Generate');
        }
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        request.user,
        );

        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }

        return this.authService.loginWith2fa(request.user);
    }
}   