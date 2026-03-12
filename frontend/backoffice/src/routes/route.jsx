// src/routes.jsx
import { Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Layout from "../pages/Layout";
import Exercises from "../pages/Exercices";
import Profile from "../pages/Profil";
import AdminRoute from "../components/AdminRoutes";

export default function AppRoutes() {
  return (
    <>
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
      </Route>
    </>
  );
}
