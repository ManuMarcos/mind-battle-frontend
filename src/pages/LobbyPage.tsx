import { PlayersList } from "@/components/PlayersList";
import { Badge } from "@/components/ui/badge";
import type { EventMessage, GameSession, PlayerSession } from "@/types";
import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export const LobbyPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const username = location.state?.username;
  const [playerUsernames, setPlayerUsernames] = useState<string[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const clientRef = useRef<Client | null>(null);

  const getGameData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8084/api/sessions/${sessionId}`,
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

  const handlePlayerJoinedEvent = ({ data }: EventMessage) => {
    const newUsername = data.username;

    setPlayerUsernames((prevUsernames) => {
      if (prevUsernames.includes(data.username)) return prevUsernames;
      return [...prevUsernames, newUsername];
    });
  };

  const handlePlayerLeftEvent = ({ data }: EventMessage) => {
    const newUsername = data.username;
    setPlayerUsernames((prev) =>
      prev.filter((username) => username !== newUsername)
    );
  };

  const connectToWebSocket = () => {
    const socket = new SockJS("http://localhost:8084/games-ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Conectado al websocket");

        client.subscribe(`/topic/session/${sessionId}`, (message: IMessage) => {
          const response: EventMessage = JSON.parse(message.body);
          console.log(response);
          switch (response.event) {
            case "PLAYER_JOINED":
              console.log("player_joined");
              handlePlayerJoinedEvent(response);
              break;
            case "PLAYER_LEFT":
              handlePlayerLeftEvent(response);
              break;
          }
        });

        client.publish({
          destination: `/app/session/${sessionId}/join`,
          body: JSON.stringify({ username }),
        });

        console.log(`Suscribed to /topic/session/${sessionId} successfuly`);
      },
      onStompError: (frame) => {
        console.log("STOMP Error:", frame);
      },
    });
    client.activate();
    clientRef.current = client;
  };

  useEffect(() => {
    getGameData();
    connectToWebSocket();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <span className="text-kahoot-dark font-bold text-6xl tracking-wide">
            {gameSession?.pin}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-4 mb-3 mr-4 mt-2">
        <div className="flex flex-row justify-between items-center space-x-2">
          <div>
            <FontAwesomeIcon icon={faUser} size="xl"/>
            <span className="ml-1">{playerUsernames.length}</span>
          </div>
          <button className="bg-primary hover:bg-cyan-400 text-white font-bold py-2 px-6 rounded-md shadow-md">
            Iniciar
          </button>
        </div>
        <div className="flex flex-row justify-center">
          {playerUsernames && <PlayersList playersUsername={playerUsernames} />}
        </div>
      </div>
    </div>
  );
};
