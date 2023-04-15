import React from 'react'
import {
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import "../../assets/scss/auth.css"
import Image from 'mui-image';
import profileImage from "assets/profile.jpg";
import { Outlet } from 'react-router-dom';
const AuthLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  return (
    
    <Grid container spacing={2} >
      <Grid
        container item md={6}
        direction="column"
        display={isNonMobile ? "block" : "none"}
        height={isNonMobile ? "100vh" : "0px"}
        backgroundColor={theme.palette.grey[200]}
      >
      </Grid>
      <Grid container item xs={12} md={6} direction="column" gap={5} alignContent={'center'} height={'100vh'} sx={{ justifyContent: 'center' }} >
        <Outlet />
      </Grid>

    </Grid>
  );
};

export default AuthLayout;