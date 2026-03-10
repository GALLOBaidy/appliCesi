import { useEffect, useState } from "react";
import { 
  getTotalUsers, 
  getTotalRuns, 
  getRunsByDay, 
  getFeelingsStats 
} from "../api/admin.js";
import "./Dashboard.css"; 

export default function Dashboard() {
  // Stockage des stats
  const [stats, setStats] = useState(null);

  // Chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Appels API en parallèle
        const [users, runs, byDay, feelings] = await Promise.all([
          getTotalUsers(),
          getTotalRuns(),
          getRunsByDay(),
          getFeelingsStats(),
        ]);

        // Mise à jour du state
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
    <div className="dashboard-container">
      <h1>Dashboard Admin</h1>

      <div className="stats-grid">
        {/* Cercle 1 */}
        <div className="stat-circle users">
          <span className="stat-number">{stats.totalUsers}</span>
          <span className="stat-label">Utilisateurs</span>
        </div>

        {/* Cercle 2 */}
        <div className="stat-circle runs">
          <span className="stat-number">{stats.totalRuns}</span>
          <span className="stat-label">Runs</span>
        </div>

        {/* Tu peux ajouter d'autres cercles ici */}
      </div>
    </div>
  );
}
