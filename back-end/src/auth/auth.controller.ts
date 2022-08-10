import { UnauthorizedException } from "@nestjs/common";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthInDto,AuthUpDto, CodeAuthDto } from "./dto";
import { JwtGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private config: ConfigService){}

    //Classic Authentification

    @Post('signup')
    async signup(@Body() dto: AuthUpDto, @Res() res) {
      
      const user : Partial<User>  = await this.authService.signup(dto);
      console.log('bonjour');
      const access_token = await this.authService.login(user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signin(@Body() dto: AuthInDto, @Res() res) {
      const user : Partial<User>  = await this.authService.signin(dto);
      const access_token = await this.authService.login(user);
      res.cookie('access_token', access_token.access_token);
      return(access_token);
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
    async api42AuthRedirect(@Req() req: Request, @Res(({ passthrough: true })) res: Response)
    {
        console.log(req.user);
        const user : Partial<User> = req.user;
        const access_token = await this.authService.login(user);
        res.cookie('access_token', access_token.access_token);
      
        res.redirect(`http://localhost:3001?2faEnabled=${req.user['isTwoFactorAuthenticationEnabled']}`);
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