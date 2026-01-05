import { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function Accounts({ login }) {
  console.log('render Accounts.jsx');

  const [isFetching, setIsFetching] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('call useEffect()');

    async function fetchAccounts() {
      setIsFetching(true);

      try {
        const response = await fetch('http://localhost:8888/accountSummary', {
          headers: { 'Authorization': `Bearer ${login.token}` }
        });
        const data = await response.json();

        //console.log(JSON.stringify(data.results, null, 2));

        if (!response.ok) {
          throw new Error("Failed to fetch accounts.")
        }

        setAccounts(data.results);

        //console.log(accounts);

      } catch (error) {
        setError({ message: error.message || 'Unknown error occurred.' });
      }

      setIsFetching(false);
    }

    fetchAccounts();
  }, []);

  if (error) {
    console.error(`ERROR: {error}`);
  }

  const currencyFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });

  const columns = [
    { field: 'uuid', headerName: 'UUID', width: 300, cellClassName: 'ro' },
    { field: 'name', headerName: 'Account Name', width: 200, editable: true },
    { field: 'sortcode', headerName: 'Sort Code', width: 150, editable: true },
    { field: 'account_num', headerName: 'Account Number', width: 150, editable: true },
    {
      field: 'type', headerName: 'Type', width: 110, editable: true,
      type: 'singleSelect', valueOptions: ['DEBIT', 'CREDIT']
    },
    {
      field: 'active',
      headerName: 'Active',
      width: 85,
      editable: true,
      type: 'singleSelect',
      valueFormatter: (value) => {
        return value === true ? 'Yes' : 'No';
      },
      valueOptions: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
    {
      field: 'earliest', headerName: 'Earliest Transaction', width: 150, type: 'date', cellClassName: 'ro',
      valueGetter: (value) => {
        return new Date(value)
      }
    },
    {
      field: 'latest', headerName: 'Latest Transaction', width: 150, type: 'date', cellClassName: 'ro',
      valueGetter: (value) => {
        return new Date(value)
      }
    },
    {
      field: 'starting_balance', headerName: 'Starting Balance', width: 150,
      type: 'number', editable: true, valueFormatter: (value) => {
        if (!value) return value;
        return currencyFormatter.format(value);
      },
    },
    {
      field: 'latest_balance', headerName: 'Latest Balance', width: 150, cellClassName: 'ro',
      type: 'number', editable: true, valueFormatter: (value) => {
        if (!value) return value;
        return currencyFormatter.format(value);
      },

    },
  ];

  //const paginationModel = { page: 0, pageSize: 3 };

  const rowUpdate = (updatedRow, originalRow) => {
    console.log(updatedRow);
    return updatedRow;
  }

  const errorHandler = (error) => {
    console.error('Error handler called! ' + error);
  }

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={accounts}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
        processRowUpdate={(updatedRow, originalRow) => rowUpdate(updatedRow, originalRow)}
        onProcessRowUpdateError={errorHandler}
        pagination
        pageSizeOptions={[10, 25, 100]}
        sx={{
          '& .ro': { // read-only className
            backgroundColor: '#f5f5f5', // Light grey background
            color: '#818181',           // Muted text color
            //cursor: 'not-allowed',      // Changes the mouse pointer
          }
        }}
        density='compact'
        //checkboxSelection
        //disableMultipleRowSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.uuid}
      />
    </Paper>
  );
}
