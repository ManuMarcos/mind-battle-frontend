import api from "@/api/axios";
import { WebSocketRoutes } from "@/constants/webSocketRoutes";
import { useWebSocket } from "@/context/WebSocketProvider";
import type {
  AnswerReceived,
  EventMessage,
  GameSession,
  PlayerData,
  PlayerResult,
  QuestionData,
  QuestionStats,
} from "@/types";
import { handleApiError } from "@/utils/handleApiError";
import type { IMessage } from "@stomp/stompjs";
import type { AxiosError } from "axios";
import { useEffect } from "react";

type Params = {
  username: string;
  gameSessionId: string;
  connected : boolean;
  sendMessage : (destination: string, body: object) => void;
  subscribe : (destination : string, callback : (message : IMessage) =>  void) => void;
  onPlayerJoined: (data: PlayerData) => void;
  onPlayerLeft: (data: PlayerData) => void;
  onGameStarted: (data: QuestionData) => void;
  onNextQuestion: (data: QuestionData) => void;
  onQuestionEnded: (data : QuestionStats[]) => void;
  onAnswerReceived: (data: AnswerReceived) => void;
  onShowResults: (data: PlayerResult[]) => void;
  onBeforeUnload: (event: BeforeUnloadEvent) => void;
  setGameSession: (gameSession: GameSession) => void;
  setPlayersUsernames: (players: string[]) => void;
};

export const useGameSessionLifecycle = ({
  username,
  gameSessionId,
  connected,
  subscribe,
  sendMessage,
  onPlayerJoined,
  onPlayerLeft,
  onGameStarted,
  onNextQuestion,
  onQuestionEnded,
  onAnswerReceived,
  onShowResults,
  onBeforeUnload,
  setGameSession,
  setPlayersUsernames,
}: Params) => {

  useEffect(() => {
    fetchGameData();
    if (connected) {
      sendMessage(WebSocketRoutes.APP_JOIN_SESSION(gameSessionId), {
        username: username,
      });
      subscribe(
        WebSocketRoutes.TOPIC_SESSION(gameSessionId),
        (message: IMessage) => {
          console.log(JSON.stringify(message.body))
          const response: EventMessage = JSON.parse(message.body);
          switch (response.event) {
            case "PLAYER_JOINED":
              onPlayerJoined(response.data);
              break;
            case "PLAYER_LEFT":
              onPlayerLeft(response.data);
              break;
            case "GAME_STARTED":
              onGameStarted(response.data);
              break;
            case "NEXT_QUESTION":
              onNextQuestion(response.data);
              break;
            case "QUESTION_END":
              onQuestionEnded(response.data);
              break;
            case "ANSWER_RECEIVED":
              onAnswerReceived(response.data);
              break;
            case "SHOW_RESULTS":
              onShowResults(response.data);
              break;
          }
        }
      );
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [connected]);

  const fetchGameData = () => {
    api
      .get<GameSession>(`/sessions/${gameSessionId}`)
      .then((response) => {
        if (response.status === 200) {
          setGameSession(response.data);
          const usernames = response.data.players.map((p) => p.username);
          setPlayersUsernames(usernames);
        }
      })
      .catch(handleApiError);
  };
};
