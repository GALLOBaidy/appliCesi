import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  // 🔸 On récupère le token stocké lors de la connexion admin
  const token = localStorage.getItem("adminToken");

  // 🔸 Si aucun token → l'utilisateur n'est pas connecté → on le renvoie à l'accueil
  if (!token) {
    return <Navigate to="/" />;
  }

  let decoded;

  try {
    // 🔸 On tente de décoder le token
    // Si le token est invalide ou expiré → erreur → catch → redirection
    decoded = jwtDecode(token);
  } catch {
    // 🔸 Token corrompu / expiré → on renvoie à l'accueil
    return <Navigate to="/" />;
  }

  // 🔸 Vérification du rôle dans le token
  // Si ce n'est pas un admin → accès refusé
  if (decoded.role !== "Admin") {
    return <Navigate to="/" />;
  }

  // 🔸 Si tout est bon → on affiche la page protégée
  return children;
}

// 🔸 Validation des props pour éviter les warnings ESLint
AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
