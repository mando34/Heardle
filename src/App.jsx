import { useState } from 'react'
// import './App.css'
import HomePage from './pages/homepage';
import "./css/global.css";  

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HomePage />
    </>
  )
}

export default App
