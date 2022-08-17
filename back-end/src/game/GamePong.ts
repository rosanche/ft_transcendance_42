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

export class GamePong {

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
   paddleSpeed: number;
   paddleSpeed1: number;
   paddleSpeed2: number;
   tickDuration: number;
   angleBall: number;
   name1 : string;
   name2 : string | null;
   id1 : number;
   id2 : number | null;


  constructor(roomId: string, name1: string, id1: number){

    this.xMax = 1600;
    this.yMax = 900;
    this.paddleX1 = 40;
    this.paddleWidth = 10;
    this.paddleX2 = this.xMax - (this.paddleX1 + this.paddleWidth);
    this.paddleHeight = 100;
    this.ballSpeed = 10;
    this.paddleSpeed = 7.5;
    this.paddleSpeed1 = this.paddleSpeed;
    this.paddleSpeed2 = this.paddleSpeed;
    this.angleBall = Math.PI / 4;
    this.ballSize = 15;
    this.roomID = roomId;
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
    this.name2 = null ;
    this.id1 = id1;
    this.id2 = null ;
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
    // console.log({newX, newY, paddleX2: this.paddleX2, paddle2Y: this.info.paddle2Y});
    if (newX + this.ballSize >= this.paddleX1 && newX - this.ballSize <= this.paddleX1 + this.paddleWidth 
      && newY + this.ballSize >= this.info.paddle1Y && newY - this.ballSize <= this.info.paddle1Y + this.paddleHeight)
    {
      // console.log('conditionX');
      this.paddleCollision(this.paddleX1, this.info.paddle1Y);

    }
    else if((newY + this.ballSize > this.info.paddle2Y) && (newY - this.ballSize < this.info.paddle2Y + this.paddleHeight) 
      && (newX + this.ballSize > this.paddleX2) && (newX - this.ballSize < this.paddleX2 + this.paddleWidth))
    {
      this.paddleCollision(this.paddleX2, this.info.paddle2Y);
      // console.log('conditionY');
    }
    
    return (this.info);
  }

  private paddleCollision(paddleX: number, paddleY: number) {
    var paddle = {x: paddleX ,y: paddleY};

      if (this.info.ballY >= paddle.y && this.info.ballY <= paddle.y + this.paddleHeight)
      {
        if (Math.abs(this.info.ballX - (paddle.x + this.paddleWidth / 2)) <=  this.ballSize + this.paddleWidth / 2)
        {
          this.angleBall = Math.atan2(this.info.ballY - (paddle.y + this.paddleHeight/ 2), this.info.ballX - (paddle.x + this.paddleWidth/ 2));
          return;
        }
      }
      else if (this.info.ballX >= paddle.x && this.info.ballX <= paddle.x + this.paddleWidth)
      {
        if (Math.abs(this.info.ballY - (paddle.y + this.paddleHeight / 2)) <=  this.ballSize + this.paddleHeight / 2)
        {
          this.angleBall = Math.atan2(this.info.ballX - (paddle.y + this.paddleHeight/ 2), this.info.ballX - (paddle.x + this.paddleWidth/ 2));
          return;
        }
      }
      var v: {x: number,y :number}[] = [];
      v[0] =  paddle;
      v[1] = {x: paddle.x + this.paddleWidth, y: paddle.y};
      v[2] = {x: paddle.x, y: paddle.y + this.paddleHeight};
      v[3] = {x: paddle.x + this.paddleWidth, y: paddle.y + this.paddleHeight};
      for (const p of v)
      {
        if((Math.pow(p.x - this.info.ballX,2) + Math.pow(p.y - this.info.ballY,2) <= Math.pow(this.ballSize,2)))
        {
          this.angleBall = Math.atan2(this.info.ballY - (paddle.y + this.paddleHeight/ 2), this.info.ballX - (paddle.x + this.paddleWidth/ 2));
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
