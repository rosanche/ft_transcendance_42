import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import * as _ from "lodash"
import {v4 as uuidv4} from "uuid"
import {GamePong} from "./GamePong"
import { AuthService } from '../auth/auth.service';
import { User } from "@prisma/client";

var timetick = 17

@WebSocketGateway({
  namespace: "game",
  cors: {
    origin : '*'
  }
  
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private gameService: GameService, private authService: AuthService){}
  
  private queueGame :GamePong[] = [];
  private mapIdSocket = new Map<string, number>();
  private gamePongs = new Map<string, GamePong>();
  

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server)
  {
    //setInterval(this.sendInfo, 100000, this);


  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake);
    const user = await this.authService.getUserFromSocket(client);
    if (user)
    {
      this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
      this.handleUserID(client, user);
    }
    else
    {
      console.log("erreur")
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnect on the server`);
    this.mapIdSocket.delete(client.id);
    //_.remove(this.mapIdSocket, (n) => { return n.client.id == client.id;});

  }

  handleUserID(client: Socket, user: User){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${user.id}`);
    this.mapIdSocket.set(client.id, user.id);
    this.gamePongs.forEach((game) => {
      if (game.id1 == user.id || game.id2 == user.id){
        this.stopGame(game);
      }
      
    } );
    if (this.queueGame.length != 0)
    {
      this.queueGame[0].addNewPlayer(user.pseudo, user.id);
      this.queueGame.splice(0,1);
      console.log(this.queueGame.length);
    }
    else
    {
      this.startGame(user.id, user.pseudo);
    }
  };

  @SubscribeMessage('move')
  handleMessage(client: Socket, payload: {move: number}): void {

    let id = this.mapIdSocket.get(client.id);
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


  startGame(id1: number, user1: string)
  {
    this.logger.log(`a game start`);
    const roomID = this.createGame(user1, id1);
    const game = this.gamePongs.get(roomID);
    this.queueGame.push(game);


    const idInterval : NodeJS.Timer = setInterval(this.updateGame, timetick, game, this);
    game.setIdInterval(idInterval); 

  }

  createGame(username: string, id: number) : string {
    const roomID = uuidv4();
    this.gamePongs.set(roomID, new GamePong(roomID, username, id, true));
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


