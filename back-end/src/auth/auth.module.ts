import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStategy } from "./strategy/jwt.strategy";

@Module({
    imports : [JwtModule.register({})],
    providers : [AuthService, JwtStategy],
    controllers : [AuthController]
})
export class AuthModule{}