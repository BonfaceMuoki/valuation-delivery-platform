import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "./scenes/layouts/Layout";
import AuthLayout from "./scenes/layouts/AuthLayout";
import ValuerDashboard from "./scenes/Dashboard/ValuerDashboard";
import Unauthorized from "scenes/auth/Unauthorized";

import Login from "./scenes/auth/Login";
import Signup from "./scenes/auth/Signup";
import ProtectedRoutes from "scenes/auth/routes/ProtectedRoutes";
import AuthorizeRoute from "scenes/auth/routes/AuthorizeRoute";
function App() {
  const mode = useSelector((state) => state.auth.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route element={<Layout />}>
              <Route path="/unauthorized" element={<Unauthorized />} />
                <Route element={<AuthorizeRoute checkrole="Report Uploader" />}>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>
                <Route element={<AuthorizeRoute checkrole="Report Uploader" />}>
                  <Route path="/dashboard" element={<ValuerDashboard />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
