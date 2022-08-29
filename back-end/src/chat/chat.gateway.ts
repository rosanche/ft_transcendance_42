import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Jwt2FAGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from "../auth/auth.service";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    constructor(private Prisma: PrismaService, private authService: AuthService){}
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
     

     async handleConnection(client: Socket, ... args: any[])
     {
        console.log(client.handshake);
        const user = await this.authService.getUserFromSocket(client);
        if (user)
        {
            console.log(user);
            this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
        }
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