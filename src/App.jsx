import { BrowserRouter as Router, Routes, Route, useParams, Link } from "react-router-dom";
import VistaEscogirUsuari from "./Components/VistaEscogirUsuari.jsx";
import VistaPerfil from "./Components/VistaPerfil.jsx";
import VistaSettings from "./Components/VistaSettings.jsx";
import { AuthProvider } from "./AuthContext";
import "./App.css";

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
                    <Route path="/settings" element={<VistaSettings />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

//                    <Link to="/" style={{ marginRight: 15 }}>
//                         Seleccionar Usuari
//                     </Link>

//                <nav style={{ padding: "10px", background: "#f7f9fc" }}>
//                     <Link to="/settings">Settings</Link>
//                 </nav>