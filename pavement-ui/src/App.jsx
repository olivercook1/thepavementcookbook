import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import DesignCalc from "./pages/DesignCalc";
import Hints from "./pages/Hints";

import "../styles/retro-theme.css";
import { ThemeToggle } from "../theme";
// optional font package: import "@fontsource/press-start-2p";
import Script from "next/script";

export const metadata = { title: "The Pavement Cookbook" };

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('theme');
             if(t) document.documentElement.setAttribute('data-theme', t);}catch(e){}`}
        </Script>
        <ThemeToggle />
        <main className="use-pixel-font">{children}</main>
      </body>
    </html>
  );
}

}

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
