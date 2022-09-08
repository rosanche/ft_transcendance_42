import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
    
    constructor(private Prisma: PrismaService, private authService: AuthService){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
   private iddd : Map<Number, string> = new Map();
   private mp : Number[];
   private idchar 

    
        afterInit(server : any)
        {
            this.logger.log('initilized!');
        }

    async  handleDisconnect(client: Socket)
     {
        this.logger.log(`Method not implmented. ${client.id}`);
        const user = await this.authService.getUserFromSocket(client);
        if (user)
            this.iddd.delete(user.id);
     }

     async handleConnection(client: Socket, @Res() res, ... args: any[])
     {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            this.iddd[user.id] = client.id;
          
                client.join("general");
                client.to("general").emit('joinedRoom', "typescript")
        }
        else
        {
            client.to("typescrsipt").emit('joinedRoom', "typescript")
            client.disconnect();
        }
     }

    async mpcha(user: User,client: Socket, user2: User)
    {

        const channel =   await this.Prisma.mp.findFirst({where:{
               OR:[ {userId1: user.id,
                        userId2: user2.id},
                    {
                    userId1: user2.id,
                    userId2: user.id}],
        }
        });
        if (channel)
            return channel;
        return   await this.Prisma.mp.create({
            data :{
                user:{
                    connect:[{
                        id: user.id,},
                    {id: user2.id }],
                    },
                    userId1: user.id,
                    userId2:  user2.id,
                    blocked: false,
                    }
        })
    }

    @SubscribeMessage('joindm')
     async handleRoomdm(client: Socket, name: string)
     {
        const user = await this.authService.getUserFromSocket(client);
        const user2 = await this.Prisma.user.findUnique({
            where:{
                pseudo: name,
            },
        });

        if (user == null)
            return ;
        const channelup = await this.mpcha(user ,client, user2);
        this.mp[0] = channelup.userId1;
        this.mp[1] = channelup.userId2;
        client.emit('joinedRoom', 'dm');
        this.wss.to(this.iddd[user2.id]).emit('joinedRoom', 'dm');
     }


     @SubscribeMessage('joinRoom')
     async handleRoomJoin(client: Socket, room: string)
     {
        const user = await this.authService.getUserFromSocket(client);
        if(room != 'dm')
            client.join(room);
        client.emit('joinedRoom', room);
     }

     @SubscribeMessage('leaveRoom')
      async handleRoomLeave(client: Socket, room: string)
     {
        console.log("oui");
        if('dm' == room)
        {
            const user = await this.authService.getUserFromSocket(client);
            const channelup = await this.Prisma.channel.update({where:{
                name: room
            },
                data:{
                users:{ 
                    disconnect:{
                        id: user.id}}
                    }
            });
            
        }
        client.join(room);
        client.emit('leftRoom', room)
     }

     @SubscribeMessage('blocked')
      async blockeduser(client: Socket, src: { pseudo: string, room: string, type: string,  time : number, description : string})
     {
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        return "";
        const cha = await this.Prisma.channel.findFirst({
            where:
            {
                name: src.room,
                users : {
                    some : 
                        {
                    pseudo : src.pseudo,
                    }
                },
                admin : {
                    some :
                        {
                    id : user.id,
                    }
                }
            },
        })
        if (cha)
        {
            if (src.type !== "ban")
                src.type = "mute";
            const ban = await this.Prisma.ban.create({
                data:
                {
                    timeBan: src.time,
                    finshban: Date.now() + 60000 * src.time,
                    mute_ban: src.type,
                    active: true,
                    iduser: 1,
                }
            })  

        }
    }
  
     @SubscribeMessage('chatToServer')
      async handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
        const user = await this.authService.getUserFromSocket(client);
      message.sender = user.pseudo;
      if (message.room != "dm")
            this.wss.to(message.room).emit('chatToClient', message );
       else
       {
            this.wss.to(this.iddd[+this.mp[0]]).emit('chatToClient', message );
            this.wss.to(this.iddd[+this.mp[1]]).emit('chatToClient', message );
       }
       if (message.room == "dm")
       {
        const cha = await this.Prisma.channel.findUnique({
            where:{
                name : message.room,
            }
        });
       await this.Prisma.post.create({data:{
        mesage: message.message,
        userId: user.id,
        destById: cha.id
        },})
    }
     }

     @SubscribeMessage('TEST')
    async mess(client: Socket, text: string)  
    {
        console.log(text);
    }

    @SubscribeMessage('msgToServer')
      async handelMessage(client: Socket, text: string)  {
        client.emit('msgToClient, text')
       const user = await this.authService.getUserFromSocket(client);
       if (user)
       {
       console.log("yoa");
       this.wss.emit('msgToClient', user.pseudo + " : "+ text);
       await this.Prisma.post.create({data:{
            mesage: text,
            userId: user.id
       },})
    }
    }
    
}

