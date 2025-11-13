import { useState } from 'react'
// import './App.css'
import HomePage from './pages/homepage';
import LoginPage from './pages/loginPage';
import CreateAcc from './pages/createAccPage';
import "./css/global.css";  

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <LoginPage />
    </>
  )
}

export default App
