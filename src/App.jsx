import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import VistaEscogirUsuari from './Components/VistaEscogirUsuari.jsx';
import VistaPerfil from './Components/VistaPerfil.jsx';
import { AuthProvider } from './AuthContext';
import './App.css';

const VistaPerfilWrapper = () => {
    const { id } = useParams();
    return <VistaPerfil idUsuari={id} />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<VistaEscogirUsuari />} />
                    <Route path="/perfil/:id" element={<VistaPerfilWrapper />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
