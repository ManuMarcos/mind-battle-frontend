import { useEffect, useState } from "react";
import type { QuestionStats } from "@/types";

type QuestionTimerProps = {
  questionStartTime: string;
  timeLimitSeconds: number;
  onTimeUp: () => void;
};

export const QuestionTimer = ({
  questionStartTime,
  timeLimitSeconds,
  onTimeUp,
}: QuestionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimitSeconds);

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
    <div className="lg:text-2xl font-bold w-20 h-20 rounded-full bg-cyan-500 text-white flex flex-col items-center justify-center">
      {timeLeft}
    </div>
  );
};
