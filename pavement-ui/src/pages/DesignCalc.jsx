// pavement-ui/src/pages/DesignCalc.jsx
import { useMemo, useState } from "react";
import CalcForm from "../components/CalcForm";
import ResultCard from "../components/ResultCard";
import { validateField, validateAll } from "../utils/validation";

export default function DesignCalc() {
  const [form, setForm] = useState({
    cbr: "",
    msa: "",
    designLife: "20",
    pavementType: "flexible",
    foundationClass: "FC2",
    asphaltMaterial: "", // "", "HBGM", "AC_40_60", "EME2"
    fc2Option: "SUBBASE_ONLY_UNBOUND",
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // derive current validation state
  const errors = useMemo(() => validateAll(form), [form]);
  const hasErrors = useMemo(
    () => Object.values(errors).some((e) => !!e),
    [errors]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    // field-level validation feedback
    const err = validateField(name, value);
    setFieldErrors((fe) => ({ ...fe, [name]: err }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setResult(null);

    // final validation pass
    setTouched((t) => ({
      ...t,
      cbr: true,
      msa: true,
      designLife: true,
      pavementType: true,
      foundationClass: true,
      fc2Option: true,
    }));
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      return;
    }

    // build payload
    const payload = {
      cbr: Number(form.cbr),
      msa: Number(form.msa),
      designLife: Number(form.designLife),
      pavementType: form.pavementType,
      foundationClass: form.foundationClass,
      // omit asphaltMaterial for HBGM to trigger Eq 2.24 on backend
      ...(form.asphaltMaterial && form.asphaltMaterial !== "HBGM"
        ? { asphaltMaterial: form.asphaltMaterial }
        : {}),
      fc2Option: form.fc2Option,
    };

    // POST to API (use VITE_API_BASE if provided)
    const base = import.meta.env.VITE_API_BASE || "";
    const url = base ? `${base}/api/design/calculate` : "/api/design/calculate";

    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText} — ${text}`);
      }
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
      {submitError && (
        <p style={{ color: "red", marginTop: 12 }}>Error: {submitError}</p>
      )}
      {result && <ResultCard result={result} />}
    </div>
  );
}
