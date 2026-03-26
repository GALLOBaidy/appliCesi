import PropTypes from "prop-types";
import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  //  Empêche la recréation de l'objet à chaque render
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    
    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  const getToastColor = (type) => {
    if (type === "success") return "#4caf50";
    if (type === "error") return "#f44336";
    if (type === "warning") return "#ff9800";
    return "#2196f3"; // info par défaut
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            padding: "14px 20px",
            borderRadius: "8px",
            color: "white",
            background: getToastColor(toast.type),
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            fontSize: "15px",
            fontWeight: 500,
            animation: "toast-slide 0.3s ease",
            zIndex: 9999,
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Animation */}
      <style>
        {`
          @keyframes toast-slide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useToast() {
  return useContext(ToastContext);
}
