import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { fetchSettings } from "../API/settingsApi";

export default function VistaDetallIssue() {
  const { issue_id } = useParams();
  const { apiKey } = useAuth();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      console.error(err);
      setError("Error guardant els canvis.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>{error}</p>;
  if (!issue) return <p>No s'ha trobat la incidència.</p>;

  const renderOption = (item) => (
    <option key={item.id} value={item.id}>
      {item.id}
    </option>
  );

  return (
    <div className="vista-detall-issue" style={{ padding: "1rem", fontFamily: "Segoe UI, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>Detall de la incidència #{issue.id_issue}</h2>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="title" value={form.title || ""} onChange={handleChange} placeholder="Títol" required />
        <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Descripció" rows={4} />
        <input type="date" name="deadline" value={form.deadline || ""} onChange={handleChange} />

        <label>Estat</label>
        <select name="status" value={form.status || ""} onChange={handleChange}>
          {statuses.map(renderOption)}
        </select>

        <label>Prioritat</label>
        <select name="priority" value={form.priority || ""} onChange={handleChange}>
          {priorities.map(renderOption)}
        </select>

        <label>Severitat</label>
        <select name="severity" value={form.severity || ""} onChange={handleChange}>
          {severities.map(renderOption)}
        </select>

        <label>Tipus</label>
        <select name="type" value={form.type || ""} onChange={handleChange}>
          {types.map(renderOption)}
        </select>

        <input
          type="number"
          name="assigned_to"
          value={form.assigned_to ?? ""}
          onChange={handleChange}
          placeholder="Assignat a (ID)"
        />

        <button type="submit" className="btn-new-issue" disabled={saving}>
          {saving ? "Guardant..." : "Guardar canvis"}
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Informació addicional</h3>
      <p><strong>Creat:</strong> {new Date(issue.created_at).toLocaleString()}</p>
      <p><strong>Modificat:</strong> {new Date(issue.updated_at).toLocaleString()}</p>
      <p><strong>Watchers:</strong> {issue.watchers?.length > 0 ? issue.watchers.join(", ") : "Cap"}</p>
      <p><strong>Attachments:</strong> {issue.attachments?.length > 0 ? issue.attachments.join(", ") : "Cap"}</p>
    </div>
  );
}
