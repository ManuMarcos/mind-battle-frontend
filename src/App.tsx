import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { JoinPage } from "./pages/JoinPage";
import { CenteredLayout } from "./components/CenteredLayout";
import { LobbyPage } from "./pages/LobbyPage";
import { DashboardLayout } from "./components/DashBoardLayout";
import { GameFlowManager } from "./pages/GameFlowManager";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CenteredLayout><JoinPage /></CenteredLayout>}/>
        <Route path="/game" element={<GameFlowManager/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
