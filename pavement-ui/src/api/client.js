const API_BASE = import.meta.env.VITE_API_BASE;

export async function getHints() {
  const r = await fetch(`${API_BASE}/api/design/hints`, { headers:{Accept:'application/json'} });
  if (!r.ok) throw new Error(`Hints ${r.status}`);
  return r.json();
}

export async function calculateDesign(payload) {
  const r = await fetch(`${API_BASE}/api/design/calculate`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Accept:'application/json'},
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Calculate ${r.status}`);
  return r.json();
}
