import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
