import Dropdown from "../Components/Dropdown";
import React, { useState } from "react";
import './VistaEscogirUsuari.css'


export default function VistaEscogirUsuari() {
    const [selectedId, setSelectedId] = useState("")

    const usuarios = [
        { id: 1, name: "Samu" },
        { id: 2, name: "Laura" },
        { id: 3, name: "Marc" },
      ];

    const handleChange = (e) => {
        setSelectedId((e.target.value));
    };

    return (
        <div className="vistaEscogirUsuari">
            <h1 className="h1Usuari">Selecciona un Usuari</h1>
            <Dropdown
                options = {usuarios}
                value={selectedId}
                onChange={handleChange}
                placeholder= {"Sense Elecció"}
                />
            <p className="pUsuari"> Usuari {selectedId}</p>
        </div>
    );
}