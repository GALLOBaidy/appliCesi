// src/App.jsx
import { BrowserRouter, Routes } from "react-router-dom";
import AppRoutes from "./routes/route";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {AppRoutes()}
      </Routes>
    </BrowserRouter>
  );
}
