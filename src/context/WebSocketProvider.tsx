import { Client, type IMessage } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

type WebSocketContextType = {
    sendMessage : (destination : string, body: any) => void;
    subscribe: (destination : string, callback : (message:  IMessage) => void) => void;
    connected : boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({children} : {children : React.ReactNode}) => {
    const clientRef = useRef<Client | null>(null);
    const [connected, setConnected] = useState(false);


    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/games-ws");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                console.log("Conectado al WebSocket");
            }
        });

        client.activate();
        clientRef.current = client;
    }, []);

    const sendMessage = (destination : string, body : any) => {
        if(clientRef.current?.connected){
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
                headers: {
                    "content-type" : "application/json"
                }
            })
        }
        else{
            console.warn("WebSocket not connected yet. Cannot send:", destination);
        }
    }

    const subscribe = (destination : string, callback : (message : IMessage) => void) => {
        if(clientRef.current?.connected){
            console.log(`Suscribiendose a ${destination}`)
            clientRef.current.subscribe(destination, callback);
        }
        else{
            console.warn("WebSocket not connected yet. Cannot subscribe:", destination);
        }
        
    }

    return(
        <WebSocketContext.Provider value={{sendMessage, subscribe, connected}}>
            {children}
        </WebSocketContext.Provider>
    )
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if(!context) throw new Error("useWebSocket must be inside WebSocketProvider");
    return context;
}