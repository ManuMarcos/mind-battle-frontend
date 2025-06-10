import { useEffect, useState } from "react";


type QuestionTimerProps = {
    questionStartTime : string;
    timeLimitSeconds : number;
    onTimeUp: () => void;
}




export const QuestionTimer = ({questionStartTime, timeLimitSeconds, onTimeUp} : QuestionTimerProps) => {
    const[timeLeft, setTimeLeft] =  useState<number>(timeLimitSeconds);

    useEffect( () => {
        const endTime = new Date(questionStartTime).getTime() + timeLimitSeconds * 1000;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now)/ 1000 ));
            setTimeLeft(remaining);

            if(remaining <= 0){
                clearInterval(interval);
                onTimeUp();
            }
        }, 250);

        return () => clearInterval(interval);
    }, [questionStartTime, timeLimitSeconds] )

    return(
        <div className="flex flex-row lg:text-2xl items-center ml-2 justify-between ">
        <div className="lg:text-2xl font-bold w-20 h-20 rounded-full bg-cyan-500 text-white flex items-center justify-center">
          {timeLeft}
        </div>
        <div className="flex flex-col mr-2">
            <span>Answers</span>
            <span className="text-center">12</span>
        </div>
      </div>
    )
}