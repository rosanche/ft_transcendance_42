import{ Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client';


@Injectable()
export class FriendService
{
    constructor(private Prisma: PrismaService){}
    
    async demfriend(user: User, src : FriendDto) {
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                OR:[{
                    id: user.id,
                    friendBy: {
                        some:{
                            id :  +src.id,
                        }
                    }
                },
                {
                    id: +src.id,
                    friendBy: {
                        some:{
                        id :  user.id,
                        }
                    }
                },
                {
                    id: user.id,
                    friendReqReceive: {
                        some:{
                            id :  +src.id,
                        }
                    }
                },
                {
                    id: user.id,
                    friendReqReceive: {
                        some:{
                            id :  +src.id,
                        }
                    }
                }],
            },
        })
        if (users_2 != null)
            return null;  
        const users = await this.Prisma.user.update({
                where: { 
                    id: +src.id 
                },
                data: {
                    friendReqReceive: { 
                        connect: [{
                            id: user.id
                        }]
                    },
                },
            });
        return users;   
    }


    async addFriend(user: User, src : FriendDto) {
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                id: user.id,
                friendReqReceive: {
                    some: {
                        id :  +src.id,
                    }
                },
            },
        });
        if (users_2 == null)
            return null;
        const users = await this.Prisma.user.update({
            where: { 
                id: +src.id
            },
            data: {
                friendBy: {
                    connect: [{
                        id: user.id
                    }]
                },
                friendReqSend: {
                    disconnect: [{
                        id: user.id
                    }]}
            },
        })
        await this.Prisma.user.update({
            where: { 
                id: user.id 
            },
            data: {
                friendBy: {
                    connect: [{
                        id: +src.id
                    }]
                },
            },
        });
        return users;
    }

    async ignoreFriend(user: User, src : FriendDto) {
        const users_2 = await this.Prisma.user.findFirst({
            where: {
                id: user.id,
                friendReqReceive: {
                    some: {
                        id :  +src.id,
                    }
                },
            },
        })
        if (users_2 == null)
            return null; 
        const users = await this.Prisma.user.update({
            where: { 
                id: +src.id 
            },
            data: {
                friendReqSend: {
                    disconnect: [{
                        id: user.id
                    }]
                }
            },
        });
        return user;
    }

    async supfriend(user: User, src : FriendDto) {
        const users = await this.Prisma.user.update({
            where: { 
                id: user.id
            },
            data: {
                friendBy: {
                    disconnect: [{
                        id: +src.id
                    }]
                },
            },
        });
        await this.Prisma.user.update({ 
            where: { 
                id: user.id
            },
            data: {
                friendBy: {
                    disconnect: [{
                        id: +src.id
                    }]
                },
            },
        });
        return users;
    }

    async listFriend(user: User) {
        const users = await this.Prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                friendBy: {
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
                    }
                },
                myfriends: {
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
                    }
                },
            }
        });
        return (users);
    }
}