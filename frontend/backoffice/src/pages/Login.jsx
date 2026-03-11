import { useState } from "react";
import { loginAdmin } from "../api/admin";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginAdmin(login, password);

      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.message === "NOT_ADMIN") {
        alert("Accès refusé : vous n'êtes pas administrateur");
        return;
      }

      alert("Identifiants invalides");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Admin Login</h1>
      <input
        placeholder="Login ou Email"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Se connecter</button>
    </form>
  );
}
