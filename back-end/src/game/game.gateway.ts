import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';


@WebSocketGateway({
  namespace: "game"
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private gameService: GameService){}
  private gameRoom :string[] = [];
  private queueGame :string[];
  private socketClient :Socket[];
  private mapIdSocket : {client: Socket, id: Number}[] 

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server)
  {
    setInterval(this.sendPosition, 100000, this);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Socket ${client.id} connect on the server`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnect on the server`);
  }

  @SubscribeMessage('id')
  handleUserID(client: Socket, payload: {id : number}){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${payload.id}`);
    this.mapIdSocket.push({client, id: payload.id})
  };

  @SubscribeMessage('move')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  };

  sendPosition(game : GameGateway)
  {
    game.logger.log(`The length of game Room is ${game.gameRoom.length}`);
    if (game.gameRoom.length)
    {
      game.gameRoom.forEach(element => {
        game.server.to(element).emit("info");
      });
    }
  }
}


