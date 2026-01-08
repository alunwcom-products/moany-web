import './App.css'
import Accounts from './Accounts'
import Login from './Login'
import { useState } from 'react'
import GridToolbarCustomPanel from './GridToolbarCustomPanel';

function App() {

  const [login, setLogin] = useState(() => {
    const saved = sessionStorage.getItem('login');
    console.log('got saved: ', saved);
    return saved !== null ? JSON.parse(saved) : {};
  });

  const handleLoginChange = (newLogin) => {
    //console.log('Login change: ', newLogin);

    setLogin(() => {
      console.log('setting saved: ', JSON.stringify(newLogin));
      sessionStorage.setItem('login', JSON.stringify(newLogin));
      return newLogin
    });
    //console.log('New login state: ', login);
  }

  return (
    <>
      <Login login={login} onLoginChange={handleLoginChange} />
      {/* {login.username && <Accounts login={login} />} */}
      {login.username && <GridToolbarCustomPanel login={login} />}

      
    </>
  )
}

export default App
