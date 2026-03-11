import { Box, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../api/admin";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Toolbar />
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
