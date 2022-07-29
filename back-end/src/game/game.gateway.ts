import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({namespace: "/game"})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  private gameRoom :string[] = [];
  private queueGame :string[];
  private SocketClient :Socket[];

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

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

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


