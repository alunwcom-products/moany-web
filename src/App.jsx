import './App.css'
import Login from './Login'
import { useState } from 'react'
import AccountsDataGrid from './AccountsDataGrid';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Snackbar } from '@mui/material';

function App() {

  const [error, setError] = useState(false); // pass as prop to children - set message when set

  const [login, setLogin] = useState(() => {
    const saved = sessionStorage.getItem('login');
    console.log('got saved: ', saved);
    return saved !== null ? JSON.parse(saved) : {};
  });

  const handleLoginChange = (newLogin) => {
    console.debug('Login change: ', newLogin);
    setLogin(() => {
      console.log('setting saved: ', JSON.stringify(newLogin));
      sessionStorage.setItem('login', JSON.stringify(newLogin));
      return newLogin
    });
    //console.log('New login state: ', login);
  }

  const handleErrorClose = () => {
    console.debug('Error closed.');
    setError(false);
  }

  return (
    <>
      <CssBaseline />
      <Login login={login} onLoginChange={handleLoginChange} setError={setError} />
      {login.username && <AccountsDataGrid login={login} setError={setError} onLoginChange={handleLoginChange} />}

      {error &&
        <Snackbar open={true} onClose={handleErrorClose}>
          <Alert
            severity="error"
            variant="standard"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>}
    </>
  )
}

export default App
