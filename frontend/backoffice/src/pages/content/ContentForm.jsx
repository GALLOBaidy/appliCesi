import PropTypes from "prop-types";
import { useState } from "react";
import { createContent, updateContent } from "../../api/admin";
import { TextField, Button, MenuItem, Box } from "@mui/material";

// Modal réutilisable
import AdminModal from "../../components/AdminModal";

const categories = [
  "respiration",
  "stress",
  "anxiete",
  "sommeil",
  "emotion",
  "bien-etre",
  "concentration",
];

export default function ContentForm({ initialData, onSuccess, open, onClose }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      body: "",
      category: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (initialData) {
      await updateContent(initialData.id, form);
    } else {
      await createContent(form);
    }
    onSuccess();
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={initialData ? "Modifier le contenu" : "Créer un contenu"}
      actions={
        <>
          <Button variant="contained" onClick={handleSubmit}>
            {initialData ? "Mettre à jour" : "Créer"}
          </Button>
          <Button onClick={onClose}>Annuler</Button>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Titre"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Catégorie"
          name="category"
          select
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Contenu"
          name="body"
          value={form.body}
          onChange={handleChange}
          multiline
          rows={6}
        />
      </Box>
    </AdminModal>
  );
}

ContentForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    category: PropTypes.string,
    isActive: PropTypes.bool,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    createdBy: PropTypes.number,
  }),
  onSuccess: PropTypes.func.isRequired,

  // Ajout pour fonctionner avec AdminModal
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
