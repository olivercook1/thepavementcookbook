// src/utils/layers.js
export function normalizeLayers(result) {
  if (!result) return [];

  if (Array.isArray(result.layers)) {
    return result.layers
      .map(l => {
        const name = l.name || l.layerName || l.type || "Layer";
        const t = l.thicknessMm ?? l.thickness ?? l.mm ?? l.thickness_mm;
        return t ? { name, thickness: Number(t) } : null;
      })
      .filter(Boolean);
  }

  const mapKeys = [
    { key: "surfaceMm", name: "Surface" },
    { key: "surfacingMm", name: "Surface" },
    { key: "wearingCourseMm", name: "Surface" },
    { key: "binderMm", name: "Binder" },
    { key: "binderCourseMm", name: "Binder" },
    { key: "baseMm", name: "Base" },
    { key: "subBaseMm", name: "Sub-base" },
    { key: "subbaseMm", name: "Sub-base" },
    { key: "cappingMm", name: "Capping" },
    { key: "cbgmMm", name: "CBGM" },
  ];
  const keyed = mapKeys
    .map(({ key, name }) => {
      const v = result[key];
      return (v || v === 0) ? { name, thickness: Number(v) } : null;
    })
    .filter(Boolean);
  if (keyed.length) return keyed;

  const txt = result.recommendedStructure || result.structure || "";
  if (typeof txt === "string" && txt) {
    const parts = [];
    const re = /(\d+(?:\.\d+)?)\s*(?:mm)?\s*([A-Za-z][A-Za-z \-_/]+)/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const mm = Number(m[1]);
      const raw = m[2].toLowerCase();
      let name = "Layer";
      if (/(sma|surface|wearing|hra|tsr)/.test(raw)) name = "Surface";
      else if (/binder/.test(raw)) name = "Binder";
      else if (/base/.test(raw)) name = "Base";
      else if (/sub[- ]?base|type *1/.test(raw)) name = "Sub-base";
      else if (/cap|capping/.test(raw)) name = "Capping";
      else if (/cbgm|cement bound/.test(raw)) name = "CBGM";
      parts.push({ name, thickness: mm });
    }
    if (parts.length) return parts;
  }

  return [];
}
