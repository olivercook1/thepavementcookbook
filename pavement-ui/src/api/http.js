// src/api/http.js
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function http(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export async function httpText(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { ...opts }); // no default Accept
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}
