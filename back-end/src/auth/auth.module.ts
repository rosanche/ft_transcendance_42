import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { API42Stategy, GoogleStategy } from "./strategy";
import { JwtStategy } from "./strategy/jwt.strategy";

@Module({
    imports : [JwtModule.register({})],
    providers : [AuthService, JwtStategy, GoogleStategy, API42Stategy],
    controllers : [AuthController]
})
export class AuthModule{}