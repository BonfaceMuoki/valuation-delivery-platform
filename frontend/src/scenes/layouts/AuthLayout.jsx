import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { setMode,setLightMode } from "state";


const Layout = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    dispatch(setLightMode("light"));

    return (
        <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
                        <Outlet />

        </Box>
    );
};

export default Layout;