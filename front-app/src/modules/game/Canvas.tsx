import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "modules/common/components/_ui/Button/Button";
import { useAppContextState } from "modules/common/context/AppContext";
import socketio from "socket.io-client";

type PongProps = {
  player1: string;
  player2: string;
  heigth: number;
  length: number;
};

type BonusPong = {
  x: number;
  y: number;
  type: string;
  date: number;
  owner: null | number;
};

type EndGame = {
  score1: number;
  score2: number;
  id1: number;
  id2: number;
  pseudo1: string;
  pseudo2: string;
  winner: number;
};

const typeBonus = ["PaddleSize", "PaddleSpeed", "BallSpeed"];

type PongState = {
  paddle1Y: number;
  paddle2Y: number;
  ballX: number;
  ballY: number;
  score1: number;
  score2: number;
  bonus: BonusPong[] | null;
  name1: string;
  name2: string;
};

const socket = socketio("http://localhost:3000/game", {
  autoConnect: false,
  auth: {
    token: "",
  },
});

const bonusSize = 25;
const paddleHeight = 100;
const paddleWidth = 15;
const ballSize = 12;

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Canvas: React.FC<CanvasProps> = ({ ...props }) => {
  const { accessToken, doubleFaEnabled } = useAppContextState();

  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const queryRef = useRef<string | null>(null);
  const endGameRef = useRef<EndGame | null>(null);
  const keyRef = useRef<{ up: boolean; down: boolean }>({
    up: false,
    down: false,
  });
  const scaleRef = useRef<Number>(1);
  let windowWidth: number = props.width;
  let windowHeight: number = props.height;
  const [direction, setDirection] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [info, setInfo] = useState<PongState>({
    paddle1Y: (Number(props.height) - paddleHeight) / 2,
    paddle2Y: (Number(props.height) - paddleHeight) / 2,
    ballX: Number(props.width) / 2,
    ballY: Number(props.height) / 2,
    score1: 0,
    score2: 0,
    name1: "",
    name2: "",
    bonus: [],
  });
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isGame, setIsGame] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isEndGame, setIsEndGame] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  const keyDownHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    let newDirection: number = 0;
    if (event.key == "ArrowUp") {
      keyRef.current.up = true;
    } else if (event.key == "ArrowDown") {
      keyRef.current.down = true;
    } else {
      return;
    }

    if (keyRef.current.up && !keyRef.current.down) {
      newDirection = -1;
    } else if (!keyRef.current.up && keyRef.current.down) {
      newDirection = 1;
    }
    if (newDirection != direction) {
      setDirection(newDirection);
    }

    //setUpdate(false);
  };

  const keyUpHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    let newDirection: number = 0;
    if (event.key == "ArrowUp") {
      keyRef.current.up = false;
    } else if (event.key == "ArrowDown") {
      keyRef.current.down = false;
    } else {
      return;
    }

    if (keyRef.current.up && !keyRef.current.down) {
      newDirection = -1;
    } else if (!keyRef.current.up && keyRef.current.down) {
      newDirection = 1;
    }
    setDirection(newDirection);

    //setUpdate(true);
  };

  useEffect(() => {
    socket.emit("move", { move: direction });
  }, [direction]);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("user info", (user: { id: number; pseudo: string }) => {
      setIsCreate(false);
      setIsConnected(true);
      //ID=(ROOMID)

      queryRef.current = router.query.ID;
      if (router.query.ID) {
        socket.emit("join", router.query.ID);
        router.replace("/game", undefined, { shallow: true });
      }
      //SPECTATOR=(ID)
      queryRef.current = router.query.SPECTATOR;
      if (router.query.SPECTATOR) {
        socket.emit("spectate", router.query.SPECTATOR);
        router.replace("/game", undefined, { shallow: true });
      }
      //INVITE=(ID DU HOST)
      if (router.query.INVITE) {
        socket.emit("invite", router.query.INVITE);
        router.replace("/game", undefined, { shallow: true });
      }
      //CREATE=(ID DU INVITE)
      if (router.query.CREATE) {
        setIsCreate(true);
      }
    });

    // socket.on("auth error", () => {
    //   router.replace("/connexion");
    // });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setIsGame(false);
      setIsWaiting(false);
    });

    socket.on("data", (data: PongState) => {
      setInfo(data);
    });
    socket.on("wait game", () => {
      setIsWaiting(true);
      setIsEndGame(false);
      setIsGame(false);
    });
    socket.on("game start", (id: number) => {
      setId(id);
      setIsGame(true);
      setIsEndGame(false);
      setIsWaiting(false);
    });
    socket.on("game end", (data: EndGame) => {
      endGameRef.current = data;
      setIsGame(false);
      setIsEndGame(true);
      setIsWaiting(false);
    });

    socket.on("cancel game", () => {
      setIsGame(false);
      setIsEndGame(false);
      setIsWaiting(false);
    });

    socket.emit("move", { move: 0 });

    // socket.on('user', (user : {name: string, id: }))

    return () => {
      socket.off("connect");
      socket.off("user info");
      socket.off("auth error");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("data");
      socket.off("game start");
      socket.off("wait game");
      socket.off("game end");
    };
  }, []);

  useEffect(() => {
    socket.auth.token = accessToken;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  useEffect(() => {
    if (typeof window != "undefined") {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      if (windowHeight * (16 / 9) > windowWidth) {
        scaleRef.current = windowWidth / Number(props.width);
      } else {
        scaleRef.current = windowHeight / Number(props.height);
      }
    }
    let H1 = paddleHeight;
    let H2 = paddleHeight;
    let bonus = [
      [false, false, false],
      [false, false, false],
    ];
    for (let el of info.bonus) {
      if (el.type == typeBonus[0]) {
        if (el.owner == 1) {
          H1 = paddleHeight * 2;
        } else if (el.owner == 2) {
          H2 = paddleHeight * 2;
        }
      }
    }

    if (id === "1") {
      if (info.paddle1Y == 0) {
        keyRef.current.up = false;
      } else if (info.paddle1Y == 900 - H1) {
        keyRef.current.down = false;
      }
    } else if (id === "2") {
      if (info.paddle2Y == 0) {
        keyRef.current.up = false;
        keyRef.current.down = false;
      } else if (info.paddle2Y == 900 - H2) {
        keyRef.current.down = false;
      }
    }

    const drawPong = (
      ctx: CanvasRenderingContext2D,
      props: CanvasProps,
      info: PongState
    ) => {
      let numerobonus: number = -1;
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, Number(props.width), Number(props.height));

      ctx.fillStyle = "white";
      ctx.globalAlpha = 1;
      for (let i = 25; i < 900; i += 100) {
        ctx.fillRect(800 - 5, i, 10, 50);
      }
      if (info.bonus.length) {
        info.bonus.forEach((element) => {
          switch (element.type) {
            case typeBonus[0]:
              ctx.fillStyle = "blue";
              numerobonus = 0;
              break;
            case typeBonus[1]:
              ctx.fillStyle = "yellow";
              numerobonus = 1;
              break;
            case typeBonus[2]:
              ctx.fillStyle = "red";
              numerobonus = 2;
              break;
            default:
              ctx.fillStyle = "orange";
              break;
          }
          ctx.beginPath();
          if (element.owner == 1) {
            ctx.arc(20, 20 + numerobonus * 35, 15, 0, Math.PI * 2, true);
          } else if (element.owner == 2) {
            ctx.arc(1600 - 20, 20 + numerobonus * 35, 15, 0, Math.PI * 2, true);
          } else {
            ctx.arc(element.x, element.y, bonusSize, 0, Math.PI * 2, true);
          }
          ctx.fill();
        });
      }
      ctx.fillStyle = "white";
      ctx.fillRect(40, info.paddle1Y, paddleWidth, H1);
      ctx.fillRect(
        Number(props.width) - (40 + paddleWidth),
        info.paddle2Y,
        paddleWidth,
        H2
      );
      ctx.beginPath();
      ctx.arc(info.ballX, info.ballY, ballSize, 0, Math.PI * 2, true);
      ctx.fill();
      const score1 = "" + info.score1;
      const score2 = "" + info.score2;
      ctx.font = "120px DM Sans";
      ctx.textAlign = "center";
      ctx.fillText(score1, Number(props.width) / 4, 150);
      ctx.fillText(score2, 3 * (Number(props.width) / 4), 150);
    };

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    drawPong(ctx, props, info);

    return () => {
      ctx.clearRect(0, 0, Number(props.width), Number(props.height));
    };
  }, [info]);

  if (isGame) {
    return (
      <>
        <div className=" grid grid-cols-2 mb-5 content-center">
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

        <canvas
          className="aspect-video w-full min-w-[500px] max-w-[1100px] rounded"
          width={1600}
          height={900}
          ref={canvasRef}
        />
      </>
    );
  } else if (isEndGame) {
    return (
      <>
        <div className="h-56 grid grid-cols-1 gap-8 justify-items-center">
          <span className="text-amber-500 text-6xl font-default font-bold  text-align: center mb-8">
            Gagnant!
          </span>
          <span className="text-amber-500 text-4xl font-default font-bold  text-align: center mb-8">
            {endGameRef.current.winner == endGameRef.current.id1
              ? endGameRef.current.pseudo1
              : endGameRef.current.pseudo2}
          </span>
          <div>
            <span className="text-white text-6xl font-default font-bold  text-align: center mb-8">
              {endGameRef.current.score1} : {endGameRef.current.score2}
            </span>
          </div>

          <Button
            variant="contained"
            color="active"
            onClick={() => {
              setIsEndGame(false);
              setIsGame(false);
              setIsWaiting(false);
            }}
          >
            Nouvelle Partie
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <div className="flex flex-col">
        <span className="text-white text-4xl font-default font-bold italic mb-16">
          {!isWaiting ? "Lancez une partie!" : "Un adversaire arrive!"}
        </span>
        <div className="h-56 grid grid-cols-2 gap-8 content-center">
          <Button
            variant="contained"
            color="active"
            isLoading={isWaiting}
            onClick={() => {
              if (isCreate) {
                socket.emit("create private game", router.query.CREATE, "true");
                router.replace("/game", undefined, { shallow: true });
                setIsCreate(false);
              } else {
                socket.emit("queue", true);
              }
            }}
          >
            Power-Up
          </Button>
          <Button
            variant="contained"
            color="active"
            isLoading={isWaiting}
            onClick={() => {
              if (isCreate) {
                socket.emit(
                  "create private game",
                  router.query.CREATE,
                  "false"
                );
                router.replace("/game", undefined, { shallow: true });
                setIsCreate(false);
              } else {
                socket.emit("queue", false);
              }
            }}
          >
            Classique
          </Button>
        </div>
        {isWaiting ? (
          <Button
            variant="contained"
            color="active"
            onClick={() => {
              socket.emit("cancel queue");
              setIsWaiting(false);
            }}
          >
            Cancel
          </Button>
        ) : (
          <></>
        )}
      </div>
    );
  }
};

export default Canvas;
