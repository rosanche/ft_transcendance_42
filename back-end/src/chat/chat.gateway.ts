import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {ConnectedSocket , SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User, Channel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

    constructor(private Prisma: PrismaService, private authService: AuthService){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
    private iddd : Map<Number, Number[]> = new Map();
    private banactive  = new  Map<string , Map<Number, Boolean> >();
    private muteactive = new Map<string, Map<Number, Boolean> >();
    private mp  = new Map<string, Number[]>;

    

    async ban_or_not(cha : string, id: number) {
        const ban = await this.Prisma.ban.findMany({
            where:{
                active: true,
                Channel: {
                    some: {
                        name: cha,
                    }
                },
                id: id,
            }
        });
        this.banactive.get(cha).set(id ,false);
        this.muteactive.get(cha).set(id ,false);
        if (!ban)
            return  true;
        for (let i : number = 0; ban[i]; i++) {
            if (ban[i].finshBan < Date.now()) {
                await this.Prisma.ban.update({
                    where: {
                        id: ban[i].id,
                    },
                    data: {
                        active: false,
                    }
                });
            } 
            else {
                if (ban[i].muteBan == "ban")
                    this.banactive.get(cha).set(id ,true);
                else
                    this.muteactive.get(cha).set(id ,true);
            }
        }
        return !(this.banactive.get(cha).get(id) || this.muteactive.get(cha).get(id));
    }

    async isbancha(user : User,  room : string)
    {
        return await !(this.ban_or_not(room, user.id) || this.banactive.get(room).get(user.id)) 
    }

    async isbanmute(user : User,  room : string)
    {
        return await !(this.ban_or_not(room, user.id) || this.muteactive.get(room).get(user.id)) 
    }

    async afterInit(server : any) {
        this.logger.log('initilized!');
        const cha  = await this.Prisma.channel.findMany({
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        id: true,
                        pseudo: true,
                        }
                    },
                }
        });
        console.log(cha);
        for (let i :number = 0; cha[i]; i++) {
            const a = new Map<number, Boolean>()
            await this.banactive.set(cha[i].name, new Map<Number, Boolean>());
            await this.muteactive.set(cha[i].name, new Map<Number, Boolean>());
            for (let n :number = 0; cha[i].users[n]; n++) {
                await this.banactive.get(cha[i].name).set(cha[i].users[n].id, false)
                console.log(this.banactive.get(cha[i].name).get(cha[i].users[n].id));
                this.ban_or_not(cha[i].name, cha[i].users[n].id)
            }
            console.log(`${cha[i].name} ha oui d'accord c'est toi`);
        }
    }

    async  handleDisconnect(client: Socket) {
        this.logger.log(`Method not implmented. ${client.id}`);
        const user = await this.authService.getUserFromSocket(client);
        if (user)
            this.iddd.delete(user.id);
    }

    async handleConnection( client: Socket, @Res() res, ... args: any[]) {
        const user = await this.authService.getUserFromSocket(client);
        if (user) {
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            this.iddd[user.id] = client.id;
            client.join("general");
            client.to("general").emit('joinedRoom', "typescript")
        }
        else {
            client.to("typescrsipt").emit('joinedRoom', "typescript")
            client.disconnect();
        }
     }

    async mpcha(user: User,client: Socket, user2: User) {
        const channel =  await this.Prisma.mp.findFirst({
            where: {
                OR: [{ 
                        userID1: user.id,
                        userID2: user2.id
                    },
                    {
                        userID1: user2.id,
                        userID2: user.id
                    }],
            }
        });
        if (channel)
            return channel;
        return await this.Prisma.mp.create({
            data: {
                user: {
                    connect: [{
                        id: user.id,
                    },
                    {
                        id: user2.id 
                    }],
                },
                userID1: user.id,
                userID2:  user2.id,
                blocked: false,
            }
        });
    }

    @SubscribeMessage('joindm')
    async handleRoomdm(client: Socket, name: string) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findFirst({
            where: {
                pseudo: name,
                NOT: {
                    OR: [{
                        blocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    },
                    {
                        myblocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    }]
                }
            }
        });
        if (user === null || user2 === null)
            return ;
        const channelup = await this.mpcha(user, client, user2);
        this.mp[0] = channelup.userID1;
        this.mp[1] = channelup.userID2;
        client.emit('joinedRoom', 'dm');
        this.wss.to(this.iddd[user2.id]).emit('joinedRoom', 'dm');
     }


     @SubscribeMessage('joinRoom')
     async handleRoomJoin(client: Socket, room: string) {
        const user = await this.authService.getUserFromSocket(client);
        if(room != 'dm')
        {
            if (!this.isbancha(user, room))
            {
                client.join(room);
                client.emit('joinedRoom', room);
            }
        }
        else
        {
            return ;
        }
    }

    @SubscribeMessage('leaveRoom')
    async handleRoomLeave(client: Socket, room: string) {
        console.log("oui");
        if('dm' == room) {
            const user = await this.authService.getUserFromSocket(client);
            const channelup = await this.Prisma.channel.update({
                where: {
                    name: room
                },
                data: {
                    users:{ 
                        disconnect:
                        {
                            id: user.id
                        }
                    }
                }
            });
        }
        client.join(room);
        client.emit('leftRoom', room)
    }

    @SubscribeMessage('blockedUser')
    async blockedUser(client: Socket, src: { pseudo: string, room: string, type: string,  time : Number, description : string}) {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where: {
                pseudo: src.pseudo,
            }
        });
        if (user2 && user) {
            return await this.Prisma.user.update({
                where: {
                    id : user.id,
                },
                data: {
                    myblocked:{
                        connect:[{
                        id : user2.id,
                        }]
                    }
                }
            });
        }
        return null;
    }
    
    @SubscribeMessage('blockedChannel')
    async blockedChannel(client: Socket, src: { pseudo: string, room: string, type: string,  time : Number, description : string}) {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
            return "";
        const cha = await this.Prisma.channel.findFirst({
            where: {
                name: src.room,
                users: {
                    some: {
                        pseudo : src.pseudo,
                    }
                },
                admin: {
                    some:{
                        id : user.id,
                    }
                }
            },
        });
        if (cha) {
            if (src.type !== "ban")
                src.type = "mute";
            const ban = await this.Prisma.ban.create({
                data:
                {
                    timeBan: +src.time,
                    finshBan: Date.now() + 60000 * +src.time,
                    muteBan: src.type,
                    active: true,
                    iduser: 1,
                }
            });  
            this.wss.to(this.iddd[src.pseudo]).emit('chatTo' + src.type, src);
        }
    }

    @SubscribeMessage('mpToServer')
    async handleMessageMp(client: Socket, message: { sender: string, pseudo: String, message: string }) {
        const user = await this.authService.getUserFromSocket(client);
        message.sender = user.pseudo;
        const user2 = await this.Prisma.user.findFirst({
            where: {
                pseudo: message.sender,
                NOT: {
                    OR: [{
                        blocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    },
                    {
                        myblocked: {
                            some: {
                                id: user.id,     
                            }
                        }
                    }]
                }
            }
        });
        if (user2)
        {
            this.wss.to(this.iddd[+this.mp[0]][0]).emit('chatToClient', message );
            this.wss.to(this.iddd[+this.mp[1]][0]).emit('chatToClient', message );
        }
    }

    @SubscribeMessage('channelToServer')
    async handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
        const user = await this.authService.getUserFromSocket(client);
        message.sender = user.pseudo;
        const ban = await this.Prisma.ban.findMany({
            where: {
                active: true,
                Channel: {
                    some: {
                        name: message.room
                    }
                },
                id: user.id,
            }
        });
        if (!(this.banactive.get(message.room).get(user.id) || this.muteactive.get(message.room).get(user.id)) 
            || await this.ban_or_not(message.room, user.id)) {
            
            const cha = await this.Prisma.channel.findUnique({
                where:{
                    name : message.room,
                }
            })
            this.Prisma.post.create({
                data: {
                    message: message.message,
                    userID: user.id,
                    destByID: cha.id
                }
            });
            const block =  await this.Prisma.user.findUnique({
                where:{
                    id: user.id,
                },
                select:
                {
                    blocked: {
                        select: {
                            pseudo : true,
                        }
                    }
                }
            });
            this.wss.to(message.room).emit('chatToClient', message, block); 
        }
     }

    @SubscribeMessage('msgToServer')
    async handelMessage(client: Socket, text: string) {
        client.emit('msgToClient, text')
        const user = await this.authService.getUserFromSocket(client);
        if (user) {
            this.wss.emit('msgToClient', user.pseudo + " : "+ text);
            await this.Prisma.post.create({
                data: {
                    message: text,
                    userID: user.id
                }
            });
        }
    }
}
