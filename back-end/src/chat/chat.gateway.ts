import {  Logger, Query ,Controller , Get, Param , UseGuards, Patch, Body, Post, UseInterceptors, Res ,UploadedFile, Request} from "@nestjs/common";
import {SubscribeMessage ,WebSocketGateway, OnGatewayInit, WsResponse,OnGatewayConnection,OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";


@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

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


    @SubscribeMessage('message')
     handelMessage(client: Socket, text: string) : WsResponse<string>
    {
        //client.emit('msgToClient, text')
        return {event: 'msgToclient', data:  text};
    }

}