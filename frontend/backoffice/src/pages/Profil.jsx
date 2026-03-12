import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { getCurrentUser, updateProfil } from "../api/admin";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then((res) => setUser(res.data.user));
  }, []);

  if (!user) return null;
  const sanitizeUser = (user) => {
    const updated = { ...user };

    delete updated.role;
    delete updated.registrationDate;
    delete updated.password;

    return updated;
  };

  const handlePassword = (updated) => {
    if (!updated.newPassword && !updated.confirmPassword) return updated;

    if (updated.newPassword !== updated.confirmPassword) {
      throw new Error("PASSWORD_MISMATCH");
    }

    updated.password = updated.newPassword;

    delete updated.newPassword;
    delete updated.confirmPassword;

    return updated;
  };

  const normalizeNumbers = (updated) => {
    updated.postalCode =
      updated.postalCode !== "" && updated.postalCode !== null
        ? Number(updated.postalCode)
        : null;

    const sn = Number(updated.streetNumber);
    updated.streetNumber = Number.isNaN(sn) ? null : sn;

    return updated;
  };

  const normalizeBirthDay = (updated) => {
    if (!updated.birthDay) return updated;

    const d =
      updated.birthDay instanceof Date
        ? updated.birthDay
        : new Date(updated.birthDay);

    if (Number.isNaN(d.getTime())) {
      delete updated.birthDay;
    } else {
      updated.birthDay = d;
    }

    return updated;
  };

  const removeUndefined = (updated) => {
    Object.keys(updated).forEach((k) => {
      if (updated[k] === undefined) delete updated[k];
    });
    return updated;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let updated = sanitizeUser(user);

      try {
        updated = handlePassword(updated);
      } catch (err) {
        if (err.message === "PASSWORD_MISMATCH") {
          alert("Les mots de passe ne correspondent pas.");
          return;
        }
      }

      updated = normalizeNumbers(updated);
      updated = normalizeBirthDay(updated);
      updated = removeUndefined(updated);

      try {
        await updateProfil(updated);
        alert("Profil mis à jour !");
      } catch (e) {
        if (e.response?.data?.error) {
          alert(e.response.data.error);
        } else {
          alert("Erreur lors de la mise à jour");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user.registrationDate
    ? new Date(user.registrationDate).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,247,250,0.98))",
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 64,
              height: 64,
              fontSize: 24,
            }}
          >
            {user.firstName?.[0] ?? "U"}
            {user.lastName?.[0] ?? ""}
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Membre depuis {memberSince}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* SECTION CIVILITÉ */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Civilité
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Prénom"
              value={user.firstName ?? ""}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nom"
              value={user.lastName ?? ""}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Genre"
              select
              value={user.gender ?? ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="Homme">Homme</MenuItem>
              <MenuItem value="Femme">Femme</MenuItem>
              <MenuItem value="Autre">Autre</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date de naissance"
              type="date"
              slotProps={{ label: { shrink: true } }}
              value={
                user.birthDay
                  ? new Date(user.birthDay).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setUser({
                  ...user,
                  birthDay: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Pays"
              value={user.country ?? ""}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* SECTION ADRESSE */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Adresse
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Numéro"
              type="number"
              value={user.streetNumber ?? ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  streetNumber:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Rue"
              value={user.streetName ?? ""}
              onChange={(e) => setUser({ ...user, streetName: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ville"
              value={user.city ?? ""}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Code Postal"
              type="number"
              value={user.postalCode ?? ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  postalCode:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Complément"
              value={user.addressComplement ?? ""}
              onChange={(e) =>
                setUser({ ...user, addressComplement: e.target.value })
              }
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* SECTION CONNEXION */}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Connexion
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Login"
              value={user.login ?? ""}
              onChange={(e) => setUser({ ...user, login: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={user.email ?? ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Nouveau mot de passe"
              value={user.newPassword ?? ""}
              onChange={(e) =>
                setUser({ ...user, newPassword: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Confirmer le mot de passe"
              value={user.confirmPassword ?? ""}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
          </Grid>
        </Grid>

        {/* BOUTON */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 2,
              boxShadow: "0 6px 18px rgba(25,118,210,0.18)",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {loading ? "En cours..." : "Mettre à jour"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
