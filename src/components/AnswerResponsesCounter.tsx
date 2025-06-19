import { WebSocketRoutes } from "@/constants/webSocketRoutes";
import { useWebSocket } from "@/context/WebSocketProvider"
import type { EventMessage } from "@/types";
import type { IMessage } from "@stomp/stompjs";
import { useEffect, useState } from "react";




export const AnswerResponsesCounter = ({sessionId} : {sessionId : string}) => {
    const {subscribe} = useWebSocket();
    const [count, setCount] = useState(0);

    useEffect(() => {
        subscribe(WebSocketRoutes.TOPIC_SESSION(sessionId), (message : IMessage) => {
            const {event} : EventMessage = JSON.parse(message.body);
            if(event === "ANSWER_RECEIVED"){
                setCount((prev) => prev + 1);
            }
        })
    }, [subscribe]);

    return (
        <div className="flex flex-col">
          <span>Answers</span>
          <span className="text-center">{count}</span>
        </div>
    )
}