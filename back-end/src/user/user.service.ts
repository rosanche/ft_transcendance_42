import { Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from 'src/auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async findAll(): Promise<any[]> {
    const users = await this.Prisma.user.findMany({
      select: {
        id: true,
        pseudo: true,
        legend: true,
        profileImage: true,
        myfriends: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqSend: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqReceive: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
      },
    });
    //// console.log("$$USER bitch", users)
    return users;
  }

  async findid(nbr: number) {
    const user = await this.Prisma.user.findUnique({
      where: {
        id: +nbr,
      },
      select: {
        id: true,
        legend: true,
        profileImage: true,
        nbr_games: true,
        nbr_wins: true,
        pseudo: true,
        nbr_looses: true,
        goals_f: true,
        goals_a: true,
        myfriends: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqSend: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqReceive: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        User_channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }
  async findemail(email: string) {
    const user = await this.Prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        createdAt: true,
        updateAt: true,
        email: true,
        pseudo: true,
        legend: true,
        profileImage: true,
        firstName: true,
        lastName: true,
        nbr_games: true,
        nbr_wins: true,
        nbr_looses: true,
        goals_f: true,
        goals_a: true,
        myfriends: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
            nbr_games: true,
            nbr_wins: true,
            nbr_looses: true,
            goals_f: true,
            goals_a: true,
          },
        },
        friendReqSend: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqReceive: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        User_channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }
  async findpseudo(pseudo: string) {
    const user = await this.Prisma.user.findUnique({
      where: {
        pseudo: pseudo,
      },
      select: {
        id: true,
        createdAt: true,
        updateAt: true,
        email: true,
        pseudo: true,
        legend: true,
        profileImage: true,
        firstName: true,
        lastName: true,
        nbr_games: true,
        nbr_wins: true,
        nbr_looses: true,
        goals_f: true,
        goals_a: true,
        myfriends: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
            nbr_games: true,
            nbr_wins: true,
            nbr_looses: true,
            goals_f: true,
            goals_a: true,
          },
        },
        friendReqSend: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqReceive: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        User_channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }

  UserModif(users: any, dto: UserUpdateDto) {
    if (dto.pseudo) users.pseudo = dto.pseudo;
    const user = this.Prisma.user.update({
      where: {
        id: users.id,
      },
      data: {
        pseudo: users.pseudo,
      },
    });
    return user;
  }

  async myInfo(use: User) {
    const user = await this.Prisma.user.findUnique({
      where: {
        pseudo: use.pseudo,
      },
      select: {
        id: true,
        createdAt: true,
        updateAt: true,
        email: true,
        pseudo: true,
        profileImage: true,
        nbr_games: true,
        nbr_wins: true,
        nbr_looses: true,
        goals_f: true,
        goals_a: true,
        myfriends: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqSend: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        friendReqReceive: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        myblocked: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        blocked: {
          select: {
            id: true,
            pseudo: true,
            legend: true,
            profileImage: true,
          },
        },
        User_channel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  }

  async UserUploadedImage(users: any, src: string) {
    const user = await this.Prisma.user.update({
      where: {
        id: users.id,
      },
      data: {
        profileImage: src,
      },
    });
    // console.log("ouiuiuiu")
    return user;
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
