// pavement-ui/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DesignCalc from "./pages/DesignCalc";
import Hints from "./pages/Hints";

// keep your retro CSS import if you had it here:
import "./styles/retro-theme.css";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DesignCalc />} />
        <Route path="hints" element={<Hints />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
