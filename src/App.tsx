import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CenteredLayout } from "./components/CenteredLayout";
import { LobbyPage } from "./pages/LobbyPage";
import { DashboardLayout } from "./components/DashBoardLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CenteredLayout><LandingPage /></CenteredLayout>}/>
        <Route path="/lobby/:sessionId" element={<DashboardLayout><LobbyPage /></DashboardLayout>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
