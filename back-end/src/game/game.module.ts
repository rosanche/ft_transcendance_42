import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports:[AuthModule],
    providers: [GameGateway, GameService]
})
export class GameModule {}
