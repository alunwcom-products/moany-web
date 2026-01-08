import { useEffect, useRef, useState } from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { v4 as uuidv4 } from 'uuid';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [newPanelOpen, setNewPanelOpen] = useState(false);
  const newPanelTriggerRef = useRef(null);

  const handleClose = () => {
    setNewPanelOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    apiRef.current.updateRows([
      {
        uuid: uuidv4(),
        name: formData.get('name'),
        account_num: formData.get('account_num'),
        sortcode: formData.get('sortcode'),
        type: "DEBIT",
        active: true,
        earliest: new Date(0),
        latest: new Date(0),
        starting_balance: 0,
        latest_balance: 0,
      },
    ]);

    // TODO persist new account before closing
    console.log('TODO: store new account');
    
    handleClose();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <Toolbar>
      <Tooltip title="Add new account">
        <ToolbarButton
          ref={newPanelTriggerRef}
          aria-describedby="new-panel"
          onClick={() => setNewPanelOpen((prev) => !prev)}
        >
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <Popper
        open={newPanelOpen}
        anchorEl={newPanelTriggerRef.current}
        placement="bottom-end"
        id="new-panel"
        onKeyDown={handleKeyDown}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 300,
              p: 2,
            }}
            elevation={8}
          >
            <Typography fontWeight="bold">Add new account</Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  size="small"
                  autoFocus
                  fullWidth
                  required
                />
                <TextField
                  label="Account Number"
                  //type="number"
                  name="account_num"
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Sort Code"
                  //type="number"
                  name="sortcode"
                  size="small"
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" fullWidth>
                  Add Account
                </Button>
              </Stack>
            </form>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>
    </Toolbar>
  );
}

export default function GridToolbarCustomPanel({ login }) {

  const [isFetching, setIsFetching] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState();

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

  const initialState = {
    columns: {
      columnVisibilityModel: {
        uuid: false,
      },
    },
    pagination: {
      paginationModel: {
        pageSize: 25
      }
    }
  }

  useEffect(() => {
    async function fetchAccounts() {
      setIsFetching(true);
      try {
        const response = await fetch('http://localhost:8888/accountSummary', {
          headers: { 'Authorization': `Bearer ${login.token}` }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch accounts.")
        }
        setAccounts(data.results);
      } catch (error) {
        setError({ message: error.message || 'Unknown error occurred.' });
      }
      setIsFetching(false);
    }
    fetchAccounts();
  }, [login]);

  const rowUpdate = (updatedRow, originalRow) => {
    console.log(`UPDATE: ${JSON.stringify(updatedRow, null, 2)}`);
    return updatedRow;
  }

  const errorHandler = (error) => {
    console.error('Error handler called! ' + error);
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={accounts}
        initialState={initialState}
        loading={isFetching}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        editMode='row'
        getRowId={(row) => row.uuid}
        density='compact'
        disableRowSelectionOnClick
        processRowUpdate={(updatedRow, originalRow) => rowUpdate(updatedRow, originalRow)}
        onProcessRowUpdateError={errorHandler}
        sx={{
          '& .ro': { // read-only className
            backgroundColor: '#f5f5f5', // Light grey background
            color: '#818181',           // Muted text color
            //cursor: 'not-allowed',      // Changes the mouse pointer
          }
        }}
      />
    </div>
  );
}