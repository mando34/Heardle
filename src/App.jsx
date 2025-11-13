import { useState } from 'react'
// import './App.css'
import HomePage from './pages/homepage';
import GamePage from './pages/gamepage';
import "./css/global.css";  

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GamePage />
    </>
  )
}

export default App
