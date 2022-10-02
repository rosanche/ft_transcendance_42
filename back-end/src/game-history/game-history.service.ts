import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class GameHistoryService {
  constructor(private Prisma: PrismaService) {}

  async getAllGame() {
    return await this.Prisma.game.findMany();
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
    });
  }
}
