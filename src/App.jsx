import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VistaEscogirUsuari from './vistes/VistaEscogirUsuari'
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <div>
      <AuthProvider>
        <VistaEscogirUsuari/>
      </AuthProvider>
    </div>
  )
}

export default App
