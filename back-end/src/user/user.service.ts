import { Injectable} from "@nestjs/common";
import { FriendDto, UserUpdateDto } from 'src/auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService
{
    constructor(private Prisma: PrismaService){}

    async findAll() : Promise<any[]> {
        const user =  await this.Prisma.user.findMany({
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
                    }
                },
                    myDem_friend: {
                        select: {
                            id: true,
                            pseudo: true,
                            legend: true,
                            profileImage: true,
                    }
                },
                    dem_friendBy: {
                        select: {
                            id: true,
                            pseudo: true,
                            legend: true,
                            profileImage: true,
                        }
                    },
                    User_channel: {
                        select: {
                        id: true,
                        name: true,
                        }
                    },
            }
        }); 
        return user;
    }

    async findid(nbr: number)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            id: +nbr 
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
                }
            },
                myDem_friend: {
                    select: {
                        id: true,
                        pseudo: true,
                        legend: true,
                        profileImage: true,
                    }
                },
                dem_friendBy: {
                    select: {
                        id: true,
                        pseudo: true,
                        legend: true,
                        profileImage: true,
                    }
                },
                User_channel:{
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        });  
        return user;
    }
    async findemail(email: string)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            email: email 
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
                }
            },
            myDem_friend: {
                select:{
                    id: true,
                    pseudo: true,
                    legend: true,
                    profileImage: true,
                }
            },
            dem_friendBy: {
                select: {
                    id: true,
                    pseudo: true,
                    legend: true,
                    profileImage: true,
                }
            },
            User_channel: {
                select: {
                    id: true,
                    name: true,
                }
            },
        }
    });  
        return user;
    }
    async findpseudo(pseudo: string)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            pseudo: pseudo 
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
                }
            },
            myDem_friend: {
                select: {
                    id: true,
                    pseudo: true,
                    legend: true,
                    profileImage: true,
                }
            },
            dem_friendBy: {
                select: {
                    id: true,
                    pseudo: true,
                    legend: true,
                    profileImage: true,
                }
            },
            User_channel: {
                select: {
                    id: true,
                    name: true,
                }
            },
        }
    });  
        return user;
    }

    UserModif(users : any, dto : UserUpdateDto) {    
        if (dto.pseudo)
            users.pseudo = dto.pseudo;
        if (dto.firstName)
            users.firstName = dto.firstName;
        if (dto.lastName)
        users.lastName = dto.lastName;
        if (dto.legend)
            users.legend = dto.legend;
        const user =  this.Prisma.user.update({
            where: { 
            id: users.id 
            },
            data: {
                pseudo: users.pseudo,
                lastName: users.lastName,
                firstName: users.firstName,
                legend: users.legend
            }
        });
        return user;
    }

    async myInfo(use : User) {
        const user = await this.Prisma.user.findUnique({
            where: { 
            pseudo: use.pseudo
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
                }},
                myDem_friend: {
                    select: {
                        id: true,
                        pseudo: true,
                        legend: true,
                        profileImage: true,
                }},
                dem_friendBy: {
                    select: {
                        id: true,
                        pseudo: true,
                        legend: true,
                        profileImage: true,
                    }
                },
                User_channel:{
                    select: {
                        id: true,
                        name: true,
                    }
                },
            }
        });
        return user;
    }

    UserUploadedImage(users : any, src : string) {
        const user = this.Prisma.user.update({
            where: { 
                id: users.id 
            },
            data: {
                    profileImage: src
            }
        });
        return user;
    }

    async findGameID(user : User)
    {

        return (
            await this.Prisma.game.findMany(
                {
                    where: {
                        OR :[
                        {
                            id_1: user.id,
                        },
                        {
                            id_2: user.id,
                        },
                        ]
                    }
                }
            )
        );
    }

}