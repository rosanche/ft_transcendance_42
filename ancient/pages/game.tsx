

import Canvas from "../components/Canvas"
import React, {useCallback, useEffect, useRef, useState} from 'react';
const SSR = typeof window === 'undefined';

export default function Game()  {
    const SSR = typeof window === 'undefined';
    

    return (
        <div >
            {<Canvas width={1600} height={900}/>}
        </div>
    );
}
