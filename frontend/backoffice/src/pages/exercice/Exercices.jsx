import { useEffect, useState } from "react";
import { Typography, Button, Switch, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  toggleExerciseStatus,
} from "../../api/admin";

import ExerciseDialog from "./ExerciseDialog";

import AdminTable from "../../components/AdminTable";
import AdminContainer from "../../components/AdminContainer";
import AdminModal from "../../components/AdminModal";
import { useToast } from "../../components/ToastContext";

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);

  //  Toast
  const { showToast } = useToast();

  useEffect(() => {
    getAllGames().then((res) => setExercises(res.data));
  }, []);

  const handleAdd = () => {
    setEditingExercise(null);
    setOpenDialog(true);
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setOpenDialog(true);
  };

  const handleSubmit = async (data) => {
    if (editingExercise) {
      const res = await updateGame(editingExercise.exerciceId, data);
      setExercises((prev) =>
        prev.map((e) =>
          e.exerciceId === editingExercise.exerciceId ? res.data : e,
        ),
      );

      showToast("Exercice mis à jour.");
    } else {
      const res = await createGame(data);
      setExercises((prev) => [...prev, res.data]);

      showToast("Exercice ajouté !");
    }

    setOpenDialog(false);
  };

  const handleDelete = async (id) => {
    await deleteGame(id);
    setExercises((prev) => prev.filter((e) => e.exerciceId !== id));
    setConfirmDelete(null);

    showToast("Exercice supprimé.", "error");
  };

  const handleToggleStatus = async (exercise) => {
    const res = await toggleExerciseStatus(exercise.exerciceId);
    setExercises((prev) =>
      prev.map((e) => (e.exerciceId === exercise.exerciceId ? res.data : e)),
    );

    showToast(
      res.data.status ? "Exercice activé." : "Exercice désactivé.",
      res.data.status ? "success" : "warning",
    );
  };

  const columns = [
    { field: "title", headerName: "Titre", flex: 3 },
    { field: "description", headerName: "Description", flex: 5 },
    { field: "type", headerName: "Type", flex: 2 },
    { field: "totalDuration", headerName: "Durée totale (s)", flex: 1 },

    {
      field: "status",
      headerName: "Actif",
      flex: 1.5,
      renderCell: (params) => (
        <Switch
          checked={params.row.status}
          onChange={() => handleToggleStatus(params.row)}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
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
        Gestion des exercices de respiration
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
        Ajouter un exercice
      </Button>

      <AdminTable
        rows={exercises}
        columns={columns}
        getRowId={(row) => row.exerciceId}
        height="auto"
        width="100%"
      />

      <ExerciseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        initialData={editingExercise}
      />

      {confirmDelete && (
        <AdminModal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Supprimer un exercice"
          actions={
            <>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleDelete(confirmDelete.exerciceId)}
              >
                Supprimer
              </Button>
              <Button onClick={() => setConfirmDelete(null)}>Annuler</Button>
            </>
          }
        >
          <p>
            Voulez-vous vraiment supprimer l’exercice : <strong> {confirmDelete?.title}</strong> ?
          </p>
        </AdminModal>
      )}
    </AdminContainer>
  );
}
