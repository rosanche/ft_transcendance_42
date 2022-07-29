import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game/game.gateway';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}) ,AuthModule, UserModule, BookmarkModule, PrismaModule],
  providers: [GameGateway]
})
export class AppModule {}
