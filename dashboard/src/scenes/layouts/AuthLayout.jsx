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
import BGIMAGE from "../../assets/bg5.jpg"
const AuthLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();

  const styles = {
    heroContainer: {
      height: "100%;",
      backgroundImage: `url(${BGIMAGE})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: `calc(100vw + 48px)`,
      margin: -24,
      padding: 24,
    }
   };


  return (
    
    <Grid container  >
      <Grid
        container item md={6}
        direction="column"
        display={isNonMobile ? "block;" : "none;"}
        style={styles.heroContainer} 
             >
      </Grid>
      <Grid container item xs={12} md={6} direction="column" gap={5} alignContent={'center'} height={'100vh'} sx={{ justifyContent: 'center' }} >
        <Outlet />
      </Grid>

    </Grid>
  );
};

export default AuthLayout;