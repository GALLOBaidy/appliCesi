// src/routes.jsx
import { Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/user/Users";
import Layout from "../pages/Layout";
import Exercises from "../pages/exercice/Exercices";
import Profile from "../pages/Profil";
import ContentPage from "../pages/content/Content";
import AdminRoute from "../components/AdminRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="games" element={<Exercises />} />
        <Route path="profile" element={<Profile />} />
        <Route path="content" element={<ContentPage />} />
      </Route>

    </Routes>
  );
}
