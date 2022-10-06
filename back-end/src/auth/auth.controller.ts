import { UnauthorizedException } from "@nestjs/common";
import { Body, Controller, Get, Patch, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthInDto,AuthUpDto, CodeAuthDto } from "./dto";
import { Jwt2FAGuard, JwtGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private config: ConfigService){}

    //Classic Authentification

    @Post('signup')
    async signup(@Body() dto: AuthUpDto, @Res() res) {

      const user : Partial<User>  = await this.authService.signup(dto);
      // console.log('bonjour');
      const access_token = await this.authService.login(user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }

    @Post('signin')
    async signin(@Body() dto: AuthInDto, @Res() res) {
      // console.log("signin");
      const user : Partial<User>  = await this.authService.signin(dto);

      const access_token = await this.authService.login(user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }

    //Google Oauth 2.0 Authentification

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request)
    {
        // console.log(req.user);
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
        // console.log(req.user);
        const user : Partial<User> = req.user;
        const access_token = await this.authService.login(user);
        res.cookie('access_token', access_token.access_token);

        res.redirect(`http://${this.config.get("HOST")}:${this.config.get("NEXT_PORT")}/connexion?2faEnabled=${req.user['isTwoFactorAuthenticationEnabled']}&new=${user.new}`);
    }

    //2FA Auth
    @Post('2fa/generate')
    @UseGuards(Jwt2FAGuard)
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
    @UseGuards(Jwt2FAGuard)
    async turnOnTwoFactorAuthentication(@Req() request, @Body() body: CodeAuthDto, @Res() res) {
// // console.log("$$body", body);
        if (!request.user.twoFactorAuthenticationSecret){
          // // console.log("$$wrong")
            throw new UnauthorizedException('Two Factor Authentication Secret Not Generate');
        }
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            body.twoFactorAuthenticationCode,
            request.user,
        );
        // // console.log("$$answer", isCodeValid, body.twoFactorAuthenticationCode)
        if (!isCodeValid) {
          throw new UnauthorizedException('Wrong authentication code');
        }
        await this.authService.turnOnTwoFactorAuthentication(request.user.id);

        const access_token = await this.authService.loginWith2fa(request.user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }

    @Patch('2fa/turn-off')
    @UseGuards(Jwt2FAGuard)
    async turnOffTwoFactorAuthentication(@Req() request, @Res() res) {
// // console.log("$$body", body);
        await this.authService.turnOffTwoFactorAuthentication(request.user.id);
        const access_token = await this.authService.loginWith2fa(request.user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    async authenticate(@Req() request, @Body() body: CodeAuthDto, @Res() res) {
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

        const access_token = await this.authService.loginWith2fa(request.user);
      res.cookie('access_token', access_token.access_token);
      res.send(access_token);
    }
}
