import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { AuthService } from "src/auth/auth.service"
import { ChatGateway } from "./chat.gateway"


@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [ChatGateway],
})
export class ChatModule {}