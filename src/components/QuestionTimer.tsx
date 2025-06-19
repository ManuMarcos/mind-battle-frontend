import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { AnswerResponsesCounter } from "./AnswerResponsesCounter";
import type { QuestionStats } from "@/types";
import { AnswerStats } from "./AnswerStats";

type QuestionTimerProps = {
  questionStartTime: string;
  timeLimitSeconds: number;
  stats: QuestionStats[];
  onTimeUp: () => void;
  onNextQuestion : () => void;  
};

export const QuestionTimer = ({
  questionStartTime,
  timeLimitSeconds,
  onTimeUp,
  onNextQuestion,
  stats
}: QuestionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimitSeconds);
  const sessionId = sessionStorage.getItem("gameSessionId");

  useEffect(() => {
    const endTime =
      new Date(questionStartTime).getTime() + timeLimitSeconds * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [questionStartTime, timeLimitSeconds]);

  return (
    <div className="flex flex-row lg:text-2xl ml-2 justify-between ">
      <div className="flex flex-row items-center">
        <div className="lg:text-2xl font-bold w-20 h-20 rounded-full bg-cyan-500 text-white flex flex-col items-center justify-center">
          {timeLeft}
        </div>
      </div>
      <AnswerStats stats={stats}/>
      <div className="grid grid-cols-1 grid-rows-[2fr_3fr]  mr-2">
        <Button onClick={onNextQuestion} className="mt-1 cursor-pointer">Siguiente</Button>
        {sessionId && <AnswerResponsesCounter sessionId={sessionId} />}
      </div>
    </div>
  );
};
