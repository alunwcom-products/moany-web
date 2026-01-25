import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { authenticate } from "./api/accounts";

export default function Login({ login, onLoginChange, setError }) {

  const BLANK_CREDENTIALS = {
    username: '', password: ''
  };

  // 1. Setup state to store form values
  const [credentials, setCredentials] = useState(BLANK_CREDENTIALS);

  // 2. Update state when user types
  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. The function that handles the login logic
  const handleLogin = async (event) => {
    console.log('Login Submitted.');
    event.preventDefault(); // Prevents the page from refreshing

    // check both username and password are present
    if (credentials.username.length === 0 || credentials.password.length === 0) {
      setError('Submit a username and password');
    }

    try {
      const token = await authenticate(credentials.username, credentials.password);
      console.debug('AUTH SUCCESS: ', token);
      onLoginChange({ username: credentials.username, token: token })

    } catch (error) {
      setError('Authentication error');
      onLoginChange({});
    }

    setCredentials((prevCredentials) => {
      prevCredentials.password = '';
      return prevCredentials;
    });
  };

  const logout = () => {
    console.log('Logout.');
    setCredentials({ username: '', password: '' })
    onLoginChange({});
  }

  const logoutLabel = `Logout ${login.username}`;

  if (login.token) {
    return (
      <Box sx={{ tp: 2, pb: 2 }}>
        <Chip label={logoutLabel} onClick={logout} />
      </Box>
    )
  }

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
          onSubmit={handleLogin} // Triggers on Button click OR Enter key
        >

          <TextField
            name="username" // Matches state key
            value={credentials.username}
            onChange={handleTextInputChange}
            label="Username"
            variant="outlined"
            size="small" // Ensures a compact height
            sx={{ width: '200px' }}
            slotProps={{
              htmlInput: {
                autoCapitalize: 'none',
                autoCorrect: 'off',
                spellCheck: 'false',
              },
            }}
          />

          <TextField
            name="password" // Matches state key
            label="Password"
            type="password"
            variant="outlined"
            size="small" // Matches the username field
            value={credentials.password}
            onChange={handleTextInputChange}
            sx={{ width: '200px' }}
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
            type="submit" // Crucial for Enter key support
          >Login</Button>
        </Stack>
      </Box>
    </>
  )
}