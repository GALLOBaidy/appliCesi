import PropTypes from "prop-types";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar({ onLogout }) {
  return (
    <AppBar position="fixed" sx={{ width: "100%" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/admin/dashboard"
            sx={{
              "&:hover": {
                backgroundColor: "rgb(255, 255, 255)", color: "#0373f3",
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin/users"
            sx={{
              "&:hover": {
                backgroundColor: "rgb(255, 255, 255)", color: "#0373f3",
              },
            }}
          >
            Utilisateurs
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/admin/games"
            sx={{
              "&:hover": {
                backgroundColor: "rgb(255, 255, 255)", color: "#0373f3",
              },
            }}
          >
            Exercices
          </Button>
        </Box>

        <Button variant="contained" color="error" onClick={onLogout}>
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
}

// Valider les props
Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
