
import { Injectable, forwardRef, Logger, Inject } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import * as _ from "lodash"
import {v4 as uuidv4} from "uuid"
import {GamePong} from "./GamePong"
import { AuthService } from '../auth/auth.service';
import { User } from "@prisma/client";
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

var timetick = 17

@WebSocketGateway({
  namespace: "game",
  cors: {
    origin : '*'
  }
  
})
@Injectable()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private authService: AuthService, @Inject(forwardRef(() => UserService)) private userService: UserService,  private prisma: PrismaService){}
  
  
  private queue : {id: string, pseudo: string}[] = [];
  private queueBonus : {id: string, pseudo: string}[] = [];
  private mapIdSocket = new Map<string, number>();
  private gamePongs = new Map<string, GamePong>();
  private players = new Set<number>();
  

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server)
  {
    //setInterval(this.sendInfo, 100000, this);


  }

  async handleConnection(client: Socket, ...args: any[]){
    console.log(client.handshake);
    const user = await this.authService.getUserFromSocket(client);
    if (user)
    {
      this.logger.log(`Socket ${client.id} connect on the server with pseudo ${user.pseudo}`);
      this.handleUserID(client, user);
      this.mapIdSocket.set(client.id, user.id);
      client.emit("user info", {id: user.id, pseudo: user.pseudo});
    }
    else
    {
      console.log("erreur d'authentification");
      client.emit("auth error");
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket ${client.id} disconnect on the server`);
    this.queue = this.queue.filter(e => e.id != this.mapIdSocket.get(client.id));
    this.queueBonus = this.queueBonus.filter(e => e.id != this.mapIdSocket.get(client.id));
    this.mapIdSocket.delete(client.id);
    

  }

  handleUserID(client: Socket, user: User){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${user.id}`);
    this.gamePongs.forEach((game) => {
      if (game.id1 == user.id || game.id2 == user.id){
        if (game.idInterval === null)
        client.emit("game start");
        client.join(game.roomID);
      }
    });
    // if (this.queueGame.length != 0)
    // {
    //   this.queueGame[0].addNewPlayer(user.pseudo, user.id);
    //   this.queueGame.splice(0,1);
    //   console.log(this.queueGame.length);
    // }
    // else
    // {
    //   this.startGame(user.id, user.pseudo, true);
    // }
  };

  @SubscribeMessage('queue')
  async handleQueue(client: Socket, bonus: boolean){

    let id = this.mapIdSocket.get(client.id);
    let game: GamePong;
    let players: {id: number, pseudo: string}[] = [];
    const user = await this.userService.findid(id);
    console.log(user);
    if (bonus)
    {
      if (this.queueBonus.find(e => this.mapIdSocket.get(e.id) == id))
      {
        return;
      }
      this.queueBonus.push({id: user.id, pseudo: user.pseudo})
      if (this.queueBonus.length >= 2)
      {
        players = this.queueBonus.splice(2,0);
        game = this.createGame(true);
      }
    }
    else
    {
      if (this.queue.find(e => this.mapIdSocket.get(e.id) == id))
      {
        return;
      }
      this.queue.push({id: user.id, pseudo: user.pseudo});
      if (this.queue.length >= 2)
      {
        players = this.queue.splice(2,0);
        game = this.createGame(false);
      }
    }
    if(game)
    {
      const socket1 = await this.server.in(theSocketId).fetchSockets();
      const socket2 = await this.server.in(theSocketId).fetchSockets();
      game.addPlayer(players[0].pseudo, players[0].id);
      game.addPlayer(players[1].pseudo, players[1].id);
      this.startGame(game);
    }
  };

  @SubscribeMessage('move')
  handleMove(client: Socket, payload: {move: number}): void {

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

  getPlayingUser() : Set<number>
  {
    console.log(this.players)
    return this.players;
  }


  startGame(game :GamePong)
  {
    this.logger.log(`a game start`);
    
    const idInterval : NodeJS.Timer = setInterval(this.updateGame, timetick, game, this);
    game.setIdInterval(idInterval);
    this.players.add(game.id1);
    this.players.add(game.id2);
    this.server.to(game.roomID).emit("game start");

  }

  createGame(bonus: boolean) {
    const roomID = uuidv4();
    const game = new GamePong(roomID, bonus)
    this.gamePongs.set(roomID, game);
    return game;
  }

  stopGame(game: GamePong, leaverID: number = 0)
  {
    clearInterval(game.idInterval);
    // update data base
    //send victory information to player
    this.players.delete(game.id1);
    this.players.delete(game.id2);
    this.server.to(game.roomID).emit("game end");
    this.server.socketsLeave(game.roomID)
    this.gamePongs.delete(game.roomID);
  }

  updateGame(game: GamePong, gateway:GameGateway){ 
    const info = game.updatePosition();
    //gateway.logger.log(`a game update`);
    gateway.server.volatile.to(game.roomID).emit("data", info);
    if (info.score1 <= 9 && info.score2 <= 9)
    {
      return;
    }
    else
    {
      gateway.stopGame(game);
    }
  }
};


