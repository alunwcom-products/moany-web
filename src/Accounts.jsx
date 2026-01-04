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
    { field: 'name', headerName: 'Account Name', width: 200, editable: true },
    { field: 'sortcode', headerName: 'Sort Code', width: 150, editable: true },
    { field: 'account_num', headerName: 'Account Number', width: 150, editable: true },
    { field: 'type', headerName: 'Type', width: 110, editable: true,
      type: 'singleSelect', valueOptions: ['DEBIT', 'CREDIT']
    },
    { field: 'active', headerName: 'Active', width: 85, editable: true,
      type: 'singleSelect', valueOptions: [true, false]
    },
    { field: 'earliest', headerName: 'Earliest Transaction', width: 200 },
    { field: 'latest', headerName: 'Latest Transaction', width: 200 },
    { field: 'starting_balance', headerName: 'Starting Balance', width: 200, editable: true },
    { field: 'latest_balance', headerName: 'Latest Balance', width: 200 },
  ];



  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={accounts}
        columns={columns}
        //initialState={{ pagination: { paginationModel } }}
        pagination
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
        sx={{ border: 0 }}
        density='compact'
        disableMultipleRowSelection={true}
      />
    </Paper>
  );
}
