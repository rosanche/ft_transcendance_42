import { Module, forwardRef} from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GameGateway } from './game.gateway';
import { ChatModule } from 'src/chat/chat.module';


@Module({
    imports:[AuthModule,forwardRef(() => UserModule), ChatModule],
    providers: [GameGateway],
    exports: [GameGateway]
})
export class GameModule {}
