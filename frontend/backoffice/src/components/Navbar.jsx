import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ onLogout, user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  return (
    <AppBar position="fixed" sx={{ width: "100%" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Liens de navigation */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/admin/dashboard"
            sx={{
              "&:hover": {
                backgroundColor: "rgb(255, 255, 255)",
                color: "#0373f3",
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
                backgroundColor: "rgb(255, 255, 255)",
                color: "#0373f3",
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
                backgroundColor: "rgb(255, 255, 255)",
                color: "#0373f3",
              },
            }}
          >
            Exercices
          </Button>
        </Box>

        {/* Avatar + Menu utilisateur */}
        <Box>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              border: "2px solid white",
              p: 0.5,
              transition: "all 0.25s ease",
              borderRadius: "50%",
              boxShadow: "0 0 0px rgba(0,0,0,0.2)",

              "&:hover": {
                backgroundColor: "white",
                borderColor: "primary.main",
                transform: "scale(1.08)",
                boxShadow: "0 4px 14px rgba(25,118,210,0.35)",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 42,
                height: 42,
                fontSize: 18,
                transition: "background-color 0.25s ease",

                ".MuiIconButton-root:hover &": {
                  bgcolor: "white",
                  color: "primary.main",
                  border: "2px solid primary.main",
                },
              }}
            >
              {user?.firstName?.[0] || "?"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(false)}
          >
            <MenuItem
              onClick={() => {
                navigate("/admin/profile");
                setAnchorEl(null);
              }}
            >
              Profil
            </MenuItem>

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onLogout();
              }}
            >
              Déconnexion
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Valider les props
Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.object,
};
