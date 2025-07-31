import {
  type PaginatedResponse,
  type AnswerReceived,
  type EventMessage,
  type GameSession,
  type PlayerData,
  type QuestionData,
  type QuestionStats,
  type AnswerRequest,
  type PlayerResult,
} from "@/types";
import {useState } from "react";
import { Navigate } from "react-router-dom";
import { LobbyPage } from "../../lobby/pages/LobbyPage";
import { GamePage } from "../pages/GamePage";
import { DashboardLayout } from "@/components/DashBoardLayout";
import { useWebSocket } from "@/context/WebSocketProvider";
import api from "@/api/axios";
import { toast, Toaster } from "sonner";
import type { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useGameSessionLifecycle } from "@/hooks/useGameSessionLifecycle";
import { handleApiError } from "@/utils/handleApiError";
import { GameResults } from "./GameResults";
import { mockQuestion } from "../mocks";
import { WebSocketRoutes } from "@/constants/webSocketRoutes";
import { getSessionInfo } from "@/utils/session";

type MockState = "game" | "results" | "lobby" | null;
const MOCK_STATE:  MockState = null;

export const GameFlowManager = () => {
  const [stage, setStage] = useState<"lobby" | "game" | "results">("lobby");
  const [playersUsernames, setPlayersUsernames] = useState<string[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null); 
  const [stats, setGameStats] = useState<QuestionStats[] | null>(null);
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);
  const sessionInfo = getSessionInfo();
  const auth = useAuth();
  const { connected, subscribe, sendMessage } = useWebSocket();

  if (!MOCK_STATE && (!sessionInfo)) {
    console.log("faltan datos")    
    return <Navigate to="/" replace />;
  }
  const {username, gameSessionId} = getSessionInfo()!;
  
  const handlePlayerJoined = (data: PlayerData) => {
    const newUsername = data.username;

    setPlayersUsernames((prevUsernames) => {
      if (prevUsernames.includes(data.username)) return prevUsernames;
      return [...prevUsernames, newUsername];
    });
  };

  const handleAnswerReceived = (data: AnswerReceived) => {
    setNumberOfAnswers(data.currentCount);
  };

  const handleNextQuestion = (data: QuestionData) => {
    setQuestionData(data);
    setGameStats(null);
  };

  const emitNextQuestion = () => {
    api
      .post(`/sessions/${gameSessionId}/next`)
      .catch(handleApiError)
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("gameSessionId");
  };

  const handlePlayerLeft = (data: PlayerData) => {
    const newUsername = data.username;
    setPlayersUsernames((prev) =>
      prev.filter((username) => username !== newUsername)
    );
  };

  const handleGameStarted = (data: QuestionData) => {
    setQuestionData(data);
    setStage("game");
    console.log("QuestionData: " + JSON.stringify(data));
  };

  const handleStartGame = () => {
    api
      .post(`/sessions/${gameSessionId}/start`)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Partida iniciada con exito");
        }
      })
      .catch(handleApiError)
  };

  const handleQuestionEnded = (stats : QuestionStats[]) => {
    setGameStats(stats);
  }

  const handleGameResults = (results : PlayerResult[]) => {
    setStage("results");
  }

  const emitAnswerSelected = (optionId: string) => {
    console.log(`handleOnAnswerSelect with optionId:${optionId}`);
    if (username && gameSessionId && questionData) {
      const answerRequest: AnswerRequest = {
        username: username,
        questionId: questionData.id,
        selectedOptionId: optionId,
      };
      sendMessage(WebSocketRoutes.APP_ANSWER_QUESTION(gameSessionId), answerRequest);
    }
  };

  const emitShowResults = () => {
    sendMessage(WebSocketRoutes.APP_SHOW_RESULTS(gameSessionId), {});
  }


  const isAdmin = () => {
    if (auth.token) {
      const token = jwtDecode(auth.token);
      if (token.sub === gameSession?.createdBy) {
        return true;
      }
    }
    return false;
  };

  useGameSessionLifecycle({
    gameSessionId : gameSessionId ?? "mock-session-id",
    username : username ?? "mock-user",
    connected,
    sendMessage,
    subscribe : subscribe,
    onBeforeUnload : handleBeforeUnload,
    onGameStarted : handleGameStarted,
    onNextQuestion : handleNextQuestion,
    onPlayerJoined : handlePlayerJoined,
    onPlayerLeft : handlePlayerLeft,
    onQuestionEnded : handleQuestionEnded,
    onAnswerReceived : handleAnswerReceived,
    onShowResults : handleGameResults,
    setPlayersUsernames,
    setGameSession
  })

  if(MOCK_STATE === "game"){
    return(
      <GamePage
          question={mockQuestion}
          counter={numberOfAnswers}
          stats={stats}
          isAdmin={isAdmin()}
          emitNextQuestion={emitNextQuestion}
          emitAnswerSelected={emitAnswerSelected}
          emitShowResults={emitShowResults}
        />
    )
  }

  return (
    <>
      {stage === "lobby" && (
        <DashboardLayout>
          <LobbyPage
            pin={gameSession?.pin}
            playersUsername={playersUsernames}
            onStart={handleStartGame}
            isAdmin={isAdmin()}
          />
        </DashboardLayout>
      )}
      {stage === "game" && questionData && (
        <GamePage
          question={questionData}
          stats={stats}
          counter={numberOfAnswers}
          isAdmin={isAdmin()}
          emitNextQuestion={emitNextQuestion}
          emitAnswerSelected={emitAnswerSelected}
          emitShowResults={emitShowResults}
        />
      )}
      {stage === "results" && (
        <GameResults/>
      )}
      <Toaster richColors position="top-left" closeButton/>
    </>
  );
};
