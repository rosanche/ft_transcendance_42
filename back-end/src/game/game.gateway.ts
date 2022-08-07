import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import * as _ from "lodash"
import {v4 as uuidv4} from "uuid"



type BonusPong = 
{
    x : number,
    y : number,
    type: string,
    owner: null | string;
}

type PongInfo = {
  paddle1Y : number,
  paddle2Y : number,
  ballX: number,
  ballY: number,
  score1: number,
  score2: number
  bonus : BonusPong [] | null
}

class GamePong {

   xMax: number;
   yMax: number;
   paddleX1: number;
   paddleX2:number;
   paddleHeight: number;
   ballSpeed: number;
   paddleWidth : number;
   ballSize : number;
   roomID : string;
   idInterval : NodeJS.Timer | null;
   info : PongInfo ;
   move1 : number;
   move2 : number;
   paddleSpeed1: number;
   paddleSpeed2: number;
   tickDuration: number;
   angleBall: number;
   name1 : string;
   name2 : string;
   id1 : number;
   id2 : number;


  constructor(name1: string, id1: number, name2: string, id2:number){

    this.xMax = 1600;
    this.yMax = 900;
    this.paddleX1 = 40;
    this.paddleX2 = this.xMax - (this.paddleX1 + this.paddleWidth);
    this.paddleHeight = 100;
    this.ballSpeed = 10;
    this.paddleSpeed1 = 10;
    this.paddleSpeed2 = 10;
    this.angleBall = Math.PI / 4;
    this.paddleWidth = 10;
    this.ballSize = 10;
    this.roomID = uuidv4();
    this.idInterval = null;
    this.info ={
     paddle1Y : (this.yMax - this.paddleHeight) / 2,
     paddle2Y : (this.yMax - this.paddleHeight) / 2,
     ballX: this.xMax /2,
     ballY: this.yMax /2,
     score1: 0,
     score2: 0,
     bonus : null
   }
    this.move1  = 0;
    this.move2  = 0;
    this.name1 = name1;
    this.name2 = name2;
    this.id1 = id1;
    this.id2 = id2;
    this.tickDuration = 30
  }

  changeDirection(direction1: number, direction2: number)
  {
    this.move1 = direction1;
    this.move2 = direction2;
  }

  setIdInterval(idInterval: NodeJS.Timer)
  {
    this.idInterval = idInterval;
  }

  updatePosition(){
    var newX : number;
    var newY : number;
    
    this.updatePaddle();
    [newX,newY] = this.limitCollision();

    this.info.ballX = newX;
    this.info.ballY = newY;
    console.log(this.info);
    if (newX + this.ballSize >= this.paddleX1 && newX - this.ballSize <= this.paddleX1 + this.paddleWidth 
      && newY + this.ballSize >= this.info.paddle1Y && newY - this.ballSize <= this.info.paddle1Y + this.paddleHeight)
    {
      console.log('conditionX');
      this.paddleCollision(this.paddleX1, this.info.paddle1Y);
    }
    else if(newX + this.ballSize >= this.paddleX2 && newX - this.ballSize <= this.paddleX2 + this.paddleWidth 
      && newY + this.ballSize >= this.info.paddle2Y && newY - this.ballSize <= this.info.paddle2Y + this.paddleHeight)
    {
      console.log('conditionY');
      this.paddleCollision(this.paddleX2, this.info.paddle2Y);
    }
    
    return (this.info);
  }

  private paddleCollision(paddleX: number, paddleY: number) {
    var paddle = {x: paddleX ,y: paddleY};

      if (this.info.ballY >= paddle.y && this.info.ballY <= paddle.y + this.paddleHeight)
      {
        if (Math.abs(this.info.ballX - (paddle.x + this.paddleWidth / 2)) <=  this.ballSize + this.paddleWidth / 2)
        {
          this.angleBall = Math.atan2(this.info.ballY - paddle.y + this.paddleHeight/ 2, this.info.ballX - paddle.x + this.paddleWidth/ 2);
          return;
        }
      }
      else if (this.info.ballX >= paddle.x && this.info.ballX <= paddle.x + this.paddleWidth)
      {
        if (Math.abs(this.info.ballY - (paddle.y + this.paddleHeight / 2)) <=  this.ballSize + this.paddleHeight / 2)
        {
          this.angleBall = Math.atan2(- paddle.y + this.paddleHeight/ 2, this.info.ballX - paddle.x + this.paddleWidth/ 2);
          return;
        }
      }
      var v: {x: number,y :number}[];
      v[0] =  paddle;
      v[1] = {x: paddle.x + this.paddleWidth, y: paddle.y};
      v[2] = {x: paddle.x, y: paddle.y + this.paddleHeight};
      v[3] = {x: paddle.x + this.paddleWidth, y: paddle.y + this.paddleHeight};
      for (const p of v)
      {
        if((Math.pow(p.x - this.info.ballX,2) + Math.pow(p.y - this.info.ballY,2) <= Math.pow(this.ballSize,2)))
        {
          this.angleBall = Math.atan2(this.info.ballY - paddle.y + this.paddleHeight/ 2, this.info.ballX - paddle.x + this.paddleWidth/ 2);
          return;
        }
      }

  }

