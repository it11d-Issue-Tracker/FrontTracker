import Dropdown from "./Dropdown.jsx";
import React, { useState } from "react";
import '../vistes/VistaEscogirUsuari.css'
import { users } from "../data/users.js";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";



export default function VistaEscogirUsuari() {
    const [selectedId, setSelectedId] = useState("")
    const { setApiKey } = useAuth();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setSelectedId((e.target.value));
    };


    const handleLogin = () => {
        const user = users.find(u => u.id === parseInt(selectedId));
        if (user) {
            setApiKey(user.apiKey);
            navigate("/issues")
        } else {
            alert("ApiKey no vàlida.")
        }
    };

    return (
        <div className="vistaEscogirUsuari">
            <h1 className="h1Usuari">Selecciona un Usuari</h1>
            <Dropdown
                options = {users}
                value={selectedId}
                onChange={handleChange}
                placeholder= {"Sense Elecció"}
                />
            <button onClick={handleLogin} disabled={selectedId == "?"}>Iniciar Sessió amb {selectedId} </button>
        </div>

    );
}