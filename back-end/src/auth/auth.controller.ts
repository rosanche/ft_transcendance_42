import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUpDto, AuthInDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService){}
    @Post('signup')
    signup(@Body() dto: AuthUpDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: AuthInDto) {
        return this.authService.signin(dto);
    }
}