
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


const xMax = 1600;
const yMax = 900;

const ballSize = 12;
const baseBallSpeed = 10;

const typeBonus = ["PaddleSize", "PaddleSpeed", "BallSpeed"];
const bonusSize = 25;
const freqBonus = 8000;

const paddleHeight = 100;
const paddleWidth = 15;
const paddleSpeed = 7.5;


export class GamePong {

  isBonus: boolean;
  paddleX1: number;
  paddleX2: number;
  ballSpeed: number;
  roomID : string;
  idInterval : NodeJS.Timer | null;
  info : PongInfo ;
  move1 : number;
  move2 : number;
  paddleSpeed1: number;
  paddleSpeed2: number;
  paddleHeight1: number;
  paddleHeight2: number;
  angleBall: number;
  name1 : string;
  name2 : string;
  id1 : number;
  id2 : number;
  startTime: null | number;
  lastTouch: number;
  spectators: number[];


  constructor(roomId: string, isBonus: boolean){

    this.paddleX1 = 40;
    this.paddleX2 = xMax - (this.paddleX1 + paddleWidth);
    this.ballSpeed = baseBallSpeed;
    this.paddleSpeed1 = paddleSpeed;
    this.paddleSpeed2 = paddleSpeed;
    this.paddleHeight1 = paddleHeight;
    this.paddleHeight2 = paddleHeight;
    this.angleBall = 0;
    this.roomID = roomId;
    this.idInterval = null;
    this.spectators= [];
    this.info ={
     paddle1Y : (yMax - paddleHeight) / 2,
     paddle2Y : (yMax - paddleHeight) / 2,
     ballX: xMax /2,
     ballY: yMax /2,
     score1: 0,
     score2: 0,
     bonus : [],
     name1: "",
     name2: "" 
   }
    this.move1  = 0;
    this.move2  = 0;
    this.id1 = -1;
    this.id2 = -1;
    this.isBonus = isBonus;
    this.startTime = null;
    this.lastTouch = 0;
  }

  addPlayer(name: string, id: number)
  {
    if (this.id1 === -1)
    {
      this.info.name1 = name;
      this.id1 = id;
    }
    else if(this.id2 === -1)
    {
      this.info.name2 = name;
      this.id2 = id;
    }
    
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
      if (this.isBonus && time - this.startTime >= freqBonus)
      {
        this.startTime = time
        this.info.bonus.push(this.newBonus());
      }
    }
    
    this.handleBonus();

    this.updatePaddle();
    [newX,newY] = this.limitCollision();

    this.info.ballX = newX;
    this.info.ballY = newY;

    

    if (newX + ballSize >= this.paddleX1 && newX - ballSize <= this.paddleX1 + paddleWidth 
      && newY + ballSize >= this.info.paddle1Y && newY - ballSize <= this.info.paddle1Y + this.paddleHeight1)
    {
      if(this.paddleCollision(this.paddleX1, this.info.paddle1Y, this.paddleHeight1)) 
      {
        this.ballSpeed = this.isBonusActive(typeBonus[2], 1) ? baseBallSpeed * 1.5 : baseBallSpeed;
        this.lastTouch = 1;
      }
    }
    else if((newY + ballSize > this.info.paddle2Y) && (newY - ballSize < this.info.paddle2Y + this.paddleHeight2) 
      && (newX + ballSize > this.paddleX2) && (newX - ballSize < this.paddleX2 + paddleWidth))
    {
      if(this.paddleCollision(this.paddleX2, this.info.paddle2Y, this.paddleHeight2)) 
      {
        this.ballSpeed = this.isBonusActive(typeBonus[2], 2) ? baseBallSpeed * 1.5 : baseBallSpeed;
        this.lastTouch = 2;
      }
    }
    else if(this.info.bonus.length)
    {
      this.info.bonus.forEach((el,i,arr) =>
      {
        // console.log(time - el.date);
        if (el.owner === null && time - el.date >= 250 && this.lastTouch !== 0)
        {
          if ((Math.pow(newX - el.x, 2) + Math.pow(newY - el.y, 2)) < Math.pow(bonusSize + ballSize, 2))
          {
            el.owner = this.lastTouch;
            el.date = time;
          }
          else if((time - el.date) >= (freqBonus * 3))
          {
            deleteBonus.push(i);
          }
        }
        else if(el.owner !== null)
        {
          if ((time - el.date) > (freqBonus * 2))
          {
            // console.log(deleteBonus);
            deleteBonus.push(i);
          }
        }
      });
      // console.log(deleteBonus);
    }
    if (deleteBonus.length != 0)
    {
      deleteBonus.sort().reverse();
      //console.log(deleteBonus);
      //console.log(this.info.bonus);
      deleteBonus.forEach(element => {
        this.info.bonus.splice(element, 1);
      });
      //console.log(this.info.bonus);
    }
    
