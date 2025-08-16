import { useState } from "react";

const TC_OPTIONS = ["2", "3", "4", "5"];
const TYPES = ["flexible", "composite", "rigid"];

// Read API base from Vite env (falls back to localhost if unset)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function validateField(name, value) {
  switch (name) {
    case "cbr": {
      const n = Number(value);
      if (Number.isNaN(n)) return "CBR is required";
      if (n < 0.5) return "CBR must be ≥ 0.5";
      if (n > 30) return "CBR must be ≤ 30";
      return undefined;
    }
    case "trafficCategory":
      if (!value) return "trafficCategory is required";
      if (!TC_OPTIONS.includes(value)) return "trafficCategory must be 2, 3, 4 or 5";
      return undefined;
    case "designLife": {
      const n = Number(value);
      if (!value) return "designLife is required";
      if (!Number.isInteger(n)) return "designLife must be an integer";
      if (n < 10) return "designLife must be ≥ 10";
      if (n > 60) return "designLife must be ≤ 60";
      return undefined;
    }
    case "pavementType":
      if (!value) return "pavementType is required";
      if (!TYPES.includes(value)) return "pavementType must be flexible, composite, or rigid";
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(form) {
  return {
    cbr: validateField("cbr", form.cbr),
    trafficCategory: validateField("trafficCategory", form.trafficCategory),
    designLife: validateField("designLife", form.designLife),
    pavementType: validateField("pavementType", form.pavementType),
  };
}

export default function App() {
  const [form, setForm] = useState({
    cbr: "",
    trafficCategory: "",
    designLife: "20",
    pavementType: "flexible",
  });

  const [touched, setTouched] = useState({});
  const initialErrors = validateAll(form);
  const [fieldErrors, setFieldErrors] = useState(initialErrors);

  const [health, setHealth] = useState("unknown");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
      return next;
    });
  }

  function onBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function invalidStyle(name) {
    const show = touched[name] || form[name] !== "";
    return fieldErrors[name] && show ? { borderColor: "#b00020", outline: "none" } : {};
  }

  const allErrors = validateAll(form);
  const hasErrors = Object.values(allErrors).some(Boolean);

  async function pingApi() {
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const text = await res.text();
      setHealth(text);
    } catch {
      setHealth("error");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    setFieldErrors(allErrors);
    setTouched({ cbr: true, trafficCategory: true, designLife: true, pavementType: true });
    if (hasErrors) {
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      const payload = {
        cbr: Number(form.cbr),
        trafficCategory: form.trafficCategory,
        designLife: Number(form.designLife),
        pavementType: form.pavementType,
      };

      const res = await fetch(`${API_BASE}/api/design/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setError(`Request failed (HTTP ${res.status}).`);
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not calculate (check API is running and CORS is set).");
      console.error(err);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>Pavement Design Prototype</h1>

      <div style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd" }}>
        <p><strong>Backend status:</strong> {health}</p>
        <button type="button" onClick={pingApi} style={{ padding: "8px 12px" }}>
          Check API
        </button>
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
          Using API base: <code>{API_BASE}</code>
        </p>
      </div>

      <form onSubmit={onSubmit} aria-labelledby="formTitle" noValidate>
        <h2 id="formTitle" style={{ fontSize: 20, marginBottom: 16 }}>DMRB Input</h2>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="cbr">Subgrade CBR (%)</label>
          <input
            id="cbr"
            name="cbr"
            type="number"
            step="0.1"
            min="0.5"
            max="30"
            required
            value={form.cbr}
            onChange={update}
            onBlur={onBlur}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4, ...invalidStyle("cbr") }}
            aria-invalid={!!fieldErrors.cbr}
            aria-describedby={fieldErrors.cbr ? "cbr-error" : undefined}
          />
          {fieldErrors.cbr && (touched.cbr || form.cbr !== "") && (
            <div id="cbr-error" style={{ color: "#b00020", marginTop: 4 }}>{fieldErrors.cbr}</div>
          )}
          <small>Typical range 1–15 (enter site value).</small>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="trafficCategory">Traffic category</label>
          <select
            id="trafficCategory"
            name="trafficCategory"
            required
            value={form.trafficCategory}
            onChange={update}
            onBlur={onBlur}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4, ...invalidStyle("trafficCategory") }}
            aria-invalid={!!fieldErrors.trafficCategory}
            aria-describedby={fieldErrors.trafficCategory ? "tc-error" : undefined}
          >
            <option value="" disabled>Choose…</option>
            {TC_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {fieldErrors.trafficCategory && (touched.trafficCategory || form.trafficCategory !== "") && (
            <div id="tc-error" style={{ color: "#b00020", marginTop: 4 }}>{fieldErrors.trafficCategory}</div>
          )}
          <small>Pick the DMRB traffic category for the scheme.</small>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="designLife">Design life (years)</label>
          <input
            id="designLife"
            name="designLife"
            type="number"
            min="10"
            max="60"
            required
            value={form.designLife}
            onChange={update}
            onBlur={onBlur}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4, ...invalidStyle("designLife") }}
            aria-invalid={!!fieldErrors.designLife}
            aria-describedby={fieldErrors.designLife ? "life-error" : undefined}
          />
          {fieldErrors.designLife && (touched.designLife || form.designLife !== "") && (
            <div id="life-error" style={{ color: "#b00020", marginTop: 4 }}>{fieldErrors.designLife}</div>
          )}
        </div>

        <fieldset style={{ marginBottom: 16, border: "1px solid #eee", padding: 8 }}>
          <legend>Pavement type</legend>
          {TYPES.map((t) => (
            <label key={t} style={{ display: "block", marginBottom: 6 }}>
              <input
                type="radio"
                name="pavementType"
                value={t}
                checked={form.pavementType === t}
                onChange={update}
                onBlur={onBlur}
              />{" "}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
          {fieldErrors.pavementType && (touched.pavementType || form.pavementType !== "") && (
            <div style={{ color: "#b00020", marginTop: 4 }}>{fieldErrors.pavementType}</div>
          )}
        </fieldset>

        <button type="submit" style={{ padding: "10px 16px" }} disabled={hasErrors}>
          Calculate
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 16, color: "#b00020" }} role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
          <h3 style={{ marginTop: 0 }}>Result</h3>
          <p><strong>Recommended structure:</strong> {result.recommendedStructure}</p>
          <p><strong>Total thickness (mm):</strong> {result.totalThickness}</p>
          <p><strong>Clause reference:</strong> {result.clauseReference}</p>
        </div>
      )}
    </main>
  );
}
