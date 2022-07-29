
import React, {useCallback, useEffect, useRef, useState} from 'react';
import socketio from 'socket.io-client'

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
    type: string
}

type PongState = {
    paddle1Y : number,
    paddle2Y : number,
    ballX: number,
    ballY: number,
    score1: number,
    score2: number
    bonus : BonusPong [] | null
}


type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> ;

const Canvas :  React.FC<CanvasProps> = ({...props}) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null) ;
    const keyRef = useRef<{up : boolean, down : boolean}>({up: false, down: false}) ;
    const paddleHeight = 100;
    const paddleWidth = 10;
    const ballSize = 15;
    const name1 = "player1";
    const name2 = "player2";

    const [info, setInfo] = useState<PongState>({
        paddle1Y : (Number(props.height) - paddleHeight) / 2,
        paddle2Y : (Number(props.height) - paddleHeight) / 2,
        ballX: Number(props.width) /2,
        ballY: Number(props.height) /2,
        score1: 0,
        score2: 0,
        bonus : null
    });

    //const [update, setUpdate] = useState<boolean>(false);

    
    useEffect(() => {
        //const socket = socketio("ws://localhost:3000");

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
            const newInfo = {...info};
            console.log(info);
            let direction: number = 0;
            
            if (keyRef.current.up && !keyRef.current.down)
            {
                direction = -1;
            }
            else if (!keyRef.current.up && keyRef.current.down)
            {
                direction = 1;
            }
    
            newInfo.paddle1Y = newInfo.paddle1Y + (direction * 5);

            setInfo(newInfo);
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
            
            //setUpdate(true);
        };
        console.log('handler')
        document.addEventListener('keydown', keyDownHandler); 

        document.addEventListener('keyup', keyUpHandler);
        
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
        };
    });

    useEffect(() => {

        const drawPong = (ctx: CanvasRenderingContext2D, props : CanvasProps, info : PongState) => {
        
            console.log("draw")
            ctx.fillStyle ="black";
            ctx.fillRect(0,0,Number(props.width),Number(props.height));
    
            ctx.fillStyle ="white";
            ctx.fillRect(40,info.paddle1Y,paddleWidth,paddleHeight);
            ctx.fillRect(Number(props.width) - (40 + paddleWidth),info.paddle2Y,paddleWidth,paddleHeight);
            ctx.beginPath();
            ctx.arc(info.ballX, info.ballY, ballSize, 0, Math.PI * 2, true);
            ctx.fill();

            const score1 = name1 + ": " + info.score1;
            const score2 = name2 + ": " + info.score2;

            ctx.font ="48px serif"
            ctx.textAlign = "center";
            ctx.fillText(score1, Number(props.width)/4, 100);
            ctx.fillText(score2, 3 * Number(props.width)/4, 100);
        }

        const canvas = canvasRef.current;
        if (!canvas){
            return;
        }
        console.log('yes');
        const ctx = canvas.getContext("2d");
        drawPong(ctx, props, info);
        
        return () => {
            ctx.clearRect(0,0, Number(props.width), Number(props.height));
        };
    });

    
    

    return <canvas width={props.width} height={props.height} ref={canvasRef}/> ;
}



export default Canvas