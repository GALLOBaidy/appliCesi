import PropTypes from "prop-types";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  Box,
} from "@mui/material";

export default function AddUserDialog({ open, onClose, onSubmit }) {
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setError(""); // reset erreur
      await onSubmit(form); // on attend la réponse backend
      // Si ok reset formulaire
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        login: "",
        password: "",
        role: "User",
      });

      onClose(); // fermer la popup
    } catch (e) {
      // Récupérer le message du backend
      if (e.response.data.error) {
        setError(e.response.data.error);
      } else {
        setError("Erreur lors de la création de l'utilisateur");
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Ajouter un utilisateur</DialogTitle>

      {error && <Box sx={{ color: "red", fontSize: 14 }}>{error}</Box>}

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField name="firstName" label="Prénom" onChange={handleChange} />
        <TextField name="lastName" label="Nom" onChange={handleChange} />
        <TextField name="email" label="Email" onChange={handleChange} />
        <TextField name="login" label="Login" onChange={handleChange} />
        <TextField
          name="password"
          label="Mot de passe"
          type="password"
          onChange={handleChange}
        />

        <Box>
          <Select
            fullWidth
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} disabled={!!error}>
          Ajouter
        </Button>
        <Button onClick={onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}

// Validation des props
AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
