import { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  Typography,
  Button,
  Switch,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getAllUsers,
  updateRole,
  getCurrentUser,
  createUser,
  desactivate,
  deleteUser,
} from "../../api/admin";

import AddUserDialog from "./AddUser";
import AdminTable from "../../components/AdminTable";
import AdminContainer from "../../components/AdminContainer";
import AdminModal from "../../components/AdminModal";
import { useToast } from "../../components/ToastContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Toast
  const { showToast } = useToast();

  useEffect(() => {
    getCurrentUser().then((res) => setCurrentUser(res.data.user));
    getAllUsers().then((res) => setUsers(res.data));
  }, []);

  const filteredUsers = users.filter((u) => u.userId !== currentUser?.userId);

  // 🔥 Changement de rôle
  const handleRoleChange = async (id, newRole) => {
    await updateRole(id, newRole);

    setUsers((prev) =>
      prev.map((u) => (u.userId === id ? { ...u, role: newRole } : u)),
    );

    showToast("Rôle mis à jour.");
  };

  // 🔥 Activation / désactivation
  const handleToggle = async (user) => {
    const newStatus = !user.isActive;

    await desactivate(user.userId, { isActive: newStatus });

    setUsers((prev) =>
      prev.map((e) =>
        e.userId === user.userId ? { ...e, isActive: newStatus } : e,
      ),
    );

    showToast(
      newStatus
        ? "Utilisateur activé."
        : "Utilisateur désactivé.",
    );
  };

  // 🔥 Suppression
  const handleDelete = async (userId) => {
    await deleteUser(userId);

    setUsers((prev) => prev.filter((u) => u.userId !== userId));
    setConfirmDelete(null);

    showToast("Utilisateur supprimé.", "error");
  };

  return (
    <>
      <AdminContainer>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          Gestion des utilisateurs
        </Typography>

        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenAddUser(true)}
        >
          Ajouter un utilisateur
        </Button>

        <AdminTable
          rows={filteredUsers}
          columns={[
            { field: "lastName", headerName: "Nom", flex: 1 },
            { field: "firstName", headerName: "Prénom", flex: 1 },
            { field: "email", headerName: "Email", flex: 1.5 },

            {
              field: "role",
              headerName: "Rôle",
              flex: 1,
              renderCell: (params) => (
                <Select
                  size="small"
                  value={params.row.role}
                  onChange={(e) =>
                    handleRoleChange(params.row.userId, e.target.value)
                  }
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              ),
            },

            {
              field: "isActive",
              headerName: "Actif",
              flex: 0.5,
              renderCell: (params) => (
                <Switch
                  checked={params.row.isActive}
                  onChange={() => handleToggle(params.row)}
                />
              ),
            },

            {
              field: "delete",
              headerName: "Action",
              width: 120,
              renderCell: (params) => (
                <IconButton onClick={() => setConfirmDelete(params.row)}>
                  <DeleteIcon color="error" />
                </IconButton>
              ),
            },
          ]}
          getRowId={(row) => row.userId}
          height="auto"
          width="100%"
        />
      </AdminContainer>

      {/* Popup d'ajout */}
      <AddUserDialog
        open={openAddUser}
        onClose={() => setOpenAddUser(false)}
        onSubmit={async (data) => {
          const res = await createUser(data);
          setUsers((prev) => [...prev, res.data]);
          setOpenAddUser(false);

          showToast("Utilisateur ajouté !");
        }}
      />

      {/* Popup de confirmation suppression */}
      {confirmDelete && (
        <AdminModal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Supprimer un utilisateur"
          actions={
            <>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleDelete(confirmDelete.userId)}
              >
                Supprimer
              </Button>
              <Button onClick={() => setConfirmDelete(null)}>Annuler</Button>
            </>
          }
        >
          <p>
            Voulez-vous vraiment supprimer l’utilisateur :{" "}
            <strong>
              {confirmDelete?.firstName} {confirmDelete?.lastName}
            </strong>{" "}
            ?
          </p>
        </AdminModal>
      )}
    </>
  );
}
