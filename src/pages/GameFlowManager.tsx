import type { EventMessage, GameSession, PlayerData, QuestionData } from "@/types";
import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { LobbyPage } from "./LobbyPage";
import { GamePage } from "./GamePage";
import { DashboardLayout } from "@/components/DashBoardLayout";
import { CenteredLayout } from "@/components/CenteredLayout";

export const GameFlowManager = () => {
  const location = useLocation();
  const [stage, setStage] = useState<"lobby" | "game">("lobby");
  const [playerUsernames, setPlayerUsernames] = useState<string[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const username = sessionStorage.getItem("username");
  const gameSessionId = sessionStorage.getItem("gameSessionId");
  const clientRef = useRef<Client | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log("state", location.state);

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

  const handlePlayerLeftEvent = (data : PlayerData) => {
    const newUsername = data.username;
    setPlayerUsernames((prev) =>
      prev.filter((username) => username !== newUsername)
    );
  };

  const handleGameStartedEvent = (data : QuestionData) => {
    setQuestionData(data);
    setStage("game");
    console.log("QuestionData: " + JSON.stringify(data));
}

  const connectToWebSocket = () => {
    const socket = new SockJS("http://localhost:8084/games-ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Conectado al websocket");

        client.subscribe(
          `/topic/session/${gameSessionId}`,
          (message: IMessage) => {
            const response: EventMessage = JSON.parse(message.body);
            console.log(response);
            switch (response.event) {
              case "PLAYER_JOINED":
                console.log("player_joined");
                handlePlayerJoinedEvent(response.data);
                break;
              case "PLAYER_LEFT":
                handlePlayerLeftEvent(response.data);
                break;
              case "GAME_STARTED":
                handleGameStartedEvent(response.data);
                break;
            }
          }
        );

        client.publish({
          destination: `/app/session/${gameSessionId}/join`,
          body: JSON.stringify({ username }),
        });

        console.log(`Suscribed to /topic/session/${gameSessionId} successfuly`);
      },
      onStompError: (frame) => {
        console.log("STOMP Error:", frame);
      },
    });
    client.activate();
    clientRef.current = client;
  };

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
    connectToWebSocket();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {stage === "lobby" && (
        <DashboardLayout>
          <LobbyPage
            pin={gameSession?.pin}
            playersUsername={playerUsernames}
            onStart={() => {
              clientRef.current?.publish({
                destination: `/app/session/${gameSessionId}/start`,
                body: JSON.stringify({}),
              });
              
            }}
          />
        </DashboardLayout>
      )}
      {(stage === "game" && questionData ) && <GamePage  question={questionData} />}
    </>
  );
};
