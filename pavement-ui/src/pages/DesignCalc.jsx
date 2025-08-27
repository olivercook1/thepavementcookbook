import { useState } from "react";
import { Typography, Stack, Button, Card, CardContent, Alert } from "@mui/material";
import CalcForm from "../components/CalcForm";
import ResultCard from "../components/ResultCard";

import { getHints, calculateDesign } from "../api/designService";
import { validateField, validateAll } from "../utils/validation";
import { normalizeLayers } from "../utils/layers";

import { API_BASE, httpText } from "../api/http";


export default function DesignCalc() {
  const [form, setForm] = useState({
  cbr: "", msa: "", designLife: "20", pavementType: "flexible",
     fc2Option: "SUBBASE_ONLY_UNBOUND",
  })




  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState(validateAll(form));
  const [health, setHealth] = useState("unknown");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
      return next;
    });
  }
  function onBlur(e) {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
  }

  const allErrors = validateAll(form);
  const hasErrors = Object.values(allErrors).some(Boolean);


 async function pingApi() {
  // Try both common health paths and show exact status/text
  const paths = ["/api/health", "/health"];
  for (const p of paths) {
    try {
      const res = await fetch(`${API_BASE}${p}`);
      const body = await res.text().catch(() => "");
      if (res.ok) {
        setHealth(body || "OK");
        return;
      }
      console.error(`Health ${p}: HTTP ${res.status} ${res.statusText}`, body);
    } catch (e) {
      console.error(`Health ${p} network error:`, e);
    }
  }
  setHealth("error");
}



  async function onSubmit(e) {
    e.preventDefault();
    setError(""); setResult(null);
    setFieldErrors(allErrors);
    setTouched({ cbr: true, trafficCategory: true, designLife: true, pavementType: true, fc2Option: true });
    if (hasErrors) { setError("Please fix the highlighted fields."); return; }

    try {
        const payload = {
        cbr: Number(form.cbr),
        msa: Number(form.msa),
        designLife: Number(form.designLife),
        pavementType: form.pavementType,
        fc2Option: form.fc2Option,
       
      };
      const data = await calculateDesign(payload);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not calculate (check API and CORS).");
    }
  }

  const layers = normalizeLayers(result);
  const totalDisplay = result?.totalThickness ?? (layers.length ? layers.reduce((s, l) => s + (l.thickness || 0), 0) : null);

  return (
    <>
      {/* Health / Check API */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
            <Typography><strong>Backend status:</strong> {health}</Typography>
            <Button variant="outlined" onClick={pingApi}>Check API</Button>
          </Stack>
          <Typography variant="caption" sx={{ mt: 1, display: "block", opacity: 0.75 }}>
            Using API base: <code>{API_BASE}</code>
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>DMRB Input</Typography>

      <CalcForm
        form={form}
        fieldErrors={fieldErrors}
        touched={touched}
        hasErrors={hasErrors}
        onChange={onChange}
        onBlur={onBlur}
        onSubmit={onSubmit}
      />

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <ResultCard result={result} layers={layers} totalDisplay={totalDisplay} />
    </>
  );
}
