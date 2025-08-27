 import { Outlet, Link, useLocation } from "react-router-dom";
 import { AppBar, Toolbar, Typography, Container, Button, Stack } from "@mui/material";
 import { ThemeToggle } from "../theme";

 export default function Layout() {
   const { pathname } = useLocation();
   const isCalc = pathname === "/";

   return (
     <>
       <AppBar position="static">
         <Toolbar>
           <Typography variant="h6" sx={{ flexGrow: 1 }}>Pavement Cookbook</Typography>
           <Stack direction="row" spacing={1} alignItems="center">
             <Button component={Link} to="/" color="inherit" variant={isCalc ? "outlined" : "text"}>
               Calculate
             </Button>
             <Button component={Link} to="/hints" color="inherit" variant={!isCalc ? "outlined" : "text"}>
               Hints
             </Button>

             <Button onClick={() => document.documentElement.setAttribute("data-theme", "retro")}>
  Retro
</Button>

              <ThemeToggle />
           </Stack>
         </Toolbar>
       </AppBar>
       <Container maxWidth="md" sx={{ py: 4 }}>
         <Outlet />
       </Container>
     </>
   );
 }
