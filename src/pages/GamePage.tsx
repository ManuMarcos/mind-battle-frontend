import { AnswerOptions } from "@/components/AnswerOptions";
import { QuestionTimer } from "@/components/QuestionTimer";
import type { Option, QuestionData } from "@/types";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const answers: Option[] = [
  { text: "opcion1", id: "1", correct: false },
  { text: "opcion2", id: "2", correct: false },
  { text: "opcion3", id: "3", correct: true },
  { text: "opcion4", id: "4", correct: false },
];

type GamePageProps = {
  question: QuestionData;
};

export const GamePage = ({ question }: GamePageProps) => {
  const [revealCorrectAnswer, setRevealCorrectAnswer] =
    useState<boolean>(false);

  const handleTimeUp = () => {
    setRevealCorrectAnswer(true);
  };

  return (
    <div className="grid grid-rows-[1fr_2fr_2fr] min-h-screen ml-1 mr-1">
      <div className="flex flex-row bg-gray-100 border-2 rounded-xl p-2 justify-center items-center">
        <span className="text-4xl">{question.text}</span>
      </div>

      <QuestionTimer
        questionStartTime={question.questionStartTime}
        timeLimitSeconds={question.timeLimitSeconds}
        onTimeUp={() => handleTimeUp()}
      />

      <div className="grid grid-cols-2 gap-2 mb-1">
        <AnswerOptions
          onAnswerSelected={(resp) => console.log(resp)}
          revealCorrectAnswer={revealCorrectAnswer}
          options={question.options}
        />
      </div>
    </div>
  );
};
