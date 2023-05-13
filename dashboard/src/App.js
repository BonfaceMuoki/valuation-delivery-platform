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
import AdminDashboard from "scenes/Dashboard/AdminDashboard";
import AccesorDashboard from "scenes/Dashboard/AccesorDashboard";
import AdminValuationReports from "scenes/reports/AdminValuationReports";
import RolesTable from "scenes/settings/RolesTable";
import PermissionsTable from "scenes/settings/PermissionsTable";
import RolePermissionTable from "scenes/settings/RolePermissionTable";
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
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view valuer dashbaord" />
                  }
                >
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view valuer dashbaord" />
                  }
                >
                  <Route path="/dashboard" element={<ValuerDashboard />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view super admin dashbaord" />
                  }
                >
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view all reports" />
                  }
                >
                  <Route path="/all-valuation-reports" element={<AdminValuationReports />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view valuation firms" />
                  }
                >
                  <Route path="/valuation-firms" element={<AdminValuationReports />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view accesors" />
                  }
                >
                  <Route path="/report-consumers" element={<AdminValuationReports />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view accesors" />
                  }
                >
                  <Route path="/roles" element={<RolesTable />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view accesors" />
                  }
                >
                  <Route path="/permissions" element={<PermissionsTable />} />
                </Route>
                <Route
                  element={
                    <AuthorizeRoute checkpermission="view accesors" />
                  }
                >
                  <Route path="/role-permissions" element={<RolePermissionTable />} />
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
