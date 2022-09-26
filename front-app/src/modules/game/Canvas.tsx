
import React, {useCallback, useEffect, useRef, useState} from 'react';
import socketio from 'socket.io-client';
import { useRouter } from "next/router";
import { Button } from 'modules/common/components/_ui/Button/Button';


type PongProps = {
    player1 : string,
    player2 : string,
    heigth : number,
    length : number
}

type BonusPong = 
{
    x : number,
    y : number,
    type: string,
    date: number,
    owner: null | number
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

const typeBonus = ["PaddleSize", "PaddleSpeed", "BallSpeed"];

type PongState = {
    paddle1Y : number,
    paddle2Y : number,
    ballX: number,
    ballY: number,
    score1: number,
    score2: number,
    bonus : BonusPong [] | null,
    name1: string,
    name2: string
}

const bonusSize = 25;
const paddleHeight = 100;
const paddleWidth = 15;
const ballSize = 12;

const socket = socketio('http://localhost:3000/game',{
    autoConnect: false,
    auth: {
        token: "abcd"
      }
  });

type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> ;

const Canvas :  React.FC<CanvasProps> = ({...props}) => {

    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement | null>(null) ;
    const queryRef =  useRef<string | null>(null) ;
    const endGameRef = useRef<EndGame | null>(null);
    const keyRef = useRef<{up : boolean, down : boolean}>({up: false, down: false}) ;
    const scaleRef = useRef<Number>(1);
    let windowWidth :number = props.width;
    let windowHeight :number = props.height;
    const [direction,setDirection] = useState<number>(0);
    const [info, setInfo] = useState<PongState>({
        paddle1Y : (Number(props.height) - paddleHeight) / 2,
        paddle2Y : (Number(props.height) - paddleHeight) / 2,
        ballX: Number(props.width) /2,
        ballY: Number(props.height) /2,
        score1: 0,
        score2: 0,
        name1: "",
        name2: "",
        bonus : []
    });
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isGame, setIsGame] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isEndGame, setIsEndGame] = useState(false);
    const [lastPong, setLastPong] = useState(null);


    const keyDownHandler = (event :KeyboardEvent) => {
        event.preventDefault();
        if (event.key == 'ArrowUp')
        {
            keyRef.current.up = true;
            
        }
        else if (event.key == 'ArrowDown')
        {
            keyRef.current.down = true;
        }
        else
        {return;}

        let newDirection: number = 0;
        
        if (keyRef.current.up && !keyRef.current.down)
        {
            newDirection = -1;
        }
        else if (!keyRef.current.up && keyRef.current.down)
        {
            newDirection = 1;
        }
        if (newDirection != direction)
        {
            setDirection(newDirection);
        }
        
        //setUpdate(false);
    };



    const keyUpHandler = (event :KeyboardEvent) => {
        event.preventDefault();
        if (event.key == 'ArrowUp')
        {
            keyRef.current.up = false;
        }
        else if (event.key == 'ArrowDown')
        {
            keyRef.current.down = false;
        }
        else {
            return;
        }
        let newDirection: number = 0;
        
        if (keyRef.current.up && !keyRef.current.down)
        {
            newDirection = -1;
        }
        else if (!keyRef.current.up && keyRef.current.down)
        {
            newDirection = 1;
        }
        setDirection(newDirection);
     
        //setUpdate(true);
    };

    useEffect(() => {
        socket.emit('move', {move: direction});
    }, [direction])
    
    useEffect(() => {

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('user info', (user : {id: number, pseudo: string}) => {
            console.log(user);
            if (typeof window != "undefined")
            {
                const queryParams = new URLSearchParams(window.location.search);
                queryRef.current = queryParams.get("ID");
                console.log(queryRef.current);
                if (queryRef.current !== null)
                {
                    socket.emit('join', queryRef.current);
                }
            }
        });

        socket.on('auth error', () => {
            router.replace("/connexion")
        });
    
        socket.on('disconnect', () => {
          setIsConnected(false);
          setIsGame(false);
          setIsWaiting(false);
        });
    
        socket.on('pong', () => {
          setLastPong(new Date().toISOString());
        });
    
        socket.on('data', (data :PongState) => {
            //console.log(data);
            setInfo(data);
        });
        socket.on('wait game', () => {
            setIsWaiting(true);
            setIsEndGame(false);
            setIsGame(false);
          });
        socket.on('game start', () => {
            console.log("test")
          setIsGame(true);
          setIsEndGame(false);
          setIsWaiting(false);
        });
        socket.on('game end', (data: EndGame) => {
            endGameRef.current = data;
          setIsGame(false);
          setIsEndGame(true);
          setIsWaiting(false);
        });

        //   socket.on('user', (user : {name: string, id: }))
      
        return () => {
            socket.off('connect');
            socket.off('user info');
            socket.off('auth error');
            socket.off('disconnect');
            socket.off('pong');
            socket.off('data');
            socket.off('game start');
            socket.off('wait game');
            socket.off('game end');
        };
    }, []);


    useEffect(() => {
        
        if (typeof document != "undefined")
        {
            const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('access_token'))?.split('=')[1];
            console.log(cookieValue);
            socket.auth.token = cookieValue;
            socket.connect();

        }
        return () => {
            socket.disconnect();
        };
    },[]);

    useEffect(() => {
        
        
        
        console.log('handler')
        document.addEventListener('keydown', keyDownHandler); 

        document.addEventListener('keyup', keyUpHandler);
        
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    }, []);


    useEffect(() => {

        if (typeof window != "undefined")
        {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
            if (windowHeight * (16 / 9) > windowWidth)
            {
                scaleRef.current = windowWidth / Number(props.width) ;
            }
            else
            {
                scaleRef.current = windowHeight / Number(props.height)  ;
            }
        }
        let H1 = paddleHeight;
        let H2 = paddleHeight;
        for (let el of info.bonus)
        {
            if (el.type == typeBonus[0])
            {
                // console.log("Bonus: ", el.owner)
                if (el.owner == 1)
                {
                    H1 = paddleHeight * 2;
                }
                else if (el.owner == 2)
                {
                    H2 = paddleHeight * 2;
                }
            }
        }
        // console.log(windowWidth);
        // console.log(windowHeight);
        const drawPong = (ctx: CanvasRenderingContext2D, props : CanvasProps, info : PongState) => {
            ctx.restore();
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillRect(0,0,Number(props.width),Number(props.height));
    
            ctx.fillStyle ="white";
            ctx.globalAlpha = 1;
            for (let i = 25; i < 900 ; i+=100)
            {
                ctx.fillRect(800 - 5,i,10,50);
            }
            ctx.fillRect(40,info.paddle1Y,paddleWidth,H1);
            ctx.fillRect(Number(props.width) - (40 + paddleWidth),info.paddle2Y,paddleWidth,H2);
            ctx.beginPath();
            ctx.arc(info.ballX, info.ballY, ballSize, 0, Math.PI * 2, true);
            ctx.fill();
            if(info.bonus.length)
            {
                info.bonus.forEach(element => { 
                    if (element.owner == null)
                    {
                        switch (element.type)
                        {
                            case typeBonus[0]:
                                ctx.fillStyle ="blue";
                                break;
                            case typeBonus[1]:
                                ctx.fillStyle ="yellow";
                                break;
                            case typeBonus[2]:
                                ctx.fillStyle ="red";
                                break;
                            default:
                                ctx.fillStyle ="orange";
                                break;
                        
                        };
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, bonusSize, 0, Math.PI * 2, true);
                        ctx.fill();
                        ctx.fillStyle ="white";
                    }

                });
            }   

            const score1 = "" + info.score1;
            const score2 = "" + info.score2;
            ctx.font ="120px DM Sans"
            ctx.textAlign = "center";
            ctx.fillText(score1, Number(props.width)/4, 150);
            ctx.fillText(score2, 3 * (Number(props.width)/4), 150);
        }

        const canvas = canvasRef.current;
        if (!canvas){
            return;
        }
        const ctx = canvas.getContext("2d");
        drawPong(ctx, props, info);
        
        return () => {
            ctx.clearRect(0,0, Number(props.width), Number(props.height));
        };
    }, [info]);

    
    if(isGame)
    {
        return(

            <>
                <div className=" grid grid-cols-2 mb-5 content-center" >
                <div className="justify-self-center">
                    <span className="text-white text-4xl font-default font-bold justify-self-center">
                        {info.name1}
                    </span>
                </div>
                
                <div className="justify-self-center">
                    <span className="text-white text-4xl font-default font-bold justify-self-center">
                        {info.name2}
                    </span>
                </div>
                </div>
                
                <canvas className="aspect-video w-full rounded" width={1600} height={900} ref={canvasRef}/> 
            </>
        );
    
    }
    else if(isEndGame)
    {
        return (
            <> 
            <div className="h-56 grid grid-cols-1 gap-8 justify-items-center" >
                <span className="text-amber-500 text-6xl font-default font-bold justify-items-center text-align: center mb-8">
                    Winner!
                </span>
                <span className="text-amber-500 text-4xl font-default font-bold justify-items-center text-align: center mb-8">
                    {(endGameRef.current.winner == endGameRef.current.id1) ? endGameRef.current.pseudo1 : endGameRef.current.pseudo2}
                </span>
                <div>
                    <span className="text-white text-6xl font-default font-bold justify-items-center text-align: center mb-8">
                        "${endGameRef.current.score1} : ${endGameRef.current.score2}"
                    </span>

                </div>
             
                 
                 <Button
                     variant="contained"
                     color="active"
                     onClick={() => {
                         setIsEndGame(false);
                         setIsGame(false);
                         setIsWaiting(false)
                         }
                     }
 
                 >
                   New game
                 </Button>
             </div>
             </>
         );
    }
    else
    {
        return (
           <> 
           <span className="text-white text-4xl font-default font-bold italic mb-16">
                { !isWaiting ? "Lancez une partie!" : "Un adversaire arrive!"}
            </span>
            <div className="h-56 grid grid-cols-2 gap-8 content-center" >
                
                <Button
                    variant="contained"
                    color="active"
                    isLoading={isWaiting}
                    onClick={() => {
                        socket.emit('queue', true);
                        setIsWaiting(true);
                        }
                    }

                >
                  Pong
                </Button>
                <Button
                    variant="contained"
                    color="active"
                    isLoading={isWaiting}
                    onClick={() => {
                        socket.emit('queue', false);
                        setIsWaiting(true);
                        }
                    } 
                >
                  Classique
                </Button>
            </div>
            </>
        );
    }

};

export default Canvas