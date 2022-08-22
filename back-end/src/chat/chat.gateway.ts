import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from "src/auth/auth.service";

/*
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string, room: string, message: string }) {
    this.wss.to(message.room).emit('chatToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string ) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
handleRoomLeave(client: Socket, room: string ) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

}
*/


@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
    
    constructor(private Prisma: PrismaService, private authService: AuthService){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');
    private cli : any[];

    
        afterInit(server : any)
        {
            this.logger.log('initilized!');
        }

     handleDisconnect(client: Socket)
     {
        this.logger.log(`Method not implmented. ${client.id}`);
     }

     async handleConnection(client: Socket, @Res() res, ... args: any[])
     {
        const user = await this.authService.getUserFromSocket(client);
        console.log("ok");
        if (user)
        {
            this.cli[user.pseudo] = client.id;
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
            if (user.id%2 == 0)
            {
                client.join("general");
                console.log("AAAAAAAAAAAAAAAAAAAAAA")
            }
        }
        else
        {
            client.to("typescrsipt").emit('joinedRoom', "typescript")
            client.disconnect();
        }
     }

     @SubscribeMessage('joinRoom')
     async handleRoomJoin(client: Socket, room: string)
     {
        if ('dm' == room)
        {
            const user = await this.authService.getUserFromSocket(client);
            const channel = await this.Prisma.channel.findFirst({where:{
                name: "dm",
                private: false,
                NOT:{ 
                users:{
                    some:{
                        id: user.id}}
                    } 
            }}
            )
            console.log(channel);
            if (channel)
            {
                const channelup = await this.Prisma.channel.update({where:{
                    id: channel.id
                },
                    data:{
                    users:{
                        connect:{
                            id: user.id}}
                        }
                });
               
                client.emit('joinedRoom', room)
            }
        }
        else
        {
        
        client.emit('joinedRoom', room)
        }
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

