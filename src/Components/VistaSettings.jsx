import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import "../vistes/VistaSettings.css";
import { useNavigate } from "react-router-dom";

const VistaSettings = () => {
    const { apiKey } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newStatus, setNewStatus] = useState({ id: "", orden: "", color: "#000000" });
    const [statusMsg, setStatusMsg] = useState(null);

    const [newPriority, setNewPriority] = useState({ id: "", orden: "", color: "#000000" });
    const [priorityMsg, setPriorityMsg] = useState(null);

    const [newSeverity, setNewSeverity] = useState({ id: "", orden: "", color: "#000000" });
    const [severityMsg, setSeverityMsg] = useState(null);

    const [newType, setNewType] = useState({ id: "", orden: "", color: "#000000" });
    const [typeMsg, setTypeMsg] = useState(null);

    const [successMessage, setSuccessMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("https://backtracker-3hat.onrender.com/settings/", {
                    headers: { Authorization: `Token ${apiKey}` },
                });
                setSettings(response.data);
            } catch (err) {
                setError("No s'han pogut carregar les configuracions");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [apiKey]);

    const ordenar = (arr) => [...arr].sort((a, b) => a.orden - b.orden);

    const handleCreateStatus = async (e) => {
        e.preventDefault();
        setStatusMsg(null);
        const body = {
            id: newStatus.id.trim(),
            orden: Number(newStatus.orden),
            color: newStatus.color,
        };

        if (!body.id || !body.orden || !body.color) {
            setStatusMsg({ error: "Omple tots els camps correctament." });
            return;
        }

        // Validacions locals
        if (settings.statuses.some(s => s.id === body.id)) {
            setStatusMsg({ error: "Ja existeix un status amb aquest id." });
            return;
        }
        if (settings.statuses.some(s => s.orden === body.orden)) {
            setStatusMsg({ error: "Ja existeix un status amb aquest ordre." });
            return;
        }
        if (settings.statuses.some(s => s.color === body.color)) {
            setStatusMsg({ error: "Ja existeix un status amb aquest color." });
            return;
        }

        try {
            const res = await axios.post(
                "https://backtracker-3hat.onrender.com/settings/status/",
                body,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setStatusMsg({ success: `Status "${res.data.id}" creat!` });
            setSettings((prev) => ({
                ...prev,
                statuses: [...prev.statuses, res.data],
            }));
            setNewStatus({ id: "", orden: "", color: "#000000" });
        } catch (err) {
            const msg = err.response?.data?.error || "Error al crear status.";
            setStatusMsg({ error: msg });
            console.error(err);
        }
    };

    const handleCreatePriority = async (e) => {
        e.preventDefault();
        setPriorityMsg(null);
        const body = {
            id: newPriority.id.trim(),
            orden: Number(newPriority.orden),
            color: newPriority.color,
        };

        if (!body.id || !body.orden || !body.color) {
            setPriorityMsg({ error: "Omple tots els camps correctament." });
            return;
        }

        if (settings.priorities.some(p => p.id === body.id)) {
            setPriorityMsg({ error: "Ja existeix una priority amb aquest id." });
            return;
        }
        if (settings.priorities.some(p => p.orden === body.orden)) {
            setPriorityMsg({ error: "Ja existeix una priority amb aquest ordre." });
            return;
        }
        if (settings.priorities.some(p => p.color === body.color)) {
            setPriorityMsg({ error: "Ja existeix una priority amb aquest color." });
            return;
        }

        try {
            const res = await axios.post(
                "https://backtracker-3hat.onrender.com/settings/priority/",
                body,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setPriorityMsg({ success: `Priority "${res.data.id}" creada!` });
            setSettings((prev) => ({
                ...prev,
                priorities: [...prev.priorities, res.data],
            }));
            setNewPriority({ id: "", orden: "", color: "#000000" });
        } catch (err) {
            const msg = err.response?.data?.error || "Error al crear priority.";
            setPriorityMsg({ error: msg });
            console.error(err);
        }
    };


    const handleCreateSeverity = async (e) => {
        e.preventDefault();
        setSeverityMsg(null);
        const body = {
            id: newSeverity.id.trim(),
            orden: Number(newSeverity.orden),
            color: newSeverity.color,
        };

        if (!body.id || !body.orden || !body.color) {
            setSeverityMsg({ error: "Omple tots els camps correctament." });
            return;
        }

        if (settings.severities.some(s => s.id === body.id)) {
            setSeverityMsg({ error: "Ja existeix una severity amb aquest id." });
            return;
        }
        if (settings.severities.some(s => s.orden === body.orden)) {
            setSeverityMsg({ error: "Ja existeix una severity amb aquest ordre." });
            return;
        }
        if (settings.severities.some(s => s.color === body.color)) {
            setSeverityMsg({ error: "Ja existeix una severity amb aquest color." });
            return;
        }

        try {
            const res = await axios.post(
                "https://backtracker-3hat.onrender.com/settings/severity/",
                body,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSeverityMsg({ success: `Severity "${res.data.id}" creada!` });
            setSettings((prev) => ({
                ...prev,
                severities: [...prev.severities, res.data],
            }));
            setNewSeverity({ id: "", orden: "", color: "#000000" });
        } catch (err) {
            const msg = err.response?.data?.error || "Error al crear severity.";
            setSeverityMsg({ error: msg });
            console.error(err);
        }
    };

    const handleCreateType = async (e) => {
        e.preventDefault();
        setTypeMsg(null);
        const body = {
            id: newType.id.trim(),
            orden: Number(newType.orden),
            color: newType.color,
        };

        if (!body.id || !body.orden || !body.color) {
            setTypeMsg({ error: "Omple tots els camps correctament." });
            return;
        }

        if (settings.types.some(t => t.id === body.id)) {
            setTypeMsg({ error: "Ja existeix un type amb aquest id." });
            return;
        }
        if (settings.types.some(t => t.orden === body.orden)) {
            setTypeMsg({ error: "Ja existeix un type amb aquest ordre." });
            return;
        }
        if (settings.types.some(t => t.color === body.color)) {
            setTypeMsg({ error: "Ja existeix un type amb aquest color." });
            return;
        }

        try {
            const res = await axios.post(
                "https://backtracker-3hat.onrender.com/settings/type/",
                body,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setTypeMsg({ success: `Type "${res.data.id}" creat!` });
            setSettings((prev) => ({
                ...prev,
                types: [...prev.types, res.data],
            }));
            setNewType({ id: "", orden: "", color: "#000000" });
        } catch (err) {
            const msg = err.response?.data?.error || "Error al crear type.";
            setTypeMsg({ error: msg });
            console.error(err);
        }
    };

    const handleDeleteStatus = async (statusId) => {
        if (!window.confirm(`Segur que vols eliminar el status "${statusId}"?`)) return;
        try {
            await axios.delete(
                `https://backtracker-3hat.onrender.com/settings/delete_status/${statusId}/`,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSettings((prev) => ({
                ...prev,
                statuses: prev.statuses.filter(s => s.id !== statusId),
            }));
            showSuccessPopup(`Status "${statusId}" eliminat correctament.`);
        } catch (err) {
            alert("Error al eliminar el status.");
            console.error(err);
        }
    };

    const handleDeletePriority = async (priorityId) => {
        if (!window.confirm(`Segur que vols eliminar la priority "${priorityId}"?`)) return;
        try {
            await axios.delete(
                `https://backtracker-3hat.onrender.com/settings/delete_priority/${priorityId}/`,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSettings((prev) => ({
                ...prev,
                priorities: prev.priorities.filter(p => p.id !== priorityId),
            }));
            showSuccessPopup(`Priority "${priorityId}" eliminada correctament.`);
        } catch (err) {
            alert("Error al eliminar la priority.");
            console.error(err);
        }
    };

    const handleDeleteSeverity = async (severityId) => {
        if (!window.confirm(`Segur que vols eliminar la severity "${severityId}"?`)) return;
        try {
            await axios.delete(
                `https://backtracker-3hat.onrender.com/settings/delete_severity/${severityId}/`,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSettings((prev) => ({
                ...prev,
                severities: prev.severities.filter(s => s.id !== severityId),
            }));
            showSuccessPopup(`Severity "${severityId}" eliminada correctament.`);
        } catch (err) {
            alert("Error al eliminar la severity.");
            console.error(err);
        }
    };

    const handleDeleteType = async (typeId) => {
        if (!window.confirm(`Segur que vols eliminar el type "${typeId}"?`)) return;
        try {
            await axios.delete(
                `https://backtracker-3hat.onrender.com/settings/delete_type/${typeId}/`,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSettings((prev) => ({
                ...prev,
                types: prev.types.filter(t => t.id !== typeId),
            }));
            showSuccessPopup(`Type "${typeId}" eliminat correctament.`);
        } catch (err) {
            alert("Error al eliminar el type.");
            console.error(err);
        }
    };

    const handleGoBack = () => {
        navigate(`/issues/`); // o la ruta que uses para el listado
    };

    if (loading) return <p style={{ color: "black" }}>Carregant configuracions...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!settings) return null;

    const renderTable = (title, items, onDelete = null) => (
        <div className="table-wrapper">
            <h3>{title}</h3>
            <table className="settings-table">
                <thead>
                <tr>
                    <th>Id / Name</th>
                    <th>Orden</th>
                    <th>Color</th>
                    {onDelete && <th>Accions</th>}
                </tr>
                </thead>
                <tbody>
                {ordenar(items).map(({ id, name, orden, color }) => (
                    <tr key={id || name}>
                        <td>{id || name}</td>
                        <td>{orden}</td>
                        <td>
                            <span className="color-box" style={{ backgroundColor: color }} title={color} />
                        </td>
                        {onDelete && (
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => onDelete(id)}
                                    title="Eliminar"
                                >
                                    ❌
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const showSuccessPopup = (message) => {
        setSuccessMessage(message);
        setShowSuccessModal(true);
    };

    return (
        <div className="vista-settings-container">
            <h2>Settings</h2>
            <button type="button" onClick={handleGoBack} className="btn-back">
                ← Tornar a llistat d'issues
            </button>
            <div className="form-table-row">
                <form className="create-form" onSubmit={handleCreateStatus}>
                    <h3>Crear Status</h3>
                    <label>Id:
                        <input className="input-text" type="text" value={newStatus.id} onChange={(e) => setNewStatus(s => ({ ...s, id: e.target.value }))} required />
                    </label>
                    <label>Orden:
                        <input className="input-number" type="number" value={newStatus.orden} onChange={(e) => setNewStatus(s => ({ ...s, orden: e.target.value }))} min="1" required />
                    </label>
                    <label>Color:
                        <input className="input-color" type="color" value={newStatus.color} onChange={(e) => setNewStatus(s => ({ ...s, color: e.target.value }))} required />
                    </label>
                    <button type="submit" className="btn-submit">Crear Status</button>
                    {statusMsg?.error && <p className="error-message">{statusMsg.error}</p>}
                    {statusMsg?.success && <p className="success-message">{statusMsg.success}</p>}
                </form>
                {renderTable("Llista de Statuses", settings.statuses, handleDeleteStatus)}
            </div>

            <div className="form-table-row">
                <form className="create-form" onSubmit={handleCreatePriority}>
                    <h3>Crear Priority</h3>
                    <label>Id:
                        <input className="input-text" type="text" value={newPriority.id} onChange={(e) => setNewPriority(s => ({ ...s, id: e.target.value }))} required />
                    </label>
                    <label>Orden:
                        <input className="input-number" type="number" value={newPriority.orden} onChange={(e) => setNewPriority(s => ({ ...s, orden: e.target.value }))} min="1" required />
                    </label>
                    <label>Color:
                        <input className="input-color" type="color" value={newPriority.color} onChange={(e) => setNewPriority(s => ({ ...s, color: e.target.value }))} required />
                    </label>
                    <button type="submit" className="btn-submit">Crear Priority</button>
                    {priorityMsg?.error && <p className="error-message">{priorityMsg.error}</p>}
                    {priorityMsg?.success && <p className="success-message">{priorityMsg.success}</p>}
                </form>
                {renderTable("Llista de Priorities", settings.priorities, handleDeletePriority)}
            </div>

            <div className="form-table-row">
                <form className="create-form" onSubmit={handleCreateSeverity}>
                    <h3>Crear Severity</h3>
                    <label>Id:
                        <input className="input-text" type="text" value={newSeverity.id} onChange={(e) => setNewSeverity(s => ({ ...s, id: e.target.value }))} required />
                    </label>
                    <label>Orden:
                        <input className="input-number" type="number" value={newSeverity.orden} onChange={(e) => setNewSeverity(s => ({ ...s, orden: e.target.value }))} min="1" required />
                    </label>
                    <label>Color:
                        <input className="input-color" type="color" value={newSeverity.color} onChange={(e) => setNewSeverity(s => ({ ...s, color: e.target.value }))} required />
                    </label>
                    <button type="submit" className="btn-submit">Crear Severity</button>
                    {severityMsg?.error && <p className="error-message">{severityMsg.error}</p>}
                    {severityMsg?.success && <p className="success-message">{severityMsg.success}</p>}
                </form>
                {renderTable("Llista de Severities", settings.severities, handleDeleteSeverity)}
            </div>

            <div className="form-table-row">
                <form className="create-form" onSubmit={handleCreateType}>
                    <h3>Crear Type</h3>
                    <label>Id:
                        <input className="input-text" type="text" value={newType.id} onChange={(e) => setNewType(t => ({ ...t, id: e.target.value }))} required />
                    </label>
                    <label>Orden:
                        <input className="input-number" type="number" value={newType.orden} onChange={(e) => setNewType(t => ({ ...t, orden: e.target.value }))} min="1" required />
                    </label>
                    <label>Color:
                        <input className="input-color" type="color" value={newType.color} onChange={(e) => setNewType(t => ({ ...t, color: e.target.value }))} required />
                    </label>
                    <button type="submit" className="btn-submit">Crear Type</button>
                    {typeMsg?.error && <p className="error-message">{typeMsg.error}</p>}
                    {typeMsg?.success && <p className="success-message">{typeMsg.success}</p>}
                </form>
                {renderTable("Llista de Types", settings.types, handleDeleteType)}
            </div>
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{successMessage}</p>
                        <button onClick={() => setShowSuccessModal(false)}>Tancar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VistaSettings;
