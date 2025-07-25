import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import { JoinPage } from "./pages/JoinPage";
import { CenteredLayout } from "./components/CenteredLayout";
import { LobbyPage } from "./pages/LobbyPage";
import { DashboardLayout } from "./components/DashBoardLayout";
import { GameFlowManager } from "./pages/GameFlowManager";
import { WebSocketProvider } from "./context/WebSocketProvider";
import { QuizzesPage } from "./pages/QuizzesPage";
import { AuthProvider } from "./context/AuthContext";
import { Routes } from "./routes";
import { Toaster } from "sonner";

function App() {

  return (
    <AuthProvider>
      <Toaster/>
      <Routes/>
    </AuthProvider>
  );
}

export default App;
