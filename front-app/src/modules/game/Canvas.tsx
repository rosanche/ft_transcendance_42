
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

const bonusSize = 17;
const paddleHeight = 100;
const paddleWidth = 10;
const ballSize = 15;

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
        console.log({newDirection, direction});
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
        console.log({newDirection, direction});
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

        socket.on('auth error', () => {
            router.replace("http://localhost:3001/connexion")
        });
    
        socket.on('disconnect', () => {
          setIsConnected(false);
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
            setIsGame(false);
          });
        socket.on('game start', () => {
          setIsGame(true);
          setIsWaiting(false);
        });
        socket.on('game end', () => {
          setIsGame(false);
        });

        //   socket.on('user', (user : {name: string, id: }))
      
        return () => {
            socket.off('connect');
            socket.off('auth error');
            socket.off('disconnect');
            socket.off('pong');
            socket.off('data');
            socket.off('game start');
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
        // console.log(windowWidth);
        // console.log(windowHeight);
        const drawPong = (ctx: CanvasRenderingContext2D, props : CanvasProps, info : PongState) => {
            ctx.restore();
            ctx.save();
            //ctx.scale(scaleWindow, scaleWindow)
            ctx.globalAlpha = 1;
            ctx.fillRect(0,0,Number(props.width),Number(props.height));
    
            ctx.fillStyle ="white";
            ctx.globalAlpha = 1;
            ctx.fillRect(40,info.paddle1Y,paddleWidth,paddleHeight);
            ctx.fillRect(Number(props.width) - (40 + paddleWidth),info.paddle2Y,paddleWidth,paddleHeight);
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

            const score1 = info.name1 + ": " + info.score1;
            const score2 = info.name2 + ": " + info.score2;


            ctx.font ="48px serif"
            ctx.textAlign = "center";
            ctx.fillText(score1, Number(props.width)/4, 100);
            ctx.fillText(score2, 3 * Number(props.width)/4, 100);
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
                <canvas className="aspect-video w-full" width={1600} height={900} ref={canvasRef}/> 
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