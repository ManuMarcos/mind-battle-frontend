

import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, Stomp } from "@stomp/stompjs";

export const useWebSocket = (pin: string) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8084/games-ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("✅ Conectado al WebSocket");

      client.subscribe(`/topic/session/${pin}`, (message) => {
        const data = JSON.parse(message.body);
        console.log("📩 Mensaje recibido:", data);
        // Acá podrías actualizar estado con setPlayers por ejemplo
      });

      clientRef.current = client;
    });

    return () => {
      client.disconnect(() => console.log("🔌 Desconectado"));
    };
  }, [pin]);

  const sendMessage = (destination: string, payload: object) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.send(destination, {}, JSON.stringify(payload));
    }
  };

  return { sendMessage };
};