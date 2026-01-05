import './App.css'
import Accounts from './Accounts'
import Login from './Login'
import { useState } from 'react'

function App() {

  const [login, setLogin] = useState({});

  const handleLoginChange = (newLogin) => {
    //console.log('Login change: ', newLogin);
    setLogin(newLogin);
    //console.log('New login state: ', login);
  }

  return (
    <>
      <Login login={login} onLoginChange={handleLoginChange} />
      { login.username && <Accounts login={login} /> }
    </>
  )
}

export default App
