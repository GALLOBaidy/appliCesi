import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  MenuItem,
  Select,
  Box,
  Typography,
  Paper,
  Switch,
  Button,
} from "@mui/material";
import {
  getAllUsers,
  updateRole,
  getCurrentUser,
  createUser,
  desactivate,
} from "../api/admin";
import AddUserDialog from "../components/AddUser";

export default function Users() {
  // Liste des utilisateurs
  const [users, setUsers] = useState([]);

  // Utilisateur actuellement connecté (pour empêcher qu'il retire son rôle admin)
  const [currentUser, setCurrentUser] = useState(null);

  // État d'ouverture de la popup "Ajouter un utilisateur"
  const [openAddUser, setOpenAddUser] = useState(false);

  // Chargement initial : utilisateur connecté + liste des utilisateurs
  useEffect(() => {
    getCurrentUser().then((res) => setCurrentUser(res.data.user));
    getAllUsers().then((res) => setUsers(res.data));
  }, []);

  // Changement de rôle d'un utilisateur
  const handleRoleChange = async (id, newRole) => {
    // Empêche un admin de retirer son propre rôle
    if (currentUser && currentUser.userId === id && newRole !== "Admin") {
      alert("Tu ne peux pas retirer ton propre rôle Admin.");
      return;
    }

    // Mise à jour côté serveur
    await updateRole(id, newRole);

    // Mise à jour locale de la liste
    setUsers((prev) =>
      prev.map((u) => (u.userId === id ? { ...u, role: newRole } : u)),
    );
  };

  // Désactivation d'un compte
  const handleToggle = async (user) => {
    const newStatus = !user.isActive;
    // Empêcher de désactiver son compte
    if (
      currentUser &&
      currentUser.userId === user.userId &&
      newStatus === false
    ) {
      alert("Tune peux pas désctiver ton compte");
      return;
    }
    await desactivate(user.userId, { isActive: newStatus });
    setUsers((prev) =>
      prev.map((e) =>
        e.userId === user.userId ? { ...e, isActive: newStatus } : e,
      ),
    );
  };

  // Colonnes du tableau
  const columns = [
    { field: "lastName", headerName: "Nom", flex: 1 },
    { field: "firstName", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },

    // Colonne rôle avec Select
    {
      field: "role",
      headerName: "Rôle",
      flex: 1,
      renderCell: (params) => {
        // Empêche l'utilisateur connecté de changer son propre rôle admin
        const isSelf =
          currentUser &&
          currentUser.userId === params.row.userId &&
          params.row.role === "Admin";

        return (
          <Select
            size="small"
            value={params.row.role}
            disabled={isSelf}
            onChange={(e) =>
              handleRoleChange(params.row.userId, e.target.value)
            }
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        );
      },
    },
    // Switch d'activation
    {
      field: "isActive",
      headerName: "Actif",
      flex: 0.5,
      renderCell: (params) => {
        // Empêcher de désactiver son compte
        const isSelf =
          currentUser &&
          currentUser.userId === params.row.userId &&
          params.row.role === "Admin";
        return (
          <Switch
            checked={params.row.isActive}
            onChange={() => handleToggle(params.row)}
            disabled={isSelf}
          />
        );
      },
    },
  ];

  return (
    <>
      {/* Conteneur principal */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center", // centre tout
          mt: 6,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1400px", // largeur max
            minWidth: "1200px", // 🔥 largeur minimum pour éviter le tableau mini
            px: 3, // espace gauche/droite
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
            Gestion des utilisateurs
          </Typography>

          <Paper
            elevation={4}
            sx={{
              width: "100%",
              p: 3,
              borderRadius: 3,
              backgroundColor: "#fff",
              boxSizing: "border-box",
            }}
          >
            <Button
              variant="contained"
              sx={{ mb: 2 }}
              onClick={() => setOpenAddUser(true)}
            >
              Ajouter un utilisateur
            </Button>

            <Box
              sx={{
                height: 500,
                width: "100%",
                overflowX: "hidden", // 🔥 jamais de scroll horizontal
                boxSizing: "border-box",
              }}
            >
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row.userId}
                disableRowSelectionOnClick
                columnBuffer={0}
                columnThreshold={0}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      {/* Popup d'ajout d'utilisateur */}
      <AddUserDialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        onSubmit={async (data) => {
          const res = await createUser(data); // Création côté serveur
          setUsers((prev) => [...prev, res.data]); // Ajout local
          setOpenAddUser(false);
        }}
      />
    </>
  );
}
