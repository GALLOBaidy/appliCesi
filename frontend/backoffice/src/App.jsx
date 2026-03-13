// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/route";

export default function App() {
  return (
    <BrowserRouter>
        {AppRoutes()}
    </BrowserRouter>
  );
}