  private limitCollision() {
    var newX = this.info.ballX + (this.ballSpeed * Math.cos(this.angleBall));
    var newY = this.info.ballY + (this.ballSpeed * Math.sin(this.angleBall));
    if(newX - this.ballSize > this.xMax) 
    {
      this.info.score1++;
      [newX, newY] = [this.xMax/2,this.yMax/2] 
      this.angleBall = 0;
    }
    else if(newX + this.ballSize < 0)
    {
      this.info.score2++;
      newY = - (newY - (2 * this.ballSize));
      [newX, newY] = [this.xMax/2,this.yMax/2] 
      this.angleBall = Math.PI;
    }
    else if(newY + this.ballSize > this.yMax)
    {
      newY  = (2 * this.yMax) - (newY + (2 * this.ballSize));
      this.angleBall = -this.angleBall;
    }
    else if(newY - this.ballSize < 0)
    {
      newY = - (newY - (2 * this.ballSize));
      this.angleBall = -this.angleBall;
    }
    return [newX,newY];
  }

  private updatePaddle() {

    var newPaddle1Y = this.info.paddle1Y + (this.paddleSpeed1 * this.move1) ;
    var newPaddle2Y = this.info.paddle2Y + (this.paddleSpeed2 * this.move2) ;

    if (newPaddle1Y  < 0)
    {
      this.info.paddle1Y = 0;
    }
    else if (newPaddle1Y + this.paddleHeight > this.yMax)
    {
      this.info.paddle1Y = this.yMax - this.paddleHeight;
    }
    else
    {
      this.info.paddle1Y = newPaddle1Y;
    }

    if (newPaddle2Y  < 0)
    {
      this.info.paddle2Y = 0;
    }
    else if (newPaddle2Y + this.paddleHeight > this.yMax)
    {
      this.info.paddle2Y = this.yMax - this.paddleHeight;
    }
    else
    {
      this.info.paddle2Y = newPaddle2Y;
    }
  }

};

@WebSocketGateway({
  namespace: "game",
  cors: {
    origin : "*"
  }
  
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private gameService: GameService){}
  
  

  private queueGame :string[];
  private socketClient :Socket[];
  private mapIdSocket : {client: Socket, id: number}[] = []
  
  private gamePong : GamePong[] = [];
  

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger("GameGateway");

  afterInit(server: Server)
  {
    setInterval(this.sendInfo, 100000, this);


  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Socket ${client.id} connect on the server`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Socket ${client.id} disconnect on the server`);
    
    //_.remove(this.mapIdSocket, (n) => { return n.client.id == client.id;});

  }

  @SubscribeMessage('id')
  handleUserID(client: Socket, payload: {id : number, name: string}){
    this.logger.log(`Socket ${client.id} connect on the server and real id is ${payload.id}`);
    _.remove(this.mapIdSocket, (n) => { return n.id == payload.id;});
    this.mapIdSocket.push({client, id: payload.id});
    this.startGame(payload.id, payload.name, 0, "player2");
  };

  @SubscribeMessage('move')
  handleMessage(client: Socket, payload: {move: number, id: number}): void {
    let id = payload.id;
    let game = this.gamePong[_.findIndex(this.gamePong, (n) => { return (n.id1 == id || n.id2 == id )})]
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
    game.logger.log(`The length of game Room is ${game.gamePong.length}`);
    if (game.gamePong.length)
    {
      game.gamePong.forEach(gameRoom => {
        game.logger.log(`The name in the game Room  ${gameRoom.roomID} are ${gameRoom.name1}  et ${gameRoom.name2}  `);
      });
    }
  }

  startGame(id1: number, user1: string, id2: number, user2: string )
  {
    this.logger.log(`a game start`);
    const game = new GamePong(user1, id1, user2, id2);

    this.gamePong.push(game); 


    const idInterval : NodeJS.Timer = setInterval(this.updateGame, 1000, game, this);
    game.setIdInterval(idInterval); 

  }

  stopGame(idInterval : NodeJS.Timer)
  {
    clearInterval(idInterval);
  }

  updateGame(game: GamePong, gateway:GameGateway){ 
    const info = game.updatePosition();
    gateway.logger.log(`a game update`);
    gateway.server.volatile.emit("data", info);
    if (info.score1 <= 9 && info.score2 <= 9)
    {
      return;
    }
    else
    {
      gateway.stopGame(game.idInterval);
    }
  }
}


