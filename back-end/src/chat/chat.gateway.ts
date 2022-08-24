import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from "src/auth/auth.service";


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
    
    constructor(private Prisma: PrismaService, private authService: AuthService){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
   private iddd : Map<Number, string> = new Map();

    
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

    async mpcha(user: User,client: Socket, room: string)
    {

        const channel =   await this.Prisma.mp.findFirst({where:{
            AND:{ 
            user:{
                some:{
                    id: user.id,}}
                },
                user:{
                    some:{
                        id: 1}}
                    }
        }
        )
        if (channel)
            return channel;
        return   await this.Prisma.mp.create({
            data :{
                user:{
                    connect:[{
                        id: user.id,},
                    {id: 1}],
                    }
                    }
        })

    }

     @SubscribeMessage('joinRoom')
     async handleRoomJoin(client: Socket, room: string)
     {
        const user = await this.authService.getUserFromSocket(client);
        if (user == null)
            return ;
        if ('dm' == room)
        {
                const channelup = await this.mpcha(user ,client, room);
                    client.emit('joinedRoom', room);
        }
        else
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
  
     @SubscribeMessage('chatToServer')
      async handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
        const user = await this.authService.getUserFromSocket(client);
      message.sender = user.pseudo;
       this.wss.to(message.room).emit('chatToClient', message );
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

