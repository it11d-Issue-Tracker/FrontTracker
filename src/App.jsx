import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dropdown from './Components/Dropdown'
import VistaEscogirUsuari from './vistes/VistaEscogirUsuari'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <VistaEscogirUsuari/>
    </div>
  )
}

export default App
