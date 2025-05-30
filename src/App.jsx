import {
    BrowserRouter as Router,
    Routes,
    Route,
    useParams,
    Link,
} from "react-router-dom";
import { PureComponent, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import VistaLlistarIssues from './Components/VistaLlistatIssues.jsx';
import VistaEditarIssue from './Components/VistaEditarIssue.jsx';
import VistaEscogirUsuari from "./Components/VistaEscogirUsuari.jsx";
import VistaPerfil from "./Components/VistaPerfil.jsx";
import VistaSettings from "./Components/VistaSettings.jsx";
import VistaCreadoraIssue from "./Components/VistaCreadoraIssue.jsx";
import { AuthProvider } from "./AuthContext";
import "./App.css";

const VistaPerfilWrapper = () => {
    const { id } = useParams();
    return <VistaPerfil idUsuari={id} />;
};

const VistaCreadoraIssueWrapper = () => {
    const { id } = useParams();
    return <VistaCreadoraIssue userId={id} />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div>
                    <Routes>
                        <Route path="/" element={<VistaEscogirUsuari />} />
                        <Route path="/issues" element={<VistaLlistarIssues/>} />
                        <Route path="/issues/:issue_id" element={<VistaEditarIssue/>} />
                        <Route path="/profile/:id" element={<VistaPerfilWrapper />} />
                        <Route path="/settings" element={<VistaSettings />} />
                        <Route path="/crear-issue/:id" element={<VistaCreadoraIssueWrapper />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;