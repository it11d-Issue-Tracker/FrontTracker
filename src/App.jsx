import { PureComponent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VistaEscogirUsuari from './Components/VistaEscogirUsuari.jsx';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<VistaEscogirUsuari />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
