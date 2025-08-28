import { useEffect, useMemo, useState } from "react";
import CalcForm from "../components/CalcForm";
import ResultCard from "../components/ResultCard";
import { validateField, validateAll } from "../utils/validation";

function ApiStatusBar() {
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [status, setStatus] = useState("checking…");

  useEffect(() => {
    let cancelled = false;
    const urls = ["/actuator/health", "/api/design/health", "/api/health"]
      .map((p) => (API_BASE ? `${API_BASE}${p}` : p));
    (async () => {
      for (const u of urls) {
        try {
          const r = await fetch(u);
          if (!cancelled && r.ok) { setStatus("OK"); return; }
        } catch {}
      }
      if (!cancelled) setStatus(API_BASE ? "unreachable" : "proxy mode");
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>
      API: <code>{import.meta.env.VITE_API_BASE || "(same origin proxy)"}</code> — {status}
    </div>
  );
}

export default function DesignCalc() {
  const [form, setForm] = useState({
    cbr: "",
    msa: "",
    designLife: "20",
    pavementType: "flexible",
    foundationClass: "FC2",
    asphaltMaterial: "HBGM", // default selected so label never overlaps
    fc2Option: "SUBBASE_ONLY_UNBOUND",
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const errors = useMemo(() => validateAll(form), [form]);
  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setFieldErrors((fe) => ({ ...fe, [name]: validateField(name, value) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setResult(null);

    setTouched((t) => ({
      ...t,
      cbr: true, msa: true, designLife: true,
      pavementType: true, foundationClass: true, fc2Option: true,
    }));
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      cbr: Number(form.cbr),
      msa: Number(form.msa),
      designLife: Number(form.designLife),
      pavementType: form.pavementType,
      foundationClass: form.foundationClass,
      ...(form.asphaltMaterial && form.asphaltMaterial !== "HBGM"
        ? { asphaltMaterial: form.asphaltMaterial }
        : {}),
      fc2Option: form.fc2Option,
    };

    const base = import.meta.env.VITE_API_BASE || "";
    const url = base ? `${base}/api/design/calculate` : "/api/design/calculate";

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setSubmitError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ApiStatusBar />

      <CalcForm
        form={form}
        fieldErrors={fieldErrors}
        touched={touched}
        hasErrors={hasErrors || loading}
        onChange={onChange}
        onBlur={onBlur}
        onSubmit={onSubmit}
      />

      {loading && <p>Calculating…</p>}
      {submitError && <p style={{ color: "red", marginTop: 12 }}>Error: {submitError}</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}
