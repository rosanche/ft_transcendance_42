import{ Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService
{
    constructor(private Prisma: PrismaService){}

    async findAll() : Promise<any[]> {
        const user =  await this.Prisma.user.findMany({select:{
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
                    acce_freind: {
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
                    acce_freindBy: {
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
                    dem_freind: {
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
                    dem_freindBy: {
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
        return user;
    }

    async findid(nbr: number)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            id: +nbr }
        });  
        delete user.hash;
        return user;
    }
    async findemail(email: string)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            email: email }
        });  
        delete user.hash;
        return user;
    }
    async findpseudo(pseudo: string)  {
        const user = await this.Prisma.user.findUnique({
            where: { 
            pseudo: pseudo }
        });  
        delete user.hash;
        return user;
    }

    UserModif(users : any, dto : UserUpdateDto)  {
        
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
            id: users.id },
            data:{
                pseudo: users.pseudo,
                lastName: users.lastName,
                firstName: users.firstName,
                legend: users.legend
            }
        });

        return user;
    }
    UserUploadedImage(users : any, src : string)
    {
        const user = this.Prisma.user.update({
            where: { 
                id: users.id },
                data:{
                    profileImage: src
                }
            })
        return user;
    }

    async demfriend(user: User, src : FriendDto)
    {
        const users_2 = await this.Prisma.user.findFirst({
            where: {
            OR:[{
            id: user.id,
            acce_freindBy: {
            some:{
                    id :  +src.id,
                }
            }
        },
    {
        id: +src.id,
            acce_freindBy: {
            some:{
                    id :  user.id,
                }
            }
    },
    {
        id: user.id,
        dem_freindBy: {
        some:{
                id :  +src.id,
            }
        }
    },
    {
        id: user.id,
        dem_freindBy: {
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
                dem_freindBy: {connect: [ {id: user.id }
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
            dem_freindBy: {
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
                acce_freindBy: {connect: [ {id: user.id }
                ]},
                dem_freind: {disconnect: [{id: user.id}]}
            },
        })
        return user;
        }
        return null;
    }

    async listFriend(user: User)
    {
        const users = await this.Prisma.user.findUnique({where:{id: user.id},
            select:{acce_freindBy:{
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
                acce_freind:{
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