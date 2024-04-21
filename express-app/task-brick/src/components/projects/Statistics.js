import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { issuesData, issuesGrid } from '../../data/dummy'; // Use the updated imports
import useThemeSwitcher from '../themes/useThemeSwitcher'; 
import Header from './Header';

const Statistics = () => {

  const { currentTheme } = useThemeSwitcher();  // Access the current theme
  // Convert your data to a format that's compatible with DataGrid
  const rows = issuesData.map((data, index) => ({ id: index, ...data }));
  const columns = issuesGrid.map((column) => ({
    field: column.field,
    headerName: column.headerText,
    width: column.width,
    editable: !column.isPrimaryKey, // Use not-operator for clarity
    renderCell: column.template, // Use renderCell for custom cell rendering
  }));

  return (
    <Box
      sx={{
        margin: '2 md:10 mt-24 p-2 md:p-10',
        bgcolor: 'background.paper', // Use theme color
        borderRadius: '3xl',
        backdropFilterColor: 'rgba(0, 0, 0, 0.5)',
        backgroundColor: currentTheme.backgroundColor, // Use theme color
      }}
    >
      <Header category="Page" title="Issues" />
      <Paper elevation={3} sx={{ height: 600, width: '100%', backgroundColor: currentTheme.bgColor, color: currentTheme.textColor, }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            borderColor: currentTheme.borderColor,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: currentTheme.tableHeaderBgColor,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: currentTheme.borderBottom,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: currentTheme.tableArrowsColor,
            },
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              color: currentTheme.textColor,
              '&:hover': {
                backgroundColor: currentTheme.tableArrowsColor,
                color: currentTheme.textColor,
                '&.MuiDataGrid-cell': {
                  color: currentTheme.textColor,
                },
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Statistics;