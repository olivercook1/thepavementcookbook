import { Outlet, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Button, Stack, Divider } from "@mui/material";
import { useEffect, useState } from "react";

export default function Layout() {
  const { pathname } = useLocation();
  const isCalc = pathname === "/";
  const [theme, setTheme] = useState("modern");

  function applyTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    localStorage.setItem("theme", name);
    setTheme(name);
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    applyTheme(saved || "modern");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pavement Cookbook
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={Link} to="/" color="inherit" variant={isCalc ? "outlined" : "text"}>
              Calculate
            </Button>
            <Button component={Link} to="/hints" color="inherit" variant={!isCalc ? "outlined" : "text"}>
              Hints
            </Button>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.4 }} />

            <Button
              size="small"
              variant={theme === "modern" ? "contained" : "outlined"}
              onClick={() => applyTheme("modern")}
            >
              Modern
            </Button>
            <Button
              size="small"
              variant={theme === "retro" ? "contained" : "outlined"}
              onClick={() => applyTheme("retro")}
            >
              Retro
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
