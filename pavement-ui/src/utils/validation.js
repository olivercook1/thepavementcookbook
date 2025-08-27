// src/utils/validation.js

const TYPES = ["flexible", "composite", "rigid"];
const FC2_OPTIONS = [
  "SUBBASE_ONLY_UNBOUND",
  "SUBBASE_ONLY_BOUND",
  "SUBBASE_ON_CAP_UNBOUND",
  "SUBBASE_ON_CAP_BOUND",
  "SUBBASE_ON_BOUND_CAP_UNBOUND",
  "SUBBASE_ON_BOUND_CAP_BOUND",
];

export function validateField(name, value) {
  switch (name) {
    case "cbr": {
      const n = Number(value);
      if (Number.isNaN(n)) return "CBR is required";
      if (n < 0.5) return "CBR must be ≥ 0.5";
      if (n > 30) return "CBR must be ≤ 30";
      return undefined;
    }

    case "msa": {
      if (value === "" || value === null || value === undefined) return "Required";
      const n = Number(value);
      if (!Number.isFinite(n)) return "Enter a number";
      if (n < 0) return "Must be ≥ 0";
      if (n > 4000) return "Unusually high";
      return undefined;
    }

    case "designLife": {
      const n = Number(value);
      if (!value) return "designLife is required";
      if (!Number.isInteger(n)) return "designLife must be an integer";
      if (n < 10) return "designLife must be ≥ 10";
      if (n > 60) return "designLife must be ≤ 60";
      return undefined;
    }

    case "pavementType": {
      if (!value) return "pavementType is required";
      if (!TYPES.includes(value)) return "pavementType must be flexible, composite, or rigid";
      return undefined;
    }

    case "fc2Option": {
      if (!value) return "fc2Option is required";
      if (!FC2_OPTIONS.includes(value)) return "Invalid fc2Option";
      return undefined;
    }

    default:
      return undefined;
  }
}

export function validateAll(form) {
  return {
    cbr: validateField("cbr", form.cbr),
    msa: validateField("msa", form.msa),
    designLife: validateField("designLife", form.designLife),
    pavementType: validateField("pavementType", form.pavementType),
    fc2Option: validateField("fc2Option", form.fc2Option),
  };
}
