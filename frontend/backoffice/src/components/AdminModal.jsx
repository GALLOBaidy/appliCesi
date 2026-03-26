import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";

//  Slide doux depuis le haut
const SlideDown = forwardRef(function SlideDown(props, ref) {
  return (
    <Slide
      direction="down"
      timeout={350}
      easing="ease-out"
      ref={ref}
      {...props}
    />
  );
});

export default function AdminModal({ open, onClose, title, children, actions }) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      //  API moderne MUI 6
      slots={{ transition: SlideDown }}
      onClose={(e, reason) => {
        if (reason === "backdropClick") return; //  bloque clic extérieur
        onClose();
      }}
      slotProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",

          //  Zoom fluide SANS remplacer le Paper
          transform: open ? "scale(1)" : "scale(0.92)",
          opacity: open ? 1 : 0.8,
          transition: "transform 0.35s ease, opacity 0.35s ease",

          // Ombre premium
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 3,
        }}
      >
        {children}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>
    </Dialog>
  );
}

AdminModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node.isRequired,
};
