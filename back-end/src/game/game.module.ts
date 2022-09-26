import { Module, forwardRef} from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GameGateway } from './game.gateway';


@Module({
    imports:[AuthModule,forwardRef(() => UserModule)],
    providers: [GameGateway, ],
    exports: [GameGateway]
})
export class GameModule {}
