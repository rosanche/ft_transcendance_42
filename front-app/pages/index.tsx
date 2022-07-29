

import Canvas from "../components/Canvas"
const SSR = typeof window === 'undefined';
export default function Home()  {


    return (
        <div>
            {<Canvas width={1600} height={900} />}
        </div>
    );
}
