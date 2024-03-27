import { createTheme } from "@mui/material";
import { MUIDataTableOptions } from 'mui-datatables';

export const tableTheme = createTheme({
  components: {
    MUIDataTableHeadCell: {
      styleOverrides: {
        root: {
          backgroundColor: '#00b0ad',
          color: 'white',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
  },
});

export const tableOptions: MUIDataTableOptions = {
  filter: true,
  download: false,
  print: false,
  search: true,
  selectableRows: 'none',
  responsive: 'standard',
  viewColumns: true,
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 25, 50],
};