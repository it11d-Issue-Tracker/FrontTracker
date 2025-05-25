import Dropdown from "../Components/Dropdown";
import React, { useState } from "react";
import './VistaEscogirUsuari.css'
import { users } from "../data/users";
import { useAuth } from "../AuthContext";


export default function VistaEscogirUsuari() {
    const [selectedId, setSelectedId] = useState("")
    const { setApiKey } = useAuth();

    const handleChange = (e) => {
        setSelectedId((e.target.value));
    };


    const handleLogin = () => {
        const user = users.find(u => u.id === parseInt(selectedId));
        if (user) {
            setApiKey(user.apiKey);
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