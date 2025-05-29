import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  fetchSeverities,
  fetchStatuses,
  fetchPriorities,
  fetchTypes,
} from "../API/settingsApi";
import "../vistes/VistaLlistatIssues.css";

export default function VistaLlistarIssues() {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [severities, setSeverities] = useState({});
  const [priorities, setPriorities] = useState({});
  const [types, setTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Bulk insert modal state
  const [showModal, setShowModal] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkError, setBulkError] = useState("");

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    priority: "",
    created_by: "",
    assigned_to: "",
    type: "",
    severity: "",
    order_by: "",
  });

  const handleNewIssue = () => navigate("/issues/new");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getOrder = (value, map) => map[value]?.orden ?? 999;

  const handleBulkInsert = async () => {
    const titles = bulkInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    if (titles.length === 0) {
      setBulkError("Has de proporcionar almenys un títol.");
      return;
    }

    try {
      await axios.post(
        "https://backtracker-3hat.onrender.com/issues/bulk-insert/",
        {
          issues: titles.map((title) => ({
            title,
            description: `Descripció per a: ${title}`,
          })),
        },
        {
          headers: {
            Authorization: `Token ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowModal(false);
      setBulkInput("");
      setBulkError("");
      window.location.reload();
    } catch (error) {
      console.error(error);
      setBulkError("Error al fer el bulk insert.");
    }
  };

  const fetchFilteredIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      for (const key in filters) {
        if (filters[key]) {
          params[key] = filters[key];
        }
      }
  
      const res = await axios.get("https://backtracker-3hat.onrender.com/issues", {
        headers: { Authorization: `Token ${apiKey}` },
        params,
      });
  
      setIssues(res.data);
    } catch (err) {
      console.error(err);
      setError("Error aplicant filtres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://backtracker-3hat.onrender.com/issues", {
          headers: { Authorization: `Token ${apiKey}` },
        });
        setIssues(res.data);

        const [statusesData, severitiesData, prioritiesData, typesData] = await Promise.all([
          fetchStatuses(apiKey),
          fetchSeverities(apiKey),
          fetchPriorities(apiKey),
          fetchTypes(apiKey),
        ]);
          

        const toMap = (arr) => {
          const map = {};
          arr.forEach((item) => {
            map[item.id] = item;
          });
          return map;
        };

        setStatuses(toMap(statusesData));
        setSeverities(toMap(severitiesData));
        setPriorities(toMap(prioritiesData));
        setTypes(toMap(typesData));
      } catch (err) {
        console.error(err);
        setError("Error carregant dades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  const sortedIssues = [...issues].sort((a, b) => {
    if (!sortField) return 0;
    let aValue, bValue;

    if (["severity", "priority", "type", "status"].includes(sortField)) {
      const map = {
        severity: severities,
        priority: priorities,
        type: types,
        status: statuses,
      }[sortField];
      aValue = getOrder(a[sortField], map);
      bValue = getOrder(b[sortField], map);
    } else if (sortField === "updated_at") {
      aValue = new Date(a.updated_at);
      bValue = new Date(b.updated_at);
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    return sortDirection === "asc"
      ? aValue < bValue ? -1 : 1
      : aValue > bValue ? -1 : 1;
  });

  if (loading) return <p>Carregant...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vista-issues">
      <div className="issues-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ margin: 0 }}>Llistat d'Issues</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-bulk-insert" onClick={() => setShowFilterModal(true)}>
            Filtrar
          </button>
          <button className="btn-bulk-insert" onClick={() => setShowModal(true)}>
            Bulk Insert
          </button>
          <button className="btn-new-issue" onClick={handleNewIssue}>
            + Nou Issue
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("type")}>Tipus</th>
            <th onClick={() => handleSort("severity")}>Severitat</th>
            <th onClick={() => handleSort("priority")}>Prioritat</th>
            <th onClick={() => handleSort("id_issue")}>ID</th>
            <th onClick={() => handleSort("title")}>Títol</th>
            <th onClick={() => handleSort("status")}>Estat</th>
            <th onClick={() => handleSort("updated_at")}>Modificat</th>
            <th>Assignat</th>
          </tr>
        </thead>
        <tbody>
          {sortedIssues.map((issue) => (
            <tr key={issue.id_issue}>
              <td data-label="Tipus">
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: types[issue.type]?.color || "#ccc",
                  marginRight: "6px",
                }}></span>
                {issue.type}
              </td>
              <td data-label="Severitat">
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: severities[issue.severity]?.color || "#ccc",
                  marginRight: "6px",
                }}></span>
                {issue.severity}
              </td>
              <td data-label="Prioritat">
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: priorities[issue.priority]?.color || "#ccc",
                  marginRight: "6px",
                }}></span>
                {issue.priority}
              </td>
              <td data-label="ID">{issue.id_issue}</td>
              <td data-label="Títol">{issue.title}</td>
              <td data-label="Estat">
                <span style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: statuses[issue.status]?.color || "#ccc",
                  marginRight: "6px",
                }}></span>
                {issue.status}
              </td>
              <td data-label="Modificat">{new Date(issue.updated_at).toLocaleDateString()}</td>
              <td data-label="Assignat">
                {issue.assigned_to ? (
                  <Link to={`/profile/${issue.assigned_to}`} className="link-profile">
                    {issue.assigned_to}
                  </Link>
                ) : (
                  "Sin assignar"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Bulk Insert */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Bulk Insert</h2>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={8}
              placeholder="Escriu un títol per línia..."
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            />
            {bulkError && <p style={{ color: "red" }}>{bulkError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => setShowModal(false)}>Cancel·lar</button>
              <button onClick={handleBulkInsert} className="btn-new-issue">Crear</button>
            </div>
          </div>
        </div>
      )}
        {showFilterModal && (
            <div className="modal-overlay">
            <div className="modal">
                <h2>Filtrar Issues</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input type="text" placeholder="Buscar (q)" value={filters.q}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
                <input type="text" placeholder="Estat" value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })} />
                <input type="text" placeholder="Prioritat" value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })} />
                <input type="number" placeholder="Creat per ID" value={filters.created_by}
                    onChange={(e) => setFilters({ ...filters, created_by: e.target.value })} />
                <input type="number" placeholder="Assignat a ID" value={filters.assigned_to}
                    onChange={(e) => setFilters({ ...filters, assigned_to: e.target.value })} />
                <input type="text" placeholder="Tipus" value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })} />
                <input type="text" placeholder="Severitat" value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })} />
                <input type="text" placeholder="Ordenar (ej: -created_at)" value={filters.order_by}
                    onChange={(e) => setFilters({ ...filters, order_by: e.target.value })} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem", gap: "1rem" }}>
                <button onClick={() => setShowFilterModal(false)}>Tancar</button>
                <button className="btn-new-issue" onClick={() => {
                    fetchFilteredIssues();
                    setShowFilterModal(false);
                }}>
                    Aplicar filtres
                </button>
                </div>
            </div>
            </div>
        )}
    </div>
  );
}
