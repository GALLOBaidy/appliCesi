import { useState } from "react";
import { loginAdmin } from "../api/admin";
import { useNavigate } from "react-router-dom";

// 🧱 Import MUI
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Pour afficher un loader
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginAdmin(login, password);

      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      if (err.message === "NOT_ADMIN") {
        alert("Accès refusé : vous n'êtes pas administrateur");
      } else {
        alert("Identifiants invalides");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72 10%, #2a5298 100%)", // joli fond
        padding: "0 32px 0 32px",
      }}
    >
      {/* 🧾 Carte centrale */}
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={3}
          color="primary"
        >
          Connexion
        </Typography>

        {/* 📝 Formulaire */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Login ou Email"
            fullWidth
            margin="normal"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 🔘 Bouton avec loader */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={26} color="inherit" />
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
