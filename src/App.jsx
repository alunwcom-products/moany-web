import './App.css'
import Accounts from './Accounts'
import Login from './Login'
import { useState } from 'react'

function App() {

  const [login, setLogin] = useState({ username: undefined, token: undefined});

  const handleLoginChange = (newLogin) => {
    //console.log(`Login change: '${newLogin.username}', '${newLogin.token}'`);
    setLogin(() => newLogin)
    console.log(`New login state: ${JSON.stringify(login)}`);
  }

  return (
    <>
      <Login login={login} onLoginChange={handleLoginChange} />
      <Accounts></Accounts>
    </>
  )
}

export default App
