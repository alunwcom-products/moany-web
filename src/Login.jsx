import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Login({ username, password }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <Box sx={{ tp: 2, pb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          component="form"
          noValidate
          autoComplete="off"
        >

          <TextField
            label="Username"
            variant="outlined"
            size="small" // Ensures a compact height

          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            size="small" // Matches the username field

          />

          <Button
            variant="outlined" // Changes the style to a simple outline
            sx={{
              height: '40px',   // Matches the 'small' TextField height exactly
              px: 3,            // Adds horizontal padding inside the button
              borderWidth: '1px',
              '&:hover': {
                borderWidth: '1px', // Prevents the border from thickening on hover
              }
            }}
            onClick={() => console.log('Submit!')}
          >Login</Button>

        </Stack>
      </Box>
    </>
  )
}