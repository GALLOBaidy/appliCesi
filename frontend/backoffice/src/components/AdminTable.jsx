import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";

export default function AdminTable({
  rows,
  columns,
  loading = false,
  getRowId,
  height = 500,
  width = 1000,
}) {
  return (
    <Box sx={{ height, width }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={getRowId}
        disableRowSelectionOnClick
        autoHeight={height == "auto"}
      />
    </Box>
  );
}

AdminTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  getRowId: PropTypes.func.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
