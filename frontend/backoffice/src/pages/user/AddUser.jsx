import PropTypes from "prop-types";
import { useState } from "react";
import { TextField, Button, MenuItem, Select, Box } from "@mui/material";
import AdminModal from "../../components/AdminModal";

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
      setError("");
      await onSubmit(form);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        login: "",
        password: "",
        role: "User",
      });

      onClose();
    } catch (e) {
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Erreur lors de la création de l'utilisateur");
      }
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Ajouter un utilisateur"
      actions={
        <>
          <Button variant="contained" onClick={handleSubmit} disabled={!!error}>
            Ajouter
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </>
      }
    >
      {error && <Box sx={{ color: "red", fontSize: 14 }}>{error}</Box>}

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

      <Select fullWidth name="role" value={form.role} onChange={handleChange}>
        <MenuItem value="User">User</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
      </Select>
    </AdminModal>
  );
}

AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
