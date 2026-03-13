import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../api/admin";
import { useEffect, useState } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then((res) => setCurrentUser(res.data.user));
  }, []);
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
      <Navbar onLogout={handleLogout} user={currentUser} />
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
