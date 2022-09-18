

import { Page } from 'modules/common/components/_ui/Page/Page';
import { RoundedContainer } from 'modules/common/components/_ui/RoundedContainer/RoundedContainer';
import Canvas from 'modules/game/Canvas';

import React, {useCallback, useEffect, useRef, useState} from 'react';

export default function Game()  {
    const SSR = typeof window === 'undefined';
    

    return (
        <Page>
            <RoundedContainer className="px-14 py-20 mt-16">
                <div>
                    {<Canvas width={1600} height={900}/>}
                </div>
            </RoundedContainer>
        </Page>
    );
}
