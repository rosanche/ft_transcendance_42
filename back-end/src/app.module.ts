import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}) ,AuthModule, UserModule, BookmarkModule, PrismaModule, GameModule, FriendModule, ChatModule]
})
export class AppModule {}
