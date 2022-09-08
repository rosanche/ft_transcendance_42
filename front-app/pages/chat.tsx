import React, {useState, useRef} from 'react';
import socketio  from 'socket.io-client'

const socket = socketio('http://localhost:3000/chat',{
    autoConnect: false
  });

  type Form  = {
        text : String,
  };

const Chat = () => {
    const [data, setData] =  useState<string>("");
    const [msg, setMsg] =  useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const log = (ms : string) => {
       console.log(ms);
        setMsg([...msg, ms]);
        setData("");
    }
    return (
        <div>
            <input  type="text"  onChange={(e) => {
                if(e.keyCode === 13)
                {
                    console.log("AAAAAAAA");
                    log(data);
                    e.target.value = "";
                }
                 setData(e.target.value); }} placeholder="Enter Character Name" 
                 onkeyPress={(e)=> { console.log("sss"); e.target.value = '' }}
                 name="chat"/>
                <button type="submit" onClick={() => log(data)}> 
                        envoie
                    </button>
             <p>
             <ul>
                {
                    msg.map((el) => (
                    <li key={el} >{el}</li>
                ))}
             </ul>
             </p>
        </div>
    );
};

export default Chat;