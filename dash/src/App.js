import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Layout from "./layout/Index";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./auth/Login";
import RequestValuerAccesor from "./auth/Signup";
import RequestAccesorAccess from "./auth/SigninAccesor";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./layout/provider/Theme";
import ProtectedRoutes from "./auth/routes/ProtectedRoutes";
import UserProfileRegularPage from "./pages/adminProfile/UserProfileRegular";
import ValuerDashboard from "./pages/ValuerDashboard";
import AccesorDashboard from "./pages/AccesorDashboard";
import AcceptAccesorInviteSignup from "./auth/AcceptAccesorInviteSignup"; 
import LayoutNoSidebar from "./layout/Index-nosidebar";
import AcceptInviteSignup from "./auth/AcceptInviteSignup";
import ReportSubmit from "./pages/valuerspages/ReportSubmit";
import MapWithAutoSearch from "./pages/valuerspages/MapWithAutoSearch";



const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route element={<LayoutNoSidebar />}>
              <Route path="/login" element={<Login />} />
              <Route path="/request-valuer-access" element={<RequestValuerAccesor/>} />
              <Route path="/request-accesor-access" element={<RequestAccesorAccess/>} />
              <Route path="/complete-accesor-invite-by-registering" element={<AcceptAccesorInviteSignup/>} />    
              <Route path="/complete-invite-by-registering"   element={<AcceptInviteSignup />}/>
            
              
              {/* <Route path="/upload-new-report"  element={<MapWithAutoSearch />}></Route> */}
                   
            </Route>
            <Route element={<ProtectedRoutes />}>
            <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
              <Route index element={<Homepage />}></Route>
              <Route path="/admin-profile" element={<UserProfileRegularPage/>}></Route>
              <Route path="/valuer-dashboard"  element={<ValuerDashboard />}></Route>
              <Route path="/upload-new-report"  element={<ReportSubmit />}></Route>              
              <Route path="/accesor-dashboard"  element={<AccesorDashboard />}></Route>
            </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
