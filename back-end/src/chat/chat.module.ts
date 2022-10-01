import { Module, forwardRef } from "@nestjs/common"
import { GameModule } from "src/game/game.module"
import { AuthModule } from "../auth/auth.module"

import { ChatGateway } from "./chat.gateway"
import { Chat_Commons } from "src/chat/chat_commons";
import { ChatFriend } from "src/chat/chatFriend";


@Module({
    imports: [AuthModule, forwardRef(() => GameModule)],
    controllers: [],
    providers: [ChatGateway, Chat_Commons, ChatFriend],
    exports: [ChatGateway]
})
export class ChatModule {}