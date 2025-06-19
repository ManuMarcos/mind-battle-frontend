import { AnswerOptions } from "@/components/AnswerOptions";
import { QuestionTimer } from "@/components/QuestionTimer";
import { WebSocketRoutes } from "@/constants/webSocketRoutes";
import { useWebSocket } from "@/context/WebSocketProvider";
import type {
  AnswerReceived,
  AnswerRequest,
  EventMessage,
  Option,
  QuestionData,
  QuestionStats,
} from "@/types";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";

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
  const gameSessionId = sessionStorage.getItem("gameSessionId");
  const username = sessionStorage.getItem("username");
  const { subscribe, sendMessage } = useWebSocket();
  const [stats, setStats] = useState<QuestionStats[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleTimeUp = () => {
    setRevealCorrectAnswer(true);
  };

  const handleOnAnswerSelect = (optionId: string) => {
    console.log(`handleOnAnswerSelect with optionId:${optionId}`);
    if (username && gameSessionId) {
      const answerRequest: AnswerRequest = {
        username: username,
        questionId: question.id,
        selectedOptionId: optionId,
      };
      sendMessage(`/app/session/${gameSessionId}/answer`, answerRequest);
    }
  };

  const handleStats = (stats : QuestionStats[]) => {
    setStats(stats);
    console.log("showing stats")
  }

  const handleOnNextQuestion = async () => {
    try {
      const jwtToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ODRjOGUyNTA3Y2NlYWJiOWEwZmI1ZWQiLCJpYXQiOjE3NTAzNTQyNDIsImV4cCI6MTc1MDM2ODY0Mn0.tTr-d4BXbLDhYx7YyBjOkOO1kBhZwoRXAdHr70Cgv4U";
      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${gameSessionId}/next`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al iniciar partida");
      }
    } catch (err) {
      console.log("Ocurrio un error: ", err);
    }
    console.log("NEXT_QUESTION");
  };

  useEffect(() => {
    if (gameSessionId) {
      subscribe(
        WebSocketRoutes.TOPIC_SESSION(gameSessionId),
        (message: IMessage) => {
          const { event, data }: EventMessage = JSON.parse(message.body);
          /*if(event === "ANSWER_RECEIVED"){
            setCount((prev) => prev + 1);
        }*/
          if (event === "QUESTION_END") {
            handleStats(data);
          }
        }
      );
    }
  }, [subscribe]);

  return (
    <div className="grid grid-rows-[1fr_2fr_2fr] min-h-screen ml-1 mr-1">
      <div className="flex flex-row bg-gray-100 border-2 rounded-xl p-2 justify-center items-center">
        <span className="text-4xl">{question.text}</span>
      </div>

      <QuestionTimer
        questionStartTime={question.questionStartTime}
        timeLimitSeconds={question.timeLimitSeconds}
        onNextQuestion={() => handleOnNextQuestion()}
        onTimeUp={() => handleTimeUp()}
        stats={stats}
      />

      <div className="grid grid-cols-2 gap-2 mb-1">
        <AnswerOptions
          onAnswerSelected={(optionId) => handleOnAnswerSelect(optionId)}
          revealCorrectAnswer={revealCorrectAnswer}
          options={question.options}
        />
      </div>
    </div>
  );
};
