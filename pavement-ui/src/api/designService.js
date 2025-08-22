// src/api/designService.js
import { http } from "./http";

export function getHints() {
  return http("/api/design/hints");
}

export function calculateDesign(payload) {
  return http("/api/design/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
