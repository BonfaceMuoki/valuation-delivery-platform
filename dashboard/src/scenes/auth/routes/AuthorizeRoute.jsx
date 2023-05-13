import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentPermissions, selectCurrentRoles } from '../authSlice';
import {toast } from 'react-toastify';

function AuthorizeRoute({checkpermission}) {
    // const roles = useSelector(selectCurrentRoles); 
    const permissions = useSelector(selectCurrentPermissions); 
    const location = useLocation();
    // console.log(permissions.find(p => p.name ===checkpermission));
  return (
    (permissions.find(p => p.name ===checkpermission))? <Outlet /> :     <Navigate to="/unauthorized" state={{ from: location }} replace />
  )
}

export default AuthorizeRoute