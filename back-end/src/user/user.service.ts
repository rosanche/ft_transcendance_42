import{ Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService
{
    constructor(private Prisma: PrismaService){}

    findAll() : Promise<any[]> {
        return this.Prisma.user.findMany();  
    }
}

