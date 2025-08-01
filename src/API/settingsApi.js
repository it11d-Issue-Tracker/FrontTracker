import axios from "axios";

const API_BASE_URL = "https://backtracker-3hat.onrender.com";

export const fetchStatuses = async (apiKey) => {
  const res = await axios.get(`${API_BASE_URL}/settings/status`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  return res.data;
};

export const fetchSeverities = async (apiKey) => {
  const res = await axios.get(`${API_BASE_URL}/settings/severity`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  return res.data;
};

export const fetchPriorities = async (apiKey) => {
  const res = await axios.get(`${API_BASE_URL}/settings/priority`, {
    headers: { Authorization: `Token ${apiKey}` },
  });
  return res.data;
};

export const fetchTypes = async (apiKey) => {
    const res = await axios.get(`${API_BASE_URL}/settings/type`, {
      headers: { Authorization: `Token ${apiKey}` },
    });
    return res.data;
};

export async function fetchSettings(apiKey) {
  const res = await axios.get("https://backtracker-3hat.onrender.com/settings/", {
    headers: { Authorization: `Token ${apiKey}` },
  });
  return res.data;
}


