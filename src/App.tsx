import { useState } from "react";
import "./App.css";

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
