import { AnswerOptions } from "@/features/game/components/AnswerOptions";
import { QuestionTimer } from "@/features/game/components/QuestionTimer";
import type {
  QuestionData,
  QuestionStats,
} from "@/types";
import { useEffect, useState } from "react";
import { AnswerStats } from "../components/AnswerStats";
import { Button } from "@/components/ui/button";

type GamePageProps = {
  question: QuestionData;
  stats: QuestionStats[] | null;
  isAdmin: boolean;
  counter: number;
  emitNextQuestion: () => void;
  emitAnswerSelected: (optionId: string) => void;
  emitShowResults: () => void;
};

export const GamePage = ({
  question,
  stats,
  isAdmin,
  counter,
  emitNextQuestion,
  emitAnswerSelected,
  emitShowResults
}: GamePageProps) => {
  const [revealCorrectAnswer, setRevealCorrectAnswer] =
    useState<boolean>(false);

  const MOCK_MODE = false;

  const handleTimeUp = () => {
    setRevealCorrectAnswer(true);
  };

  return (
    <div className="grid grid-rows-[1fr_2fr_2fr] min-h-screen ml-1 mr-1">
      <div className="flex flex-row border-2 mt-1 rounded-xl p-2 justify-center bg-gray-100 items-center">
        <span className="text-4xl">{question.text}</span>
      </div>

      <div className="flex flex-row justify-between items-center">
        <QuestionTimer
          key={question.id}
          questionStartTime={question.questionStartTime}
          timeLimitSeconds={question.timeLimitSeconds}
          onTimeUp={() => handleTimeUp()}
        />

        {stats && <AnswerStats stats={stats} />}

        <div className="flex flex-col h-full mr-2 justify-between">
          {(isAdmin && stats) || MOCK_MODE ? (
            question.hasNext ? (
              <Button
                onClick={emitNextQuestion}
                className="mt-1 cursor-pointer"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={emitShowResults}
                className="mt-1 cursor-pointer"
              >
                Mostrar Resultados
              </Button>
            )
          ) : (
            <div />
          )}

          <div className="flex flex-col justify-center text-center">
            <span>Respuestas</span>
            <span>{counter}</span>
          </div>

          <div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1">
        <AnswerOptions
          onAnswerSelected={emitAnswerSelected}
          revealCorrectAnswer={revealCorrectAnswer}
          options={question.options}
        />
      </div>
    </div>
  );
};
