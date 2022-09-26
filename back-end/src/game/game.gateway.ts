
import { Injectable, forwardRef, Logger, Inject } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {v4 as uuidv4} from "uuid"
import {GamePong} from "./GamePong"
import { AuthService } from '../auth/auth.service';
import { User } from "@prisma/client";
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from "src/chat/chat.gateway";

var timetick = 10


interface Queue {
  sock : Socket,
  id: number,
  pseudo: string
}

type EndGame = {
  score1: number,
  score2: number,
  id1: number,
  id2: number,
  pseudo1: string,
  pseudo2: string,
  winner: number
}


@WebSocketGateway({
  namespace: "game",
  cors: {
    origin : '*'
  }
  
})
@Injectable()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private chatGateway: ChatGateway, private authService: AuthService, @Inject(forwardRef(() => UserService)) private userService: UserService,  private prisma: PrismaService){}
  
  
  private queue : Queue[] = [];
  private queueBonus : Queue[] = [];
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
    let id = this.mapIdSocket.get(client.id);
    let delGame: GamePong = null;
    this.gamePongs.forEach((game) => {
      if ((game.id1 == id) && (game.idInterval === null)){
        delGame = game;
      }
    });
    if (delGame)
    {
      this.server.socketsLeave(delGame.roomID);
      this.gamePongs.delete(delGame.roomID);
    }
    this.queue = this.queue.filter(e => e.sock.id != client.id);
    this.queueBonus = this.queueBonus.filter(e => e.sock.id != client.id);
    this.mapIdSocket.delete(client.id);

  }

  handleUserID(client: Socket, user: User){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${user.id}`);
    this.gamePongs.forEach((game) => {
      if ((game.id1 == user.id || game.id2 == user.id)){
        if (game.idInterval !== null)
        {
          client.join(game.roomID);
          this.startGame(game);
        }
        else
        {
          client.emit("game start");
          client.join(game.roomID);
        }
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

    const id = this.mapIdSocket.get(client.id);
    let game: GamePong;
    let players: Queue[] = [];
    const user = await this.userService.findid(id);
    console.log(user);
    if (bonus)
    {
      if (this.queueBonus.find(e => e.id == id))
      {
        return;
      }
      this.queueBonus.push({sock: client, id: user.id, pseudo: user.pseudo})
      if (this.queueBonus.length >= 2)
      {
        players = this.queueBonus.splice(0,2);
        game = this.createGame(true);
      }
    }
    else
    {
      if (this.queue.find(e => e.id == id))
      {
        return;
      }
      this.queue.push({sock: client, id: user.id, pseudo: user.pseudo});
      if (this.queue.length >= 2)
      {
        players = this.queue.splice(0,2);
        game = this.createGame(false);
      }
    }
    if(game)
    {
      console.log("log test: ", players[0]);
      game.addPlayer(players[0].pseudo, players[0].id);
      game.addPlayer(players[1].pseudo, players[1].id);
      this.server.in(players[0].sock.id).socketsJoin(game.roomID);
      this.server.in(players[1].sock.id).socketsJoin(game.roomID);
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

  @SubscribeMessage('join')
  async handleJoin(client: Socket, roomID: string){
    const game = this.gamePongs.get(roomID);
    const id = this.mapIdSocket.get(client.id);
    const user = await this.userService.findid(id);
    if (game)
    {
      if (game.id2 == -1 || game.id2 == id)
      {
        game.addPlayer(user.pseudo, user.id);
        client.join(roomID);
        this.startGame(game);
      }
      else
      {
        client.join(roomID);
        client.emit("game start");
      }
    }
  }

  @SubscribeMessage('create private game')
  async handleCreatePrivateGame(client: Socket, id2: number, bonus: boolean){
    const id1 = this.mapIdSocket.get(client.id);
    const user1 = await this.userService.findid(id1);
    const user2 = await this.userService.findid(id2);
    const game = this.createGame(bonus);
    game.addPlayer(user1.pseudo, user1.id);
    game.addPlayer(user2.pseudo, user2.id);
    client.join(game.roomID);
    client.emit("wait game");
  }

  @SubscribeMessage('invite')
  async handleInvite(client: Socket, ID: number){
    const user = await this.userService.findid(ID);
    const game = this.searchGame(ID);
    if (!game)
    {
      client.emit("Error invite", 1);
      return;
    }
    if (game)
    {
      if (game.id2 == ID)
      {
        client.join(game.roomID);
        this.startGame(game);
      }
      else
      {
        client.emit("Error invite", 2);
      }
    }
  }


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
    //this.chatGateway.wss.emit('chatToClient', {channel : "general", pseudo : game.info.name1, texte : "start a game",});
    const idInterval : NodeJS.Timer = setInterval(this.updateGame, timetick, game, this);
    game.setIdInterval(idInterval);
    this.players.add(game.id1);
    this.players.add(game.id2);
    console.log(this.players);
    console.log(game.roomID);
    this.server.to(game.roomID).emit("game start");

  }

  createGame(bonus: boolean) {
    const roomID = uuidv4();
    const game = new GamePong(roomID, bonus)
    this.gamePongs.set(roomID, game);
    return game;
  }

  // la game doit commencer a tes 
  async stopGame(game: GamePong, winnerID: number)
  {
    clearInterval(game.idInterval);
    
    const user1 =  await this.prisma.user.findUnique({
      where: { 
      id: game.id1 },
    });
    const user2 = await this.prisma.user.findUnique({
      where: { 
      id: game.id2 },
    });
    let level1 = user1.level;
    let level2 = user2.level;
    let exp1 = (winnerID === user1.id) ? user1.experience + level2 + 1 : user1.experience;
    let exp2 = (winnerID === user2.id) ? user2.experience + level1 + 1 : user2.experience;
    while( exp1 >= Math.pow(level1 + 1,2))
    {
      level1++;
    }
    while( exp2 >= Math.pow(level2 + 1,2))
    {
      level2++;
    }
    await this.prisma.user.updateMany({
      where: { 
      id: game.id1 },
      data: {
        experience: exp1,
        level: level1,
        nbr_games: {
          increment: 1
        },
        nbr_wins: {
          increment: (winnerID === user1.id) ? 1 : 0
        },
        nbr_looses: {
          increment: (winnerID === user1.id) ? 0 : 1
        },
        goals_f: {
          increment: game.info.score1
        },
        goals_a: {
          increment: game.info.score2
        },
      }
    });
    await this.prisma.user.updateMany({
      where: { 
      id: game.id2 },
      data: {
        experience: exp2,
        level: level2,
        nbr_games: {
          increment: 1
        },
        nbr_wins: {
          increment: (winnerID === user2.id) ? 1 : 0
        },
        nbr_looses: {
          increment: (winnerID === user2.id) ? 0 : 1
        },
        goals_f: {
          increment: game.info.score2
        },
        goals_a: {
          increment: game.info.score1
        },
      }
    });
    await this.prisma.game.create({
      data: {
      id_1: game.id1,
      id_2: game.id2,
      score_1:game.info.score1,
      score_2:game.info.score2,
      winner: winnerID
      }
    });
    
    this.players.delete(game.id1);
    this.players.delete(game.id2);
    const endGame : EndGame ={
    id1 : game.id1,
    id2 : game.id2,
    pseudo1 :user1.pseudo,
    pseudo2  :user2.pseudo,
    score1  :game.info.score1,
    score2  :game.info.score2,
    winner : winnerID}
    this.server.to(game.roomID).emit("game end", endGame);
    this.server.socketsLeave(game.roomID)
    this.gamePongs.delete(game.roomID);
  }

  updateGame(game: GamePong, gateway:GameGateway){ 
    const info = game.updatePosition();
    //gateway.logger.log(`a game update`);
    gateway.server.volatile.to(game.roomID).emit("data", info);
    if (info.score1 <= 10 && info.score2 <= 10)
    {
      return;
    }
    else
    {
      if (info.score1 > info.score2)
      {gateway.stopGame(game, 1);}
      else
      {gateway.stopGame(game, 2);}
    }
  }

  searchRoomID(id: number) : string 
  {
    let roomID: string = null; 
    this.gamePongs.forEach((game) => {
      if (game.id1 == id || game.id2 == id){
        roomID = game.roomID;
      }
    });
    return roomID
  }

  searchGame(id: number) : GamePong 
  {
    this.gamePongs.forEach((game) => {
      if (game.id1 == id || game.id2 == id){
        return game;
      }
    });
    return null;
  }
};


