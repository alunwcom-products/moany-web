import { useEffect, useState } from 'react';
import AccountLine from './AccountLine.jsx';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function Accounts({ onSelectPlace }) {
  console.log('render Accounts.jsx');

  const [isFetching, setIsFetching] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('call useEffect()');

    async function fetchAccounts() {
      setIsFetching(true);

      try {
        const response = await fetch('http://localhost:8888/accountSummary');
        const data = await response.json();

        console.log(JSON.stringify(data.results, null, 2));

        if (!response.ok) {
          throw new Error("Failed to fetch accounts.")
        }

        const temp_acc = data.results.map((item, index) => ({
          ...item,
          id: index
        }));

        setAccounts(temp_acc);

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

  const columns = [
    { field: 'uuid', headerName: 'UUID', width: 300 },
    { field: 'name', headerName: 'Account Name', width: 200 },
    { field: 'sortcode', headerName: 'Sort Code', width: 150 },
    { field: 'account_num', headerName: 'Account Number', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'active', headerName: 'Active', width: 70 },
    { field: 'earliest', headerName: 'Earliest Transaction', width: 200 },
    { field: 'latest', headerName: 'Latest Transaction', width: 200 },
    { field: 'starting_balance', headerName: 'Starting Balance', width: 200 },
    { field: 'latest_balance', headerName: 'Latest Balance', width: 200 },
  ];



  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={accounts}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
