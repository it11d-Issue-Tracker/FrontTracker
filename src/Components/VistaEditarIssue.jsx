import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { fetchSettings } from "../API/settingsApi";
import "../vistes/VistaEditarIssue.css";

export default function VistaEditarIssue() {
  const { issue_id } = useParams();
  const { apiKey, id } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [types, setTypes] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issueRes, settings] = await Promise.all([
          axios.get(`https://backtracker-3hat.onrender.com/issues/${issue_id}`, {
            headers: { Authorization: `Token ${apiKey}` },
          }),
          fetchSettings(apiKey),
        ]);

        setIssue(issueRes.data);
        setForm(issueRes.data);
        setStatuses(settings.statuses);
        setPriorities(settings.priorities);
        setSeverities(settings.severities);
        setTypes(settings.types);
      } catch (err) {
        console.error(err);
        setError("Error carregant dades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [issue_id, apiKey]);

  useEffect(() => {
    if (issue?.attachments?.length > 0) {
      console.log("DEBUG - Attachments:");
      issue.attachments.forEach((att, i) => {
        console.log(`📎 Attachment [${i}]:`, att);
        console.log(`➡️ typeof att.file: ${typeof att.file}`);
        console.log(`➡️ att.file: ${att.file}`);
      });
    }
  }, [issue]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`https://backtracker-3hat.onrender.com/issues/${issue_id}/`, form, {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
      });
      alert("Issue actualitzada correctament.");
      navigate("/issues");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Error guardant els canvis.");
    } finally {
      setSaving(false);
    }
  };

  const addWatcher = async () => {
    try {
      await axios.post(
        "https://backtracker-3hat.onrender.com/watchers/",
        { issue: issue_id },
        { headers: { Authorization: `Token ${apiKey}` } }
      );
      alert("Afegit com a watcher.");
      refreshIssue();
    } catch (err) {
      console.error("Add watcher error:", err.response?.data || err.message);
      alert("Error afegint watcher.");
    }
  };

  const removeWatcher = async () => {
    try {
      const resWatchers = await axios.get("https://backtracker-3hat.onrender.com/watchers/", {
        headers: { Authorization: `Token ${apiKey}` },
      });

      const myWatcher = resWatchers.data.find(
        (w) => Number(w.issue) === Number(issue_id) && w.user === id
      );

      if (!myWatcher) return alert("No s'ha trobat el teu watcher.");

      await axios.delete(
        `https://backtracker-3hat.onrender.com/watchers/${myWatcher.id}/`,
        { headers: { Authorization: `Token ${apiKey}` } }
      );

      alert("Eliminat de watchers.");
      refreshIssue();
    } catch (err) {
      console.error("Remove watcher error:", err.response?.data || err.message);
      alert("Error eliminant watcher.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://backtracker-3hat.onrender.com/comments/",
        {
          issue: issue_id,
          text: newComment,
        },
        {
          headers: { Authorization: `Token ${apiKey}` },
        }
      );
      setNewComment("");
      refreshIssue();
    } catch (err) {
      console.error("Error afegint comentari:", err.response?.data || err.message);
      alert("No s'ha pogut afegir el comentari.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://backtracker-3hat.onrender.com/comments/${commentId}/`,
        {
          headers: { Authorization: `Token ${apiKey}` },
        }
      );
      alert("Comentari eliminat.");
      refreshIssue();
    } catch (err) {
      console.error("Error eliminant comentari:", err.response?.data || err.message);
      alert("No s'ha pogut eliminar el comentari.");
    }
  };

  const handleUploadAttachment = async (e) => {
    e.preventDefault();
    if (!newFile) return;

    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("issue", issue_id);

    try {
      await axios.post("https://backtracker-3hat.onrender.com/attachments/", formData, {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Fitxer pujat correctament.");
      setNewFile(null);
      refreshIssue();
    } catch (err) {
      console.error("Error pujant fitxer:", err.response?.data || err.message);
      alert("No s'ha pogut pujar el fitxer.");
    }
  };

  const refreshIssue = async () => {
    try {
      const res = await axios.get(`https://backtracker-3hat.onrender.com/issues/${issue_id}`, {
        headers: { Authorization: `Token ${apiKey}` },
      });
      setIssue(res.data);
    } catch (err) {
      console.error("Error refrescant la issue:", err.response?.data || err.message);
    }
  };

  const renderOption = (item) => (
    <option key={item.id} value={item.id}>
      {item.id}
    </option>
  );

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>{error}</p>;
  if (!issue) return <p>No s'ha trobat la incidència.</p>;

  return (
    <div className="vista-detall-issue" style={{ padding: "1rem", fontFamily: "Segoe UI, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>Detall de la incidència #{issue.id_issue}</h2>

      <button onClick={() => navigate("/issues")} className="btn-bulk-insert" style={{ marginBottom: "1rem" }}>
        Tornar a la llista
      </button>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input id="title" value={form.title || ""} onChange={handleChange} placeholder="Títol" required />
        <textarea id="description" value={form.description || ""} onChange={handleChange} placeholder="Descripció" rows={4} />
        <input type="date" id="deadline" value={form.deadline || ""} onChange={handleChange} />
        <label>Estat</label>
        <select id="status" value={form.status || ""} onChange={handleChange}>{statuses.map(renderOption)}</select>
        <label>Prioritat</label>
        <select id="priority" value={form.priority || ""} onChange={handleChange}>{priorities.map(renderOption)}</select>
        <label>Severitat</label>
        <select id="severity" value={form.severity || ""} onChange={handleChange}>{severities.map(renderOption)}</select>
        <label>Tipus</label>
        <select id="type" value={form.type || ""} onChange={handleChange}>{types.map(renderOption)}</select>
        <input type="number" id="assigned_to" value={form.assigned_to ?? ""} onChange={handleChange} placeholder="Assignat a (ID)" />
        <button type="submit" className="btn-new-issue" disabled={saving}>{saving ? "Guardant..." : "Guardar canvis"}</button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Watchers</h3>
      <p><strong>Watchers:</strong> {issue.watchers.length > 0 ? issue.watchers.map((w) => (typeof w === "object" && w.user ? w.user : w)).join(", ") : "Cap"}</p>
      <button onClick={addWatcher} className="btn-bulk-insert">Afegir-me com a watcher</button>
      <button onClick={removeWatcher} className="btn-bulk-insert">Treure'm de watchers</button>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Comentaris</h3>
      {issue.comments.length === 0 ? (
        <p>No hi ha comentaris.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {issue.comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
              <p><strong>{comment.Username}:</strong> {comment.text}</p>
              <p style={{ fontSize: "0.85rem", color: "#555" }}>{new Date(comment.created_at).toLocaleString()}</p>
              {comment.author === id && (
                <button onClick={() => handleDeleteComment(comment.id)} className="btn-bulk-insert" style={{ marginTop: "0.5rem" }}>
                  Eliminar comentari
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} placeholder="Escriu un comentari..." required />
        <button type="submit" className="btn-bulk-insert">Afegir comentari</button>
      </form>

      <hr style={{ margin: "2rem 0" }} />
      <h3>Attachments</h3>
      {issue.attachments.length === 0 ? (
        <p>Cap adjunt.</p>
      ) : (
        <ul style={{ paddingLeft: "1rem" }}>
          {issue.attachments.map((att) => (
            <li key={att.id}>
              <a href={`https://backtracker-3hat.onrender.com${att.file}`} target="_blank" rel="noopener noreferrer">{att.file.split("/").pop()}</a><br />
              {att.file.match(/\.(jpg|jpeg|png|gif)$/i) && (
                <img src={`https://backtracker-3hat.onrender.com${att.file}`} alt="Attachment" style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "0.5rem" }} />
              )}
            </li>
          ))}
        </ul>
      )}

      <h3>Afegir attachment</h3>
      <form onSubmit={handleUploadAttachment} encType="multipart/form-data" style={{ marginTop: "1rem" }}>
        <input type="file" onChange={(e) => setNewFile(e.target.files[0])} required />
        <button type="submit" className="btn-bulk-insert" style={{ marginTop: "0.5rem" }}>Pujar fitxer</button>
      </form>
    </div>
  );
}
