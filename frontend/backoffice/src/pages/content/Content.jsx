import { useEffect, useState } from "react";
import { getAllContent, deleteContent, toggleContent } from "../../api/admin";
import ContentForm from "./ContentForm";
import {
  Button,
  Switch,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import AdminTable from "../../components/AdminTable";
import AdminContainer from "../../components/AdminContainer";
import AdminModal from "../../components/AdminModal";
import { useToast } from "../../components/ToastContext";

export default function ContentPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🔥 Toast
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllContent();
    setContents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (id) => {
    const res = await toggleContent(id);
    setContents((prev) => prev.map((c) => (c.id === id ? res.data : c)));

    showToast(
      res.data.isActive ? "Contenu activé." : "Contenu désactivé.",
      res.data.isActive ? "success" : "warning"
    );
  };

  const handleDelete = async (id) => {
    await deleteContent(id);
    setContents((prev) => prev.filter((c) => c.id !== id));

    showToast("Contenu supprimé.", "error");
  };

  const handleEdit = (row) => {
    setSelected(row);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpenForm(true);
  };

  const columns = [
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "category", headerName: "Catégorie", width: 150 },
    {
      field: "isActive",
      headerName: "Actif",
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.row.isActive}
          onChange={() => handleToggle(params.row.id)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setConfirmDelete(params.row)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <AdminContainer>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Contenus santé mentale
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleCreate}>
        Ajouter un contenu
      </Button>

      <AdminTable
        rows={contents}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        height="auto"
        width="100%"
      />

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selected ? "Modifier le contenu" : "Créer un contenu"}
        </DialogTitle>
        <DialogContent>
          <ContentForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            initialData={selected}
            onSuccess={() => {
              setOpenForm(false);
              fetchData();
              showToast(
                selected
                  ? "Contenu mis à jour."
                  : "Contenu créé avec succès."
              );
            }}
          />
        </DialogContent>
      </Dialog>

      {confirmDelete && (
        <AdminModal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Confirmer la suppression"
          actions={
            <>
              <Button
                color="error"
                variant="contained"
                onClick={async () => {
                  await handleDelete(confirmDelete.id);
                  setContents((prev) =>
                    prev.filter((c) => c.id !== confirmDelete.id)
                  );
                  setConfirmDelete(null);
                }}
              >
                Supprimer
              </Button>
              <Button onClick={() => setConfirmDelete(null)}>Annuler</Button>
            </>
          }
        >
          <p>
            Voulez-vous vraiment supprimer le contenu : <strong> {confirmDelete?.title}</strong> ?
          </p>
        </AdminModal>
      )}
    </AdminContainer>
  );
}
