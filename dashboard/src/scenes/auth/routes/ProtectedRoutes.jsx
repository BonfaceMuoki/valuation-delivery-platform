import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
function ProtectedRoutes() {
    const [isLogged, setIsLogged] = useState(false);
    if (isLogged) {
        return <Outlet/>
    } else {
        return <Navigate to="/login" replace />;
    }


}

export default ProtectedRoutes