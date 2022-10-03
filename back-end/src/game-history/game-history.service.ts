import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class GameHistoryService {
  constructor(private Prisma: PrismaService) {}

  async getAllGame() {
    return await this.Prisma.game.findMany(
      {
        select: {
          id: true,
          id_1: true,
          id_2: true,
          score_1: true,
          score_2: true,
          winner: true
        }
      }
    );
  }

  async findGameID(user: User) {
    return await this.Prisma.game.findMany({
      where: {
        OR: [
          {
            id_1: user.id,
          },
          {
            id_2: user.id,
          },
        ],
      },
      select: {
        id: true,
        id_1: true,
        id_2: true,
        score_1: true,
        score_2: true,
        winner: true
      }
    });
  }
}
