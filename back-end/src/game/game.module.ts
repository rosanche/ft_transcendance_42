import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports: [AuthModule],
    providers: [GameGateway, GameService, AuthService,JwtService]
})
export class GameModule {}
