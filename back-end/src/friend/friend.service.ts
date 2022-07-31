import{ Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client';


@Injectable()
export class FriendService
{
    constructor(private Prisma: PrismaService){}
    
    async demfriend(user: User, src : FriendDto)
    {
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
        dem_friendBy: {
        some:{
                id :  +src.id,
            }
        }
    },
    {
        id: user.id,
        dem_friendBy: {
        some:{
                id :  +src.id,
            }
        }
    }

        ],
    },})
    if (users_2 == null)
    {
        const users = await this.Prisma.user.update( {where: { 
            id: +src.id },
            data:{
                dem_friendBy: {connect: [ {id: user.id }
                ]},
            },
        })
        return users; 
    }
        return null;  
    }


    async addFriend(user: User, src : FriendDto)
    {

        const users_2 = await this.Prisma.user.findFirst({
            where: 
            {
            id: user.id,
            dem_friendBy: {
            some:{
                    id :  +src.id,
                }
            },
        },
        })
    console.log(users_2); 
    console.log(user);
    console.log(src);

        if (users_2 != null)
        {
        const users = await this.Prisma.user.update( {where: { 
            id: +src.id },
            data:{
                friendBy: {connect: [ {id: user.id }
                ]},
                myDem_friend: {disconnect: [{id: user.id}]}
            },
        })
        await this.Prisma.user.update( {where: { 
            id: user.id },
            data:{
                friendBy: {connect: [ {id: +src.id }
                ]},
            },
        })
        return user;
        }
        return null;
    }
    async ignoreFriend(user: User, src : FriendDto)
    {
        const users_2 = await this.Prisma.user.findFirst({
            where: 
            {
            id: user.id,
            dem_friendBy: {
            some:{
                    id :  +src.id,
                }
            },
        },
        })
        if (users_2 != null)
        {
        const users = await this.Prisma.user.update( {where: { 
            id: +src.id },
            data:{
                myDem_friend: {disconnect: [{id: user.id}]}
            },
        })
        return user;
        }
        return null;

    }
    async supfriend(user: User, src : FriendDto)
    {
        await this.Prisma.user.update( {where: { 
            id: user.id },
            data:{
                friendBy: {disconnect: [ {id: +src.id }
                ]},
            },
        })
        await this.Prisma.user.update( {where: { 
            id: user.id },
            data:{
                friendBy: {disconnect: [ {id: +src.id }
                ]},
            },
        })

    }

    async listFriend(user: User)
    {
        const users = await this.Prisma.user.findUnique({where:{id: user.id},
            select:{friendBy:{
                select:{
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
                }},
                myfriends:{
                    select:{
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
                    }},
        }});
        return (users);
    }

}