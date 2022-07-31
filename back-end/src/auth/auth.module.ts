import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { API42Strategy, GoogleStrategy, Jwt2FAStrategy, JwtStrategy } from "./strategy";


@Module({
    imports : [JwtModule.register({})],
    providers : [AuthService, JwtStrategy, GoogleStrategy, API42Strategy, Jwt2FAStrategy],
    controllers : [AuthController]
})
export class AuthModule{}