import type {
  AnswerReceived,
  EventMessage,
  GameSession,
  PlayerData,
  QuestionData,
} from "@/types";
import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { LobbyPage } from "./LobbyPage";
import { GamePage } from "./GamePage";
import { DashboardLayout } from "@/components/DashBoardLayout";
import { CenteredLayout } from "@/components/CenteredLayout";
import { useWebSocket } from "@/context/WebSocketProvider";
import { WebSocketRoutes } from "@/constants/webSocketRoutes";

export const GameFlowManager = () => {
  const location = useLocation();
  const [stage, setStage] = useState<"lobby" | "game">("lobby");
  const [playerUsernames, setPlayerUsernames] = useState<string[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(0);
  const username = sessionStorage.getItem("username");
  const gameSessionId = sessionStorage.getItem("gameSessionId");
  const clientRef = useRef<Client | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { connected, subscribe, sendMessage } = useWebSocket();

  if (!username || !gameSessionId) {
    return <Navigate to="/" replace />;
  }

  const handlePlayerJoinedEvent = (data: PlayerData) => {
    const newUsername = data.username;

    setPlayerUsernames((prevUsernames) => {
      if (prevUsernames.includes(data.username)) return prevUsernames;
      return [...prevUsernames, newUsername];
    });
  };

  const handlePlayerLeftEvent = (data: PlayerData) => {
    const newUsername = data.username;
    setPlayerUsernames((prev) =>
      prev.filter((username) => username !== newUsername)
    );
  };

  const handleGameStartedEvent = (data: QuestionData) => {
    setQuestionData(data);
    setStage("game");
    console.log("QuestionData: " + JSON.stringify(data));
  };

  const onStart = async () => {
    try {
      const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ODRjOGUyNTA3Y2NlYWJiOWEwZmI1ZWQiLCJpYXQiOjE3NTAzNTQyNDIsImV4cCI6MTc1MDM2ODY0Mn0.tTr-d4BXbLDhYx7YyBjOkOO1kBhZwoRXAdHr70Cgv4U"
      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${gameSessionId}/start`,
        {
          method: "POST",
          headers: {
            "Authorization" : `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        throw new Error("Error al iniciar partida");
      }
    } catch (err) {
      console.log("Ocurrio un error: ", err);
    }
    console.log("start")
  }


  const handleAnswerReceived = (data: AnswerReceived) => {
    setNumberOfAnswers(data.currentCount);
  };

  const handleNextQuestion = (data : QuestionData) => {
    setQuestionData(data);
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = "";
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("gameSessionId");
  };

  const getGameData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${gameSessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const gameSessionInfo: GameSession = await response.json();
      setGameSession(gameSessionInfo);
      const usernames = gameSessionInfo.players.map((p) => p.username);
      setPlayerUsernames(usernames);
    } catch (err) {
      console.log("Ocurrio un error: ", err);
    }
  };

  useEffect(() => {
    getGameData();
    if(connected){
      sendMessage(
        WebSocketRoutes.APP_JOIN_SESSION(gameSessionId),
        { username : username }
      );
      subscribe(WebSocketRoutes.TOPIC_SESSION(gameSessionId), (message: IMessage) => {
        const response: EventMessage = JSON.parse(message.body);
        console.log(response);
        switch (response.event) {
          case "PLAYER_JOINED":
            handlePlayerJoinedEvent(response.data);
            break;
          case "PLAYER_LEFT":
            handlePlayerLeftEvent(response.data);
            break;
          case "GAME_STARTED":
            handleGameStartedEvent(response.data);
            break;
          case "NEXT_QUESTION":
            handleNextQuestion(response.data);
            break;
        }
      });
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connected]);

  return (
    <>
      {stage === "lobby" && (
        <DashboardLayout>
          <LobbyPage
            pin={gameSession?.pin}
            playersUsername={playerUsernames}
            onStart={onStart}
          />
        </DashboardLayout>
      )}
      {stage === "game" && questionData && <GamePage key={questionData.id} question={questionData} />}
    </>
  );
};
