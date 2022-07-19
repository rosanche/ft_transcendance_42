import{ Injectable } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
                    firstName: true,
                    lastName: true,
                    nbr_games: true,
                    nbr_wins: true,
                    nbr_looses: true,
                    goals_f: true,
                    goals_a: true
        },}); 
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

     UserModif(any : any, dto : AuthDto)  {
        
        
        const user =  this.Prisma.user.update({
            where: { 
            id: any.id },
            data:{
                pseudo: dto.pseudo
            }
        });

        return user;
    }
}
