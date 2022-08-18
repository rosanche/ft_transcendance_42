import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private Prisma: PrismaService){}
    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');


    
        afterInit(server : any)
        {
            this.logger.log('initilized');
        }

     handleDisconnect(client: Socket)
     {
        this.logger.log(`Method not implmented. ${client.id}`);
     }


     handleConnection(client: Socket, ... args: any[])
     {
        this.logger.log(`Method not implemented. ${client.id}`);
     }


    @SubscribeMessage('msgToServer')
      async handelMessage(client: Socket, text: string)  {
       // client.emit('msgToClient, text')
        const user :  User = await this.Prisma.user.findUnique(
        {
            where:{
                id: 1,
            },
        } 
       )
       console.log("yo");
       this.wss.emit('msgToClient', user.pseudo + " : "+ text);
       await this.Prisma.post.create({data:{
            createur: {connect: [{id: user.id}]},
            mesage: text,
       },})
        //return {event: 'msgToClient', data:  text};
    }

}