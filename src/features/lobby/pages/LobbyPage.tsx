import { PlayersList } from "@/components/PlayersList";
import { Badge } from "@/components/ui/badge";
import type { EventMessage, GameSession, PlayerSession } from "@/types";
import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

type LobbyPageProps = {
  pin: string | undefined;
  playersUsername: string[];
  onStart: () => void;
  isAdmin: boolean;
};

export const LobbyPage = ({
  pin,
  playersUsername,
  onStart,
  isAdmin,
}: LobbyPageProps) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="bg-white p-4 rounded-lg shadow-lg text-center">
          <span className="text-kahoot-dark font-bold text-6xl tracking-wide">
            {pin}
          </span>
        </div>
      </div>
      {playersUsername && (
        <div className="flex flex-col space-y-4 mb-3 mr-4 mt-2">
          <div className="flex flex-row justify-between items-center space-x-2">
            <div>
              <FontAwesomeIcon icon={faUser} size="xl" />
              <span className="ml-1">{playersUsername.length}</span>
            </div>
            {isAdmin && (
              <button
                onClick={onStart}
                className="bg-primary   text-white font-bold py-2 px-6 rounded-md shadow-md cursor-pointer"
              >
                Iniciar
              </button>
            )}
          </div>
          <div className="flex flex-row justify-center">
            <PlayersList playersUsername={playersUsername} />
          </div>
        </div>
      )}
    </div>
  );
};
