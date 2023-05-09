import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentRoles } from '../authSlice';
import {toast } from 'react-toastify';

function AuthorizeRoute({checkrole}) {
    const roles = useSelector(selectCurrentRoles); 
    const location = useLocation();
  return (
    (roles.find(c => c.name ===checkrole))? <Outlet /> :     <Navigate to="/unauthorized" state={{ from: location }} replace />
  )
}

export default AuthorizeRoute