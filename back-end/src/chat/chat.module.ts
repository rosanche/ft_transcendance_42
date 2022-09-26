import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { AuthService } from "../auth/auth.service"
import { ChatGateway } from "./chat.gateway"


@Module({
    imports: [AuthModule],
    controllers: [],
    providers: [ChatGateway],
    exports: [ChatGateway]
})
export class ChatModule {}