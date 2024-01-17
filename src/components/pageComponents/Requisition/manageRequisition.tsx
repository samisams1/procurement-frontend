import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
const ManageRequisitionComponent: React.FC = () => {
  const data: Array<[string, number, string, number, string, string]> = [
    ['1', 5, 'samisams', 5, 'Approved', 'Request Detail'],
    ['2', 5, 'samisams', 5, 'Approved', 'Request Detail'],
    ['3', 5, 'samisams', 5, 'Approved', 'Request Detail'],
  ];

  const columns: MUIDataTableColumn[] = [
    { name: 'SN' },
    { name: 'Requestion No' },
    { name: 'Requester' },
    { name: 'Requestion Date' },
    { name: 'Status' },
    {
      name: 'Action',
      options: {
        customBodyRenderLite: (dataIndex) => {
          return <a href="#">{data[dataIndex][5]}</a>;
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    selectableRows: 'none',
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: '20px' }}>
          <Typography variant="h3" align="center" style={{ color: '#3c44b1' }}>
            MANAGE REQUISITION
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <MUIDataTable
                title={''}
                data={data}
                columns={columns}
                options={options}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ManageRequisitionComponent;