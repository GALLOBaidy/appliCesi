import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function ExerciseDialog({ open, onClose, onSubmit, initialData }) {
  // Formulaire local (pré-rempli si on modifie un exercice)
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    totalDuration: "",
    inhalationDuration: "",
    holdDuration: "",
    exhalationDuration: "",
    cycle: "",
  });

  // Remplit le formulaire si on édite un exercice
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      // Réinitialise le formulaire si on ajoute un nouvel exercice
      setForm({
        title: "",
        description: "",
        type: "",
        totalDuration: "",
        inhalationDuration: "",
        holdDuration: "",
        exhalationDuration: "",
        cycle: "",
      });
    }
  }, [initialData]);

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envoi du formulaire
  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Titre dynamique : Ajout ou Modification */}
      <DialogTitle>
        {initialData ? "Modifier l'exercice" : "Ajouter un exercice"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Titre */}
          <Grid item xs={12}>
            <TextField
              label="Titre"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          {/* Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Type"
              name="type"
              fullWidth
              value={form.type}
              onChange={handleChange}
            >
              <MenuItem value="relaxation">Relaxation</MenuItem>
              <MenuItem value="equilibre">Équilibre</MenuItem>
              <MenuItem value="energie">Énergie</MenuItem>
            </TextField>
          </Grid>

          {/* Durée totale */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Durée totale (sec)"
              name="totalDuration"
              type="number"
              fullWidth
              value={form.totalDuration}
              onChange={handleChange}
            />
          </Grid>

          {/* Durées des phases */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Inspiration (sec)"
              name="inhalationDuration"
              type="number"
              fullWidth
              value={form.inhalationDuration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Apnée (sec)"
              name="holdDuration"
              type="number"
              fullWidth
              value={form.holdDuration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Expiration (sec)"
              name="exhalationDuration"
              type="number"
              fullWidth
              value={form.exhalationDuration}
              onChange={handleChange}
            />
          </Grid>

          {/* Nombre de cycles */}
          <Grid item xs={12}>
            <TextField
              label="Nombre de cycles"
              name="cycle"
              type="number"
              fullWidth
              value={form.cycle}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Boutons d'action */}
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
