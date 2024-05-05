import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentPermissions, selectCurrentRoles } from "../../featuers/authSlice";

function AuthorizeRoute({ checkpermission }) {
  const location = useLocation();
  console.log(checkpermission, "checkpermissioncheckpermission");
  const roles = useSelector(selectCurrentRoles);
  const permissions = useSelector(selectCurrentPermissions);
  console.log(permissions, "permissionspermissions");
  // Check if any permission in checkpermission array exists in user's permissions
  const hasPermission = Array.isArray(checkpermission)
    ? checkpermission.some((cp) => permissions.find((p) => p.name === cp))
    : permissions.find((p) => p.name === checkpermission);
  return hasPermission ? <Outlet /> : <Navigate to="/unauthorized" state={{ from: location }} replace />;
}

export default AuthorizeRoute;
