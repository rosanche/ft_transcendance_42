import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import * as _ from "lodash"
import {v4 as uuidv4} from "uuid"
import {GamePong} from "./GamePong"
import { AuthService } from 'src/auth/auth.service';

var timetick = 15

@WebSocketGateway({
  namespace: "game",
  cors: {
    origin : '*'
  }
  
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private readonly gameService: GameService, private readonly authService: AuthService){}
  
  private queueGame :GamePong[];
  private socketClient :Socket[];
  private mapIdSocket : {client: Socket, id: number}[] = [];
  private gamePongs = new Map<string, GamePong>();
  

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server)
  {
    //setInterval(this.sendInfo, 100000, this);


  }

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    const user = await this.authService.getUserFromSocket(client);
    this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Socket ${client.id} disconnect on the server`);
    
    //_.remove(this.mapIdSocket, (n) => { return n.client.id == client.id;});

  }

  @SubscribeMessage('id')
  handleUserID(client: Socket, payload: {id : number, name: string}){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${payload.id}`);
    this.gamePongs.forEach((game) => {
      if (game.id1 == payload.id || game.id2 == payload.id){
        this.stopGame(game);
        game.id1 = 0;
        game.id2 = 0;
      }
      
    } )
    _.remove(this.mapIdSocket, (n) => { return n.id == payload.id;});
    this.mapIdSocket.push({client, id: payload.id});
    this.startGame(payload.id, payload.name, 0, "player2");
  };

  @SubscribeMessage('move')
  handleMessage(client: Socket, payload: {move: number, id: number}): void {
    let id = payload.id;
    let game: GamePong;
    this.gamePongs.forEach((n : GamePong) => { if(n.id1 == id || n.id2 == id ) {game = n; }});
    if(!game)
    {
      return;
    }
    if (game.id1 == id)
    {
      game.changeDirection(payload.move, game.move2);
    }
    else if (game.id2 == id)
    {
      game.changeDirection(game.move1, payload.move);
    }
  };



  sendInfo(game : GameGateway)
  {
    game.logger.log(`The length of game Room is ${game.gamePongs.size}`);
    if (game.gamePongs.size)
    {
      game.gamePongs.forEach((gameRoom, roomID, map) => {
        game.logger.log(`The name in the game Room  ${roomID} are ${gameRoom.name1}  et ${gameRoom.name2}  `);
      });
    }
  }


  startGame(id1: number, user1: string, id2: number, user2: string )
  {
    this.logger.log(`a game start`);
    const roomID = this.createGame(user1, id1);
    const game = this.gamePongs.get(roomID);
    game.id2 = id2;
    game.name2 = user2;





    const idInterval : NodeJS.Timer = setInterval(this.updateGame, timetick, game, this);
    game.setIdInterval(idInterval); 

  }

  createGame(username: string, id: number) : string {
    const roomID = uuidv4();
    this.gamePongs.set(roomID, new GamePong(roomID, username, id));
    return roomID;
  }

  stopGame(game: GamePong)
  {
    clearInterval(game.idInterval);
    // update data base
    //send victory information to player
    this.gamePongs.delete(game.roomID);
  }

  updateGame(game: GamePong, gateway:GameGateway){ 
    const info = game.updatePosition();
    //gateway.logger.log(`a game update`);
    gateway.server.volatile.emit("data", info);
    if (info.score1 <= 9 && info.score2 <= 9)
    {
      return;
    }
    else
    {
      gateway.stopGame(game);
    }
  }
}


