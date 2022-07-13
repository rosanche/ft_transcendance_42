import{ Injectable } from '@nestjs/common';
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
}

