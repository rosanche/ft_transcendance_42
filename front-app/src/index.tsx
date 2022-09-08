const SSR = typeof window === 'undefined';

import ReactDOM from 'react-dom/client';
import * as React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
     
    root.redender(
        <Chat />
    );
