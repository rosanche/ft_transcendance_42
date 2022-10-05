import{ Injectable } from '@nestjs/common';
import { FriendDto, UserUpdateDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { ChannelDto, InviteDto } from '../dto/channel.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class ChannelService
{
    constructor(private Prisma: PrismaService){}

    async createchannel(user: User, src : ChannelDto) {
        if (src.password) {
            const hash : string = await bcrypt.hash(src.password, 3);
            const channel = await this.Prisma.channel.create({
                data: {
                    name: src.name,
                    private: (src.private == 1),
                    createurID: user.id,
                    admin: { 
                        connect: [{
                            id: user.id}
                        ]},
                    users: {
                        connect: [{
                            id: user.id
                        }]
                    },
                    hash,
                },
            })
            return channel;
        }
        const channel = await this.Prisma.channel.create({
            data: {
                name: src.name,
                private: (src.private == 1),
                createurID: user.id,
                admin: { 
                    connect: [{
                        id: user.id
                    }]
                },
                users: {
                    connect: [{
                        id: user.id
                    }]
                },
            },
        })
        return channel;
    }

    async mychannels(user: User)
    {
        const channel = await this.Prisma.channel.findMany({
            where: {
                users: {
                    some: {
                        id: user.id,
                    },
                },
            },
            select: {
                id: true,
                name: true,  
            },
        });
        return channel;
    }

    async listchannels(user: User)
    {
        const channel = await this.Prisma.channel.findMany({
            where: {
                NOT:{
                    users: {
                        some:{  
                    id: user.id,
                },
                }
            },
                private: false,
            },
            select: {
                id: true,
                name: true,  
            },
        });
        return channel;
    }

    async listchannelusers(user: User, id : number)
    {
        const channel = await this.Prisma.channel.findFirst({
            where:{
                id: id,
                admin:{
                    some:{
                        id : user.id
                    }
                }
            }
        });
    if (channel) {
        return await this.Prisma.user.findMany({
            where: {
                admin_channel: {
                    some:{  
                        id: user.id,
            }
        },
                User_channel: {
                        some:{  
                            id: id,
                }
            },
        },
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
       
    }
    return null;
    }

    async joinchannel(user: User, src : ChannelDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where:{ 
                name: src.name,
                private: false,
            }
        });
            if( channel == null)
                return null;
            
            const isVerify =  await (channel.hash === null || bcrypt.compare(src.password, user.hash));
            if (!isVerify)
                return null;   
            const channels = await this.Prisma.channel.update({
                where: {
                    id : channel.id,
                },
                data: {
                    users: {
                        connect:[{id: user.id}]
                    }
                },
            });
            delete channels.hash;
            return channels;
    }

    async quitchannel(user: User, src : ChannelDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where: { 
                name: src.name,
                users: {
                        some:{
                            id: user.id
                        },
                },
            },
        });

        if (channel == null)
            return null;
        if (channel.createurID == user.id)
            return null
        const channelfin = await this.Prisma.channel.update({
            where: {
                id : channel.id,
            },
            data: {
                users: {
                    disconnect: [{
                        id: user.id
                    }]
                },
                admin: {
                    disconnect:[{
                        id: user.id
                    }]
                },
            },
        });
        return channelfin;
    }
    
    async blockedchannel(user : User, src : InviteDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where: { 
                AND: [
                    {
                        name: src.name,
                    },
                    {
                        admin: {
                            some: {
                                id: user.id
                            }
                        },
                    },
                    {
                        users: { 
                            some: {
                                pseudo : src.pseudo
                            }
                        },
                    }
                ]
            }
        });
        if (channel == null)
            return null;
        return await this.Prisma.channel.update({
            where: {
                id : channel.id,
            },
            data: {
                blocked: {
                    connect: [{
                        pseudo: user.pseudo
                    }]
                },
            }
        });
    }

    async invitechannel(user: User, src : InviteDto)
    {
        const channel = await this.Prisma.channel.findFirst({
            where: {
                name: src.name,
                OR: [{
                    AND:{
                        private: false,
                        users: {
                            some: {id: user.id}
                            },
                        },
                    },
                    {
                        AND: {
                            private: true,
                            admin: {
                                some: {id: user.id}
                            },
                        },
                }],
            },
        });
        if (channel != null)
         return null;
            const channels = await this.Prisma.channel.update({
                where: {
                        id: channel.id,
                },
                data: {
                    users: {
                        connect:[{pseudo: user.pseudo}]
                    },
                }
            })
        return channels;
    }
    async newAdmin(user: User, src : InviteDto) {
        const user2 = await this.Prisma.user.findUnique({
            where:{
                pseudo: src.pseudo,
            }
        });
        if (!user2)
            return null;
            const Channel =  await this.Prisma.channel.findFirst({
                where:{
                    AND: [{
                        name: src.name,
                    },
                    {
                        users: {
                            some:{
                                id: user2.id,
                            }
                        }
                    },
                    {
                        createurID: user.id, 
                    }]
                }
            });
            if (!Channel)
                return null;
        return await this.Prisma.channel.update({
            where:{
               name: Channel.name,
            },
            data: {
                admin: {
                    connect: [{
                        id: user2.id
                    }]
                }
            }
        });
    }

    async updateChanel(user: User, src : ChannelDto) {
        if (src.password)
        {
            const hash : string = await bcrypt.hash(src.password, 3);
            const channel = await this.Prisma.channel.updateMany({
                where: { 
                    AND: [{
                        name: src.name,
                    },
                    {
                        createurID: user.id,
                    }]
                },
                data: {
                    hash,
                }
            });
            return channel;
        }
        const channel = await this.Prisma.channel.updateMany({
            where: { 
                name: src.name,
                createurID: user.id,
            },
            data: {
                hash: null,
            }
        });
        return channel;
    }
}