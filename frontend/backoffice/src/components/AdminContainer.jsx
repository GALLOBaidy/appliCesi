import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";

export default function AdminContainer({ children }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",   
          minWidth: "1200px",  
          px: 3,
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
}

AdminContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
