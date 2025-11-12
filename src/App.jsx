import { useState } from 'react'
// import './App.css'
//import HomePage from './pages/homepage';
import "./css/global.css";  

//GaneResults page
import GameResults from './pages/game-results.jsx';
import "./css/game-results.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameResults/>
    </>
  )
}

export default App
