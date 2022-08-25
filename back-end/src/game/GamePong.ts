import * as _ from "lodash"
import {v4 as uuidv4} from "uuid"

type BonusPong = 
{
    x : number,
    y : number,
    type: string,
    date: number,
    owner: null | number
}

type PongInfo = {
  paddle1Y : number,
  paddle2Y : number,
  ballX: number,
  ballY: number,
  score1: number,
  score2: number,
  bonus : BonusPong [],
  name1: string,
  name2: string
}

const typeBonus = ["PaddleSize", "PaddleSpeed", "BallSpeed"];
const bonusSize = 10;
const ballSize = 15;
const freqBonus = 8000;

export class GamePong {

  isBonus: boolean;
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
  name2 : string;
  id1 : number;
  id2 : number;
  startTime: null | number;
  lastTouch: number;


  constructor(roomId: string, name1: string, id1: number, isBonus: boolean){

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
     bonus : [],
     name1,
     name2: "player 2" 
   }
    this.move1  = 0;
    this.move2  = 0;
    this.id1 = id1;
    this.id2 = -1 ;
    this.tickDuration = 30;
    this.isBonus = isBonus;
    this.startTime = null;
    this.lastTouch = 0;
  }

  addNewPlayer(name: string, id: number)
  {
    this.info.name2 = name;
    this.id2 = id;
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
    var deleteBonus : number[] = [];
    const time = Date.now();
    
    if (this.startTime === null)
    {
      this.startTime = time
    }
    else
    {
      if (time - this.startTime >= freqBonus)
      {
        this.startTime = time
        this.info.bonus.push(this.newBonus());
      }
    }
    
    this.updatePaddle();
    [newX,newY] = this.limitCollision();

    this.info.ballX = newX;
    this.info.ballY = newY;

    

    if (newX + this.ballSize >= this.paddleX1 && newX - this.ballSize <= this.paddleX1 + this.paddleWidth 
      && newY + this.ballSize >= this.info.paddle1Y && newY - this.ballSize <= this.info.paddle1Y + this.paddleHeight)
    {
      if(this.paddleCollision(this.paddleX1, this.info.paddle1Y))
      {
        if (this.lastTouch === 0)
        {
          this.ballSpeed = 20;
        }
        this.lastTouch = 1;
      }
    }
    else if((newY + this.ballSize > this.info.paddle2Y) && (newY - this.ballSize < this.info.paddle2Y + this.paddleHeight) 
      && (newX + this.ballSize > this.paddleX2) && (newX - this.ballSize < this.paddleX2 + this.paddleWidth))
    {
      if(this.paddleCollision(this.paddleX2, this.info.paddle2Y))
      {
        if (this.lastTouch === 0)
        {
          this.ballSpeed = 20;
        }
        this.lastTouch = 2;
      }
    }
    else if(this.info.bonus.length)
    {
      this.info.bonus.forEach((el,i,arr) =>
      {
        if (el.owner === null && time - el.date >= 250 && this.lastTouch !== 0)
        {
          if ((Math.pow(newX - el.x, 2) + Math.pow(newY - el.y, 2)) < Math.pow(bonusSize + ballSize, 2))
          {
            el.owner = this.lastTouch;
            el.date = time;
          }
          else if(time - el.date >= freqBonus * 3)
          {
            deleteBonus.push(i);
          }
        }
        else if (el.owner !== null)
        {
          if (time - el.date > freqBonus * 1,5)
          {
            deleteBonus.push(i);
          }
        }
      });
    }

    if (deleteBonus.length)
    {
      deleteBonus.sort().reverse();
      deleteBonus.forEach(element => {
        this.info.bonus.splice(element, 1);
      });
    }
    return (this.info);
  }

  private paddleCollision(paddleX: number, paddleY: number) :number {
    var paddle = {x: paddleX ,y: paddleY};

      if (this.info.ballY >= paddle.y && this.info.ballY <= paddle.y + this.paddleHeight)
      {
        if (Math.abs(this.info.ballX - (paddle.x + this.paddleWidth / 2)) <=  this.ballSize + this.paddleWidth / 2)
        {
          this.angleBall = Math.atan2(this.info.ballY - (paddle.y + this.paddleHeight/ 2), this.info.ballX - (paddle.x + this.paddleWidth/ 2));
          return(1);
        }
      }
      else if (this.info.ballX >= paddle.x && this.info.ballX <= paddle.x + this.paddleWidth)
      {
        if (Math.abs(this.info.ballY - (paddle.y + this.paddleHeight / 2)) <=  this.ballSize + this.paddleHeight / 2)
        {
          this.angleBall = Math.atan2(this.info.ballX - (paddle.y + this.paddleHeight/ 2), this.info.ballX - (paddle.x + this.paddleWidth/ 2));
          return(1);
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
          return(1);
        }
      }
      return(0);
  }

  
  private limitCollision() {
    var newX = this.info.ballX + (this.ballSpeed * Math.cos(this.angleBall));
    var newY = this.info.ballY + (this.ballSpeed * Math.sin(this.angleBall));
    if(newX - this.ballSize > this.xMax) 
    {
      this.info.score1++;
      [newX, newY] = [this.xMax/2,this.yMax/2] 
      this.angleBall = 0;
      this.ballSpeed = 10;
    }
    else if(newX + this.ballSize < 0)
    {
      this.info.score2++;
      newY = - (newY - (2 * this.ballSize));
      [newX, newY] = [this.xMax/2,this.yMax/2] 
      this.angleBall = Math.PI;
      this.ballSpeed = 10;
      this.lastTouch = 0;
    }
    else if(newY + this.ballSize > this.yMax)
    {
      newY  = (2 * this.yMax) - (newY + (2 * this.ballSize));
      this.angleBall = -this.angleBall;
      this.lastTouch = 0;
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

  private newBonus() : BonusPong
  {
    const x = (Math.random() * 800) + 400;
    const y = (Math.random() * 600) + 150;
    const type = typeBonus[Math.ceil(Math.random() * typeBonus.length)];
    const owner = null;
    const date = Date.now()
    return {x, y, type, date, owner};
  }
};
