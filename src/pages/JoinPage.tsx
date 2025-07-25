import api from "@/api/axios";
import { AuthModal } from "@/components/AuthModal";
import { JoinGameForm } from "@/components/JoinGameForm";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/hooks/useAuth";
import type { GameSession } from "@/types";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const JoinPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleJoinGame = async (formData: {
    enteredUsername: string;
    enteredPin: string;
  }) => {
    try {
      const response = await api.post<GameSession>(
        `/sessions/${formData.enteredPin}/join`,
        { username: formData.enteredUsername }
      );
      const gameSession = response.data;
      sessionStorage.setItem("username", formData.enteredUsername);
      sessionStorage.setItem("gameSessionId", gameSession.id);
      navigate(`/game`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const mensaje = error.response?.data.message;

        console.error("Error HTTP:", status, mensaje);
      } else {
        console.error("Error inesperado:", error);
      }
    }
  };

  return (
    <div className="flex flex-col  w-1/2 lg:w-2/7 space-y-3">
      <div className="flex flex-row justify-center ">
        <Logo className="w-50" />
      </div>
      <div className="flex flex-row justify-center">
        <JoinGameForm onSubmit={handleJoinGame} />
      </div>
    </div>
  );
};
