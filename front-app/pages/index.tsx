const SSR = typeof window === 'undefined';

import ReactDOM from 'react-dom/client';
import * as React from 'react';


const socket = socketio('http://localhost:3000/game',{
    autoConnect: false
  });

  
const root = ReactDOM.createRoot(document.getElementById('root'));
     
    root.redender(
        <Chat />
    );