import { RoundedContainer } from 'modules/common/components/_ui/RoundedContainer/RoundedContainer';
import React, {useState, useRef, useEffect} from 'react';
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio  from 'socket.io-client'
import { useRouter } from "next/router";

const socket = socketio('http://localhost:3000/chat',{
  autoConnect: false,
  auth: {
      token: "abcd"
    }
});

  type Form  = {
        channel : string,
        pseudo : string,
        texte : String,
  };

  type channel  = {
    id : number,
    name : string,
    private : boolean,
    admin : boolean,
};


const Chat = () => {
    const [data, setData] =  useState<Form>({pseudo : "me", channel: "general" ,texte: ""});
    const [msg, setMsg] =  useState<Form[]>([]);
    const [msg2, setMsg2] =  useState<string>("");
    const [channel, setChannel] =  useState<channel[]>([]);
    const [chatName, setChatName] =  useState<channel>({id:0, name : "", private : false});
    //const [pre, setPre] =  useState<Form>({pseudo : "", channel: "" ,text: ""});
    const [isConnected, setIsConnected] = useState(socket.connected);
    const router = useRouter();

    const quit = async (chat : channel) =>{
        await socket.emit('quit', chat)
        const u = await channel.filter(el => chat.name !== el.name);
        console.log(u);
       await setChannel(u);
       console.log(channel);
       await setChatName(channel[0])
        await console.log(chatName);
        const a : channel = await channel.at(0);
        console.log(a.name);
      await  setData({pseudo : data.pseudo, channel: a.name ,texte: ""})
    }

    const sendMessage = async () => {
      console.log("ouiiiiiiiii")
      //console.log(msg2)
    //  setData({channel : data.channel, pseudo: data.pseudo, texte: msg2})
     console.log("UN JOUR PEUT ETRE")
     console.log(data)
      await  socket.emit("channelToServer",data);
      setMsg2("");
      setData({channel: data.channel, pseudo : data.pseudo ,texte: ""});
    }

    const changechannel = (el : channel) => {
      setData({channel: el.name, pseudo: 'me' ,text: ""});
      setChatName(el)
    }

    const log = (ms : Form) => {
       console.log(ms);
          setMsg((m) => [...m,ms])
        //setChannel([...channel,  ms.text])
       
     //   setMsg([...msg, data]);
        //setData({channel: chatName, pseudo : data.pseudo ,texte: ""});
    }
    useEffect(() => {

      socket.on('channels list' ,(channels : string[]) => {
        setChannel(channels)
      })
      socket.on('info channel', (mm : {}[])=>{
        setMsg(mm);
      })

      socket.on('left chanel', (room : channel ) =>{
        setChatName({id:0, name : "", private : false})
      })

      socket.on('connect', () => {
          setIsConnected(true);
      });

      socket.on('user info', (user : {id: number, pseudo: string}) => {
          console.log(user);
      });

      socket.on('auth error', () => {
          router.replace("/connexion")
      });
  
      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('chatToClient', (src : Form) => {
        console.log("noono")
        console.log(src)
        log(src)
      });
      


      //   socket.on('user', (user : {name: string, id: }))
    
      return () => {
          socket.off('info channel')
          socket.off('info channel')
          socket.off('connect');
          socket.off('user info');
          socket.off('auth error');
          socket.off('disconnect');
          socket.off('chatToClient');
          socket.off('left chanel');
      };
  },[]);

  useEffect(() => {
     //   console.log("oui!!!!!!!!!!!!!!!!!!!!!!!!!")
    if (typeof document != "undefined") {
        const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('access_token'))?.split('=')[1];
        console.log(cookieValue);
        socket.auth.token = cookieValue;
        console.log(router.query)
        socket.connect();
        socket.emit("channelinit");
        socket.emit("listchannels");
    }

    return () => {
        socket.disconnect();
    };
},[]);

    return (
      <RoundedContainer className="px-14 py-20 mt-16 bg-indigo-200">
        
        <div>
          <h1>
          {
            data.channel
          }
          </h1>
         
              <Button  className="mb-10  px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => quit(chatName)}
                >
                  quit
                </Button>
              {
                chatName.admin  ? 
              (
                <h2>
              <Button  className="mb-10  px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  blocked
                </Button>
                <Button  className="mb-10  px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  ban
                </Button>
                </h2>
                ): (<h1></h1>)
                }
              </div>
            <div>
            <input className=" px-2 py-1" type="text" value={data.texte}  onChange={(e) => {
                 setData({channel :  data.channel , pseudo : data.pseudo , texte : e.target.value}); }} placeholder="Enter Character Name" 
                 onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
                 name="chat"/>
                <Button  className="ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() =>  sendMessage()}
                >
                  Envoie
                </Button>
             <p>
                {
                    msg.filter((el)=> el.channel === data.channel).map((el) => (
                    <li key={el.channel}>{el.pseudo} : {el.texte}</li>
                ))
                  }
             </p>
             <p>
              {
                channel.map((el) => (
                <Button  className="ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => changechannel(el)  }
                >
                  {
                    el.name
                  }
                </Button>

                ))
              }
             </p>
        </div>
        </RoundedContainer>
    );
};

export default Chat;