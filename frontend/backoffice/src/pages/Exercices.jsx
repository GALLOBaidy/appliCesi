import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Switch,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  toggleExerciseStatus,
} from "../api/admin";

import ExerciseDialog from "../components/ExerciseDialog";

export default function Exercises() {
  // Liste des exercices
  const [exercises, setExercises] = useState([]);

  // Dialog d'ajout / modification
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // Chargement initial
  useEffect(() => {
    getAllGames().then((res) => setExercises(res.data));
  }, []);

  // Ouvre le dialog en mode ajout
  const handleAdd = () => {
    setEditingExercise(null);
    setOpenDialog(true);
  };

  // Ouvre le dialog en mode édition
  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setOpenDialog(true);
  };

  // Ajout ou modification
  const handleSubmit = async (data) => {
    if (editingExercise) {
      // Mise à jour
      const res = await updateGame(editingExercise.exerciceId, data);
      setExercises((prev) =>
        prev.map((e) =>
          e.exerciceId === editingExercise.exerciceId ? res.data : e
        )
      );
    } else {
      // Création
      const res = await createGame(data);
      setExercises((prev) => [...prev, res.data]);
    }

    setOpenDialog(false);
  };

  // Suppression
  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet exercice ?")) return;

    await deleteGame(id);
    setExercises((prev) => prev.filter((e) => e.exerciceId !== id));
  };

  // Activation / désactivation
  const handleToggleStatus = async (exercise) => {
    const res = await toggleExerciseStatus(exercise.exerciceId);
    setExercises((prev) =>
      prev.map((e) =>
        e.exerciceId === exercise.exerciceId ? res.data : e
      )
    );
  };

  // Colonnes du tableau
  const columns = [
    { field: "title", headerName: "Titre", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "totalDuration", headerName: "Durée totale (s)", flex: 1 },

    // Switch d'activation
    {
      field: "status",
      headerName: "Actif",
      flex: 0.5,
      renderCell: (params) => (
        <Switch
          checked={params.row.status}
          onChange={() => handleToggleStatus(params.row)}
        />
      ),
    },

    // Boutons actions
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>

          <IconButton onClick={() => handleDelete(params.row.exerciceId)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Gestion des exercices de respiration
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleAdd}>
          Ajouter un exercice
        </Button>

        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={exercises}
            columns={columns}
            getRowId={(row) => row.exerciceId}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      {/* Dialog d'ajout / modification */}
      <ExerciseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleSubmit}
        initialData={editingExercise}
      />
    </Container>
  );
}
