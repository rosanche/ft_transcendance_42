import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;

    private logger : Logger = new Logger('ChatGateway');


    
        afterInit(server : any)
        {
            this.logger.log('initilized');
        }

     handleDisconnect(client: Socket)
     {
        this.logger.log('Method not implmented. ${client.id}');
     }

     handleConnection(client: Socket, ... args: any[])
     {
        this.logger.log('Method not implemented. ${client.id}');
     }


    @SubscribeMessage('msgToServer')
     handelMessage(client: Socket, text: string) : void {
       // client.emit('msgToClient, text')
       this.wss.emit('msgToClient', text);
        //return {event: 'msgToClient', data:  text};
    }

}