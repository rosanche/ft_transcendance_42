

import { Page } from 'modules/common/components/_ui/Page/Page';
import { RoundedContainer } from 'modules/common/components/_ui/RoundedContainer/RoundedContainer';
import Canvas from 'modules/game/Canvas';

import React, {useCallback, useEffect, useRef, useState} from 'react';
const SSR = typeof window === 'undefined';

export default function Game()  {
    const SSR = typeof window === 'undefined';
    

    return (
        <Page>
            <RoundedContainer className="aspect-video px-14 py-20 mt-16">
                <div className="aspect-video w-full">
                    {<Canvas width={1600} height={900}/>}
                </div>
            </RoundedContainer>
        </Page>
    );
}
