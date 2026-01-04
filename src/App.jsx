import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Accounts from './Accounts'
import { Box, Button } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Box sx={{ p: 5 }}>
      <Button variant='outlined' onClick={() => setCount(count + 1)}>Count = {count}</Button>
      </Box>
      <Accounts></Accounts>
    </>
  )
}

export default App
