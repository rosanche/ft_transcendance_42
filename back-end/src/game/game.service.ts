import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { gameDto } from "./dto";
import { User } from '@prisma/client';

@Injectable()
export class GameService {


    constructor(private Prisma: PrismaService){}
    

    async create(games: gameDto)
    {
        const game = await this.Prisma.game.create({
        data: {
            id_1: +games.id_1,
            id_2: +games.id_2
        },
        })
        return game;
    }
    infoall() : Promise<any[]>
    {
        return this.Prisma.game.findMany();
    }

    sortie()
    {
        return "sortie"
    }
    async createprivate(user: User)
    {
        const game = await this.Prisma.game.create({
        data: {
            id_1: user.id,
            id_2: 0
        },
        })
        return game;
    }
}