    return (this.info);
  }

  private angleCollision(Px: number, Py: number)
  {
    let angle: number;
    if (Px >= 0)
    {
      angle = Py * (Math.PI / 4);
    }
    else
    {
        angle = Math.PI - (Py * (Math.PI / 4));
    }

    return angle;
  }

  private paddleCollision(paddleX: number, paddleY: number, paddleH: number) :number {
    let paddle = {x: paddleX ,y: paddleY};
    let percentY = (this.info.ballY - (paddleY + (paddleH / 2))) / (paddleH / 2);
    let percentX = (this.info.ballX - (paddleX + (paddleWidth / 2))) / (paddleWidth / 2);
      if (Math.abs(percentY) < 1)
      {
        if (Math.abs(this.info.ballX - (paddle.x + paddleWidth / 2)) <=  ballSize + paddleWidth / 2)
        {
          
          // this.angleBall = Math.atan2(this.info.ballY - (paddle.y + paddleH/ 2), this.info.ballX - (paddle.x + paddleWidth/ 2));
          this.angleBall = this.angleCollision(percentX,percentY);

          return(1);
        }
      }
      else if (Math.abs(percentX) < 1)
      {
        if (Math.abs(this.info.ballY - (paddle.y + paddleH / 2)) <=  ballSize + paddleH / 2)
        {
          //this.angleBall = Math.atan2(this.info.ballX - (paddle.y + paddleH/ 2), this.info.ballX - (paddle.x + paddleWidth/ 2));
          this.angleBall = this.angleCollision(percentX,percentY);
          return(1);
        }
      }
      else
      {
        var v: {x: number,y :number}[] = [];
        v[0] =  paddle;
        v[1] = {x: paddle.x + paddleWidth, y: paddle.y};
        v[2] = {x: paddle.x, y: paddle.y + paddleH};
        v[3] = {x: paddle.x + paddleWidth, y: paddle.y + paddleH};
        for (const p of v)
        {
          if((Math.pow(p.x - this.info.ballX,2) + Math.pow(p.y - this.info.ballY,2) <= Math.pow(ballSize,2)))
          {
            this.angleBall = Math.atan2(this.info.ballY - (paddle.y + paddleH/ 2), this.info.ballX - (paddle.x + paddleWidth/ 2));

            return(1);
          }
        }
      }
      return(0);
  }



  
  private limitCollision() {
    var newX = this.info.ballX + (this.ballSpeed * Math.cos(this.angleBall));
    var newY = this.info.ballY + (this.ballSpeed * Math.sin(this.angleBall));
    if(newX - ballSize > xMax) 
    {
      this.info.score1++;
      [newX, newY] = [xMax/2,Math.ceil(((0.8 * yMax) * Math.random()) + (0.1 * yMax))] 
      this.angleBall = ( (Math.PI / 2) * Math.random()) - (Math.PI / 4) ;
      this.ballSpeed = baseBallSpeed * 0.6;
      this.lastTouch = 0;
      this.startTime = Date.now();
      this.info.bonus = [];
    }
    else if(newX + ballSize < 0)
    {
      this.info.score2++;
      [newX, newY] = [xMax/2,Math.ceil(((0.8 * yMax) * Math.random()) + (0.1 * yMax))] 
      this.angleBall = Math.PI + ( (Math.PI / 2) * Math.random()) - (Math.PI / 4) ;
      this.ballSpeed = baseBallSpeed * 0.6
      this.lastTouch = 0;
      this.startTime = Date.now();
      this.info.bonus = [];
      
    }
    else if(newY + ballSize > yMax)
    {
      newY  = (2 * yMax) - (newY + (2 * ballSize));
      this.angleBall = -this.angleBall;
    }
    else if(newY - ballSize < 0)
    {
      newY = - (newY - (2 * ballSize));
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
    else if (newPaddle1Y + this.paddleHeight1 > yMax)
    {
      this.info.paddle1Y = yMax - this.paddleHeight1;
    }
    else
    {
      this.info.paddle1Y = newPaddle1Y;
    }

    if (newPaddle2Y  < 0)
    {
      this.info.paddle2Y = 0;
    }
    else if (newPaddle2Y + this.paddleHeight2 > yMax)
    {
      this.info.paddle2Y = yMax - this.paddleHeight2;
    }
    else
    {
      this.info.paddle2Y = newPaddle2Y;
    }
  }

  private newBonus() : BonusPong
  {
    const x = (Math.random() * 800) + 400;
    const y = (Math.random() * 100) + 400;
    const type = typeBonus[Math.floor(Math.random() * typeBonus.length)];
    const owner = null;
    const date = Date.now()
    return {x, y, type, date, owner};
  }

  private handleBonus()
  {
    let bonus : BonusPong = this.newBonus();
    // if (this.isBonusActive(typeBonus[0],1) === false)
    // {
      
    //   bonus.owner = 1;
    //   bonus.type = typeBonus[0];
    //   this.info.bonus.push(bonus)
    // }
    if (this.isBonusActive(typeBonus[0],1) && this.paddleHeight1 != paddleHeight * 2)
    {
      this.paddleHeight1 = paddleHeight * 2
      this.info.paddle1Y -= Math.ceil(paddleHeight / 2);
      if(this.info.paddle1Y < 0)
      {
        this.info.paddle1Y = 0;
      }
      else if((this.info.paddle1Y + (paddleHeight * 2)) > yMax)
      {
        this.info.paddle1Y = yMax - (paddleHeight * 2);
      }

    }
    else if(!this.isBonusActive(typeBonus[0],1) && this.paddleHeight1 == paddleHeight * 2)
    {
      this.paddleHeight1 = paddleHeight
      this.info.paddle1Y += Math.ceil(paddleHeight / 2);
    }

    if (this.isBonusActive(typeBonus[0],2) && this.paddleHeight2 != paddleHeight * 2)
    {
      this.paddleHeight2 = paddleHeight * 2
      this.info.paddle2Y -= Math.ceil(paddleHeight / 2);
      if(this.info.paddle2Y < 0)
      {
        this.info.paddle2Y = 0;
      }
      else if((this.info.paddle2Y + (paddleHeight * 2)) > yMax)
      {
        this.info.paddle2Y = yMax - (paddleHeight * 2);
      }

    }
    else if(!this.isBonusActive(typeBonus[0],2) && this.paddleHeight2 == paddleHeight * 2)
    {
      this.paddleHeight2 = paddleHeight
      this.info.paddle2Y += Math.ceil(paddleHeight / 2);
    }
    // this.paddleHeight1 = this.isBonusActive(typeBonus[0],1) ? paddleHeight * 2 : paddleHeight;
    // this.paddleHeight2 = this.isBonusActive(typeBonus[0],2) ? paddleHeight * 2 : paddleHeight;
    this.paddleSpeed1 = this.isBonusActive(typeBonus[1],1) ? paddleSpeed * 1.5 : paddleSpeed;
    this.paddleSpeed2 = this.isBonusActive(typeBonus[1],2) ? paddleSpeed * 1.5 : paddleSpeed;
  }

  private isBonusActive(type: string, player: number) :boolean
  {

    for (const el of this.info.bonus) {
      if (el.type === type && el.owner === player)
      {
        return true;
      }   
    }
    return false;
  }
};
