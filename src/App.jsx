import { useState } from 'react'
// import './App.css'
import HomePage from './pages/homepage';
import ProfilePage from './pages/profilepage';
import "./css/global.css";  

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HomePage />
      <ProfilePage />
    </>
  )
}

export default App
