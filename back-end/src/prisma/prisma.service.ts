import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL_WITH_SCHEMA')
                }
            }
        })

        
    }

    exclude<User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> 
    {
        for (let key of keys) {
          delete user[key]
        }
        return user
    }
}
