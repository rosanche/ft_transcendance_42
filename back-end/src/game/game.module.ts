import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports:[AuthModule, UserModule],
    providers: [GameGateway, GameService]
})
export class GameModule {}
