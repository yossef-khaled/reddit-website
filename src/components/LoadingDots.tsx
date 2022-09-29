import { FC, useEffect, useState } from "react";

interface LoadingDotsProps {
    isLoading: boolean;

}

const LoadingDots: FC<LoadingDotsProps> = ({isLoading}) => {
    const [waitingDots, setWaitingDots] = useState('');

    // TODO : use setInterval instead
    const timerForLoadingDots = setTimeout(() => {
        waitingDots.length == 3 ? setWaitingDots('')
        :
        setWaitingDots(`${waitingDots}.`);
      }
    , 500) 
  
    useEffect(() => {
      timerForLoadingDots;
    }, []);

    if(!isLoading) {
        clearTimeout(timerForLoadingDots);
    }
    
    return (
        <div>
            Loading{waitingDots}
        </div>
    )
}

export default LoadingDots;