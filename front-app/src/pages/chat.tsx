import { RoundedContainer } from 'modules/common/components/_ui/RoundedContainer/RoundedContainer';
import React, {useState, useRef} from 'react';
import { Button } from "modules/common/components/_ui/Button/Button";
import socketio  from 'socket.io-client'

const socket = socketio('http://localhost:3000/chat');

  type Form  = {
        name : string
        text : String,
  };

const Chat = () => {
    const [data, setData] =  useState<Form>({name: "oui", text: ""});
    const [msg, setMsg] =  useState<Form[]>([]);
    const [channel, setChannel] =  useState<string[]>([]);
    const [chatName, setChatName] =  useState<string>("oui");
    const [isConnected, setIsConnected] = useState(socket.connected);
    const log = (ms : Form) => {
       //console.log(ms);
        setMsg([...msg, ms]);
        setChannel([...channel,  ms.text])
        setData({name: chatName, text: ""});
    }
    return (
      <RoundedContainer className="px-14 py-20 mt-16 bg-indigo-200">
        
        <div>
          <h1>
          {
            data.name
          }
          </h1>
        
 
        <Button  className="mb-10  px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  quit
                </Button>
                <Button  className="mb-10 ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  mute
                </Button>
                <Button  className="mb-10 ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  ban
                </Button>
                <Button  className="mb-10 ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  admin
                </Button>
              </div>
            <div>
            <input className=" px-2 py-1" type="text"  onChange={(e) => {
                if(e.keyCode === 13)
                {
    
                    log(data);
                    e.target.value = "";
                }
                 setData({name: data.name, text: e.target.value}); }} placeholder="Enter Character Name" 
                 onkeyPress={(e)=> { e.target.value = '' }}
                 name="chat"/>
                <Button  className="ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() => log(data)}
                >
                  Envoie
                </Button>
             <p>
                {
                    msg.filter((name) => (name !== data.name)).map((el) => (
                    <li key={el.name} >{el.text}/{data.name}/{el.name}</li>
                ))
                  }
             </p>
             <p>
              {
                channel.map((el) => (
                <Button  className="ml-3 px-2 py-1"
                variant="contained"
                color="active"
                onClick={() =>  setData({name: el, text: ""})}
                >
                  {
                    el
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