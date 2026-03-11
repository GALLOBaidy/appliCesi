import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { 
  getTotalUsers, 
  getTotalRuns, 
  getRunsByDay, 
  getFeelingsStats 
} from "../api/admin.js";

export default function Dashboard() {
  // Stocke toutes les statistiques
  const [stats, setStats] = useState(null);

  // Indique si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);

  // Chargement des stats au montage du composant
  useEffect(() => {
    (async () => {
      try {
        // Appels API en parallèle pour optimiser la vitesse
        const [users, runs, byDay, feelings] = await Promise.all([
          getTotalUsers(),
          getTotalRuns(),
          getRunsByDay(),
          getFeelingsStats(),
        ]);

        // Mise en forme des données
        setStats({
          totalUsers: users.data.totalUsers,
          totalRuns: runs.data.totalRuns,
          byDay: byDay.data,
          feelings: feelings.data,
        });
      } catch (err) {
        console.error("Erreur Dashboard :", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <Box sx={{ p: 4 }}>
      {/* Titre principal */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Dashboard Admin
      </Typography>

      {/* Grille des statistiques principales */}
      <Grid container spacing={3} justifyContent="center">
        
        {/* Carte 1 : Utilisateurs */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "#1976d2",
              color: "white",
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.totalUsers}
            </Typography>
            <Typography>Utilisateurs</Typography>
          </Paper>
        </Grid>

        {/* Carte 2 : Exercices */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "#2e7d32",
              color: "white",
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.totalRuns}
            </Typography>
            <Typography>Exercices</Typography>
          </Paper>
        </Grid>

        {/* Carte 3 : Jours actifs */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "#f57c00",
              color: "white",
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.byDay.length}
            </Typography>
            <Typography>Jours actifs</Typography>
          </Paper>
        </Grid>

        {/* Carte 4 : Feelings */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              backgroundColor: "#9c27b0",
              color: "white",
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              {stats.feelings.length}
            </Typography>
            <Typography>Feelings</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Section détails */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Détails
        </Typography>

        <Grid container spacing={3}>
          
          {/* Détail : Exercices par jour */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Exercices par jour
              </Typography>
              <Typography>{stats.byDay.length} jours enregistrés</Typography>
            </Paper>
          </Grid>

          {/* Détail : Feelings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Feelings enregistrés
              </Typography>

              <ul>
                {stats.feelings.map((f) => (
                  <li key={f.feeling}>
                    {f.feeling} : {f.count}
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}
