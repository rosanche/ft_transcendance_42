import { Module, forwardRef } from "@nestjs/common"
import { GameModule } from "src/game/game.module"
import { AuthModule } from "../auth/auth.module"
import { AuthService } from "../auth/auth.service"
import { ChatGateway } from "./chat.gateway"


@Module({
    imports: [AuthModule, forwardRef(() => GameModule)],
    controllers: [],
    providers: [ChatGateway],
    exports: [ChatGateway]
})
export class ChatModule {}