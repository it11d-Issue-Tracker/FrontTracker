import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";
import "../vistes/VistaCreadoraIssue.css";

const VistaCreadoraIssue = ({ userId }) => {
    const { apiKey } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        severity: "",
        status: "",
        priority: "",
        type: "",
        created_by: userId,
        deadline: "",
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const [severities, setSeverities] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const config = { headers: { Authorization: `Token ${apiKey}` } };
                const [sev, stat, prio, typ] = await Promise.all([
                    axios.get("https://backtracker-3hat.onrender.com/settings/severity", config),
                    axios.get("https://backtracker-3hat.onrender.com/settings/status", config),
                    axios.get("https://backtracker-3hat.onrender.com/settings/priority", config),
                    axios.get("https://backtracker-3hat.onrender.com/settings/type", config),
                ]);
                setSeverities(sev.data);
                setStatuses(stat.data);
                setPriorities(prio.data);
                setTypes(typ.data);

                setFormData(prev => ({
                    ...prev,
                    severity: sev.data[0]?.id || "",
                    status: stat.data[0]?.id || "",
                    priority: prio.data[0]?.id || "",
                    type: typ.data[0]?.id || ""
                }));
            } catch (error) {
                console.error("Error carregant configuració:", error);
                setErrorMessage("No s'han pogut carregar les opcions per crear una issue.");
            }
        };
        fetchSettings();
    }, [apiKey]);

    const validateForm = () => {
        const errors = {};
        const today = new Date().toISOString().split("T")[0];

        if (!formData.severity) errors.severity = "La severitat és obligatòria.";
        if (!formData.status) errors.status = "L'estat és obligatori.";
        if (!formData.priority) errors.priority = "La prioritat és obligatòria.";
        if (!formData.type) errors.type = "El tipus és obligatori.";
        if (formData.deadline && formData.deadline < today) errors.deadline = "La data límit no pot ser anterior a avui.";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.post(
                "https://backtracker-3hat.onrender.com/issues/",
                formData,
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setSuccessMessage("Issue creada correctament!");
            setFormData({
                title: "",
                description: "",
                severity: severities[0]?.id || "",
                status: statuses[0]?.id || "",
                priority: priorities[0]?.id || "",
                type: types[0]?.id || "",
                created_by: userId,
                deadline: "",
            });
            setValidationErrors({});
        } catch (err) {
            console.error(err);
            setErrorMessage("Error en crear la issue. Comprova les dades introduïdes.");
        } finally {
            setLoading(false);
        }
    };

    const renderSelect = (name, label, options, value) => (
        <label>
            {label}
            <select name={name} value={value} onChange={handleChange}>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.id}
                    </option>
                ))}
            </select>
            {validationErrors[name] && <p className="field-error">{validationErrors[name]}</p>}
        </label>
    );

    return (
        <div className="creadora-issue-container">
            <h2>Crear Nova Issue</h2>
            <form onSubmit={handleSubmit} className="creadora-issue-form">
                <label>
                    Títol:
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </label>

                <label>
                    Descripció:
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
                </label>

                <div className="form-row">
                    {renderSelect("severity", "Severity:", severities, formData.severity)}
                    {renderSelect("status", "Status:", statuses, formData.status)}
                </div>

                <div className="form-row">
                    {renderSelect("priority", "Priority:", priorities, formData.priority)}
                    {renderSelect("type", "Type:", types, formData.type)}
                </div>

                <label>
                    Data límit:
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                    {validationErrors.deadline && <p className="field-error">{validationErrors.deadline}</p>}
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Creant..." : "Crear Issue"}
                </button>

                {successMessage && <p className="success-msg">{successMessage}</p>}
                {errorMessage && <p className="error-msg">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default VistaCreadoraIssue;
