import type { Player } from "@/types";
import { Client, type IMessage } from "@stomp/stompjs";
import type { Socket } from "net";
import { c } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

let socket: Socket;

export const useLobbySocket = (gameSessionId: string, username: string) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        console.log("Conectado al websocket");

        client.subscribe(`/topic/session/${gameSessionId}`, (message: IMessage) => {
          const updatedPlayers = JSON.parse(message.body);
          setPlayers(updatedPlayers);
        });

        client.publish({
          destination: `/app/session/${gameSessionId}/join`,
          body: JSON.stringify({ username }),
        });
      },
      onStompError: (frame) => {
        console.log("STOMP Error:", frame);
      },
    });
    client.activate();
    clientRef.current = client;

    return () => {
        client.deactivate();
        setConnected(false);
    };
  }, [gameSessionId, username]);

  return {players, connected};
};
