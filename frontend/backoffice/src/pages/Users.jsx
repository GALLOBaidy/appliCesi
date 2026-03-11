import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  MenuItem,
  Select,
  Box,
  Typography,
  Container,
  Paper,
  Button,
} from "@mui/material";
import { getAllUsers, updateRole, getCurrentUser, createUser } from "../api/admin";
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
  ];

  return (
    <>
      {/* Conteneur principal */}
      <Container
        maxWidth="md"
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          Gestion des utilisateurs
        </Typography>

        {/* Carte contenant le tableau */}
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 800,
            mx: "auto",
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          {/* Bouton pour ouvrir la popup d'ajout */}
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setOpenAddUser(true)}
          >
            Ajouter un utilisateur
          </Button>

          {/* Tableau des utilisateurs */}
          <Box sx={{ height: 500 }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.userId}
              disableRowSelectionOnClick
            />
          </Box>
        </Paper>
      </Container>

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
