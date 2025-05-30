import React, {useEffect, useState} from "react";
import {useAuth} from "../AuthContext.jsx";
import axios from "axios";
import '../vistes/VistaPerfil.css';
import {users} from "../data/users";
import { useNavigate } from "react-router-dom";

const VistaPerfil = ({ idUsuari }) => {
    const { apiKey } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("assigned");
    const navigate = useNavigate();

    // Estado para ordenar issues
    const [sortKey, setSortKey] = useState("id_issue");
    const [sortOrder, setSortOrder] = useState("asc");

    // Estados para control permisos y mensajes
    const [canEdit, setCanEdit] = useState(false);
    const [checkingEditPermission, setCheckingEditPermission] = useState(true);
    const [updateMessage, setUpdateMessage] = useState(null);

    // Estado para controlar modo edición y campos editables
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState("");
    const [editUrl, setEditUrl] = useState("");

    // Imagen default si no se procesa bien la imagen del perfil
    const defaultProfileImage = "https://img.freepik.com/vector-premium/icono-perfil-avatar-predeterminado-imagen-usuario-redes-sociales-icono-avatar-gris-silueta-perfil-blanco-ilustracion-vectorial_561158-3383.jpg?semt=ais_hybrid&w=740";

    // Información de usuarios hardcodeados
    const userInfo = users.find(user => user.id === parseInt(idUsuari));

    // Cargar perfil
    useEffect(() => {
        const fetchPerfil = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://backtracker-3hat.onrender.com/profile/${idUsuari}/`, {
                    headers: { Authorization: `Token ${apiKey}` },
                });
                setPerfil(response.data);
            } catch (err) {
                setError("No s'ha pogut carregar el perfil");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, [idUsuari, apiKey]);

    // Verificar permisos para editar, cuando perfil ya está cargado
    useEffect(() => {
        const checkEditPermission = async () => {
            if (!perfil) return;
            setCheckingEditPermission(true);
            try {
                await axios.put(
                    `https://backtracker-3hat.onrender.com/profile/${idUsuari}/`,
                    {
                        bio: perfil.perfil || "",
                        url: perfil.url || "",
                    },
                    {
                        headers: { Authorization: `Token ${apiKey}` },
                    }
                );
                setCanEdit(true);
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setCanEdit(false);
                } else {
                    setCanEdit(false);
                    console.error("Error verificando permisos:", err);
                }
            } finally {
                setCheckingEditPermission(false);
            }
        };
        checkEditPermission();
    }, [perfil, idUsuari, apiKey]);

    // Función para ordenar issues
    const sortIssues = (issues) => {
        if (!issues) return [];
        return [...issues].sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (sortKey === "updated_at" || sortKey === "modified") {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    };

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    const handleGoBack = () => {
        navigate(`/issues/`); // o la ruta que uses para el listado
    };

    const renderIssues = (issues) => {
        const sortedIssues = sortIssues(issues);
        return (
            <table className="issues-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort("id_issue")}>
                        # {sortKey === "id_issue" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={() => handleSort("title")}>
                        Títol {sortKey === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={() => handleSort("type")}>
                        Tipus {sortKey === "type" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={() => handleSort("severity")}>
                        Severitat {sortKey === "severity" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={() => handleSort("status")}>
                        Estat {sortKey === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th onClick={() => handleSort("updated_at")}>
                        Modificat {sortKey === "updated_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedIssues.map((issue) => (
                    <tr key={issue.id_issue}>
                        <td>#{issue.id_issue}</td>
                        <td>{issue.title}</td>
                        <td>{issue.type || "-"}</td>
                        <td>{issue.severity || "-"}</td>
                        <td>{issue.status}</td>
                        <td>{new Date(issue.updated_at).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const renderComments = (comments) => {
        const sortedComments = [...comments].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        return (
            <table className="comments-table">
                <thead>
                <tr>
                    <th>Usuari</th>
                    <th>Issue</th>
                    <th>Comentari</th>
                    <th>Data</th>
                </tr>
                </thead>
                <tbody>
                {sortedComments.map((comment) => (
                    <tr key={comment.id}>
                        <td>{comment.Username}</td>
                        <td>
                                #{comment.issue}
                        </td>
                        <td>{comment.text}</td>
                        <td>{new Date(comment.created_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    // Abrir formulario de edición
    const handleEditBio = () => {
        setEditBio(perfil.perfil || "");
        setEditUrl(perfil.url || "");
        setIsEditing(true);
        setUpdateMessage(null);
    };

    // Guardar cambios
    const handleSave = async () => {
        try {
            const response = await axios.put(
                `https://backtracker-3hat.onrender.com/profile/${idUsuari}/`,
                { bio: editBio, url: editUrl },
                { headers: { Authorization: `Token ${apiKey}` } }
            );
            setPerfil((prev) => ({
                ...prev,
                perfil: editBio,
                url: editUrl,
            }));
            setUpdateMessage(response.data.message || "Perfil actualitzat correctament");
            setIsEditing(false);
        } catch (err) {
            if (err.response) {
                setUpdateMessage(`Error: ${err.response.data.error || "No s'ha pogut actualitzar el perfil"}`);
            } else {
                setUpdateMessage("Error desconegut en actualitzar el perfil");
            }
            console.error(err);
        }
    };

    // Cancelar edición
    const handleCancel = () => {
        setIsEditing(false);
        setUpdateMessage(null);
    };

    if (loading) return <p style={{ color: "black" }}>Carregant...</p>;
    if (error) return <div>{error}</div>;
    if (!perfil) return <p style={{ color: "black" }}>Carregant perfil...</p>;

    return (
        <div className="perfil-page">
            <div className="perfil-left">
                <img
                    src={perfil.url || defaultProfileImage}
                    alt="Imatge de perfil"
                    className="perfil-img-large"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProfileImage;
                    }}
                />
                <h2>{userInfo?.name || "Usuari desconegut"}</h2>
                <p className="username">@{perfil?.username || "username"}</p>

                <div className="perfil-counts">
                    <div>
                        <strong>{perfil.assigned_count}</strong>
                        <span>Open<br />Assigned Issues</span>
                    </div>
                    <div>
                        <strong>{perfil.watched_count}</strong>
                        <span>Watched<br />Issues</span>
                    </div>
                    <div>
                        <strong>{perfil.comments_count}</strong>
                        <span>Comments</span>
                    </div>
                </div>

                {!isEditing && <p className="perfil-bio">{perfil.perfil}</p>}

                {!checkingEditPermission && canEdit && !isEditing && (
                    <button className="edit-bio-btn" onClick={handleEditBio}>
                        EDITAR BIOGRAFIA
                    </button>
                )}

                {isEditing && (
                    <div className="edit-form">
                        <label>
                            Introdueix nova biografia:
                            <textarea
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows={4}
                            />
                        </label>
                        <label>
                            Introdueix nova URL d'imatge de perfil:
                            <input
                                type="text"
                                value={editUrl}
                                onChange={(e) => setEditUrl(e.target.value)}
                            />
                        </label>
                        <div className="edit-buttons">
                            <button onClick={handleSave}>Guardar</button>
                            <button onClick={handleCancel}>Cancelar</button>
                        </div>
                    </div>
                )}

                {updateMessage && (
                    <p style={{ marginTop: 10, color: updateMessage.startsWith("Error") ? "red" : "green" }}>
                        {updateMessage}
                    </p>
                )}

                <button type="button" onClick={handleGoBack} className="btn-back">
                    ← Tornar a llistat d'issues
                </button>

            </div>

            <div className="perfil-right">
                <div className="tabs">
                    <button onClick={() => setActiveTab("assigned")} className={activeTab === "assigned" ? "active" : ""}>
                        Open Assigned Issues
                    </button>
                    <button onClick={() => setActiveTab("watched")} className={activeTab === "watched" ? "active" : ""}>
                        Watched Issues
                    </button>
                    <button onClick={() => setActiveTab("comments")} className={activeTab === "comments" ? "active" : ""}>
                        Comments
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === "assigned" && renderIssues(perfil.assigned_issues)}
                    {activeTab === "watched" && renderIssues(perfil.watched_issues)}
                    {activeTab === "comments" && renderComments(perfil.comments)}
                </div>
            </div>
        </div>
    );
};

export default VistaPerfil;
