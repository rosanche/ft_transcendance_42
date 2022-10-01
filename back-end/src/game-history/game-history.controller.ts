import {
    Controller,
    Get,
    Param,
    UseGuards,
  } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { Jwt2FAGuard } from 'src/auth/guard';
import { GameHistoryService } from './game-history.service';
import { User } from '@prisma/client';

@UseGuards(Jwt2FAGuard)
@Controller('game-history')
export class GameHistoryController {

    constructor(
        private gameHistoryService : GameHistoryService,
      ) {}
    
    @Get("/all")
    async getAllGames()
    {
      return await this.gameHistoryService.getAllGame();

    }

    @Get('id/:id')
    async findId(@Param('id') id) {
    return await this.gameHistoryService.findGameID(id);
    }

    @Get('me')
    async getMyGames(@GetUser() user: User) {
    return await this.gameHistoryService.findGameID(user);
  }
}
