import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function AccountLine({uuid, name, account_num}) {
  return (

      <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}



                slotProps={{
            input: {
              readOnly: true,
            },
          }}
>

        <TextField
          id="outlined-required"
          label="UUID"
          defaultValue={uuid}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue="Hello World"
        />
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />

        </Box>


  )
}