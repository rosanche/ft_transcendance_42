import{ Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { ChannelDto, InviteDto } from 'src/dto/channel.dto';

@Injectable()
export class ChannelService
{
    constructor(private Prisma: PrismaService){}

    async createchannel(user: User, src : ChannelDto)
    {
        const channel = await this.Prisma.channel.create({
            data: {
                Name: src.name,
                private: src.private,
                createur: {connect: [{id: user.id}]},
                admin:{ connect:[{id: user.id}]},
                users:{ connect:[{id: user.id}]},
            },
        })
        return channel;
    }

    async mychannels(user: User)
    {
        const channel = await this.Prisma.channel.findMany({
            where: {
                
                users:
                { some: {
                id: user.id,
                },
            },
            },
            select:{
                id: true,
                Name: true,  
            },
        })
        return channel;
    }

    async listchannels(user: User)
    {
        const channel = await this.Prisma.channel.findMany({
            where: {
                
                NOT:{users:
                { some: {  
                id: user.id,
                },
            }},
                private:false,
            },
            select:{
                id: true,
                Name: true,  
            },
        })
        return channel;
    }

    async joinchannel(user: User, src : ChannelDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where:{ 
                Name: src.name,
                private: false,
            }
        })
            if( channel != null)
            {
                const channels = await this.Prisma.channel.update({
                    where: {
                        id : channel.id,
                    },
                    data:
                    {
                        users:{
                            connect:[{id: user.id}]
                        }
                    },
            })
                delete channels.hash;
                return channels;
            }
            return null;
    }

    async quitchannel(user: User, src : ChannelDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where:{ 
                Name: src.name,
                users:{
                        some : {id: user.id},
                },
                },
            })
        if (channel != null)
        {
            const channelfin = await this.Prisma.channel.update({
                where: {
                    id : channel.id,
                },
                data:
                {
                    users:{disconnect:[{id: user.id}],},
                    admin:{ disconnect:[{id: user.id}]},
                },
        }) 
        return channelfin;
        }
       return null;
    }

    async invitechannel(user: User, src : InviteDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where: {
                Name: src.name,
                OR: [
                    {
                    AND:{
                        private: false,
                        users:{
                            some: {id: user.id}
                            },
                        },
                },
                {
                    AND:{
                        private: true,
                        admin:{
                            some: {id: user.id}
                            },
                        },
                }
               
                ],
        },
        })
        if (channel != null)
        {
            const channels = await this.Prisma.channel.update(
                {
                    where :{
                        id: channel.id,
                    },
                    data: {
                        users:{
                            connect:[{pseudo: user.pseudo}]
                        },
                    }
                }
            )
            return channel;
        }
        return null;
    }
}