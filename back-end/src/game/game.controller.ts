import { Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import { GameService } from './game.service';
import { gameDto } from "./dto";
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@Controller('game')
export class GameController {
    constructor(private readonly GameService: GameService){}
    @Get('infoall')
    sortie()
    {
        return this.GameService.infoall();
    }
    @Post('create')
    create(@Body() games : gameDto)
    {
        return this.GameService.create(games);
    }

    @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    //if (!user)
      return this.GameService.createprivate(user);
    //return 0;
  }

}
