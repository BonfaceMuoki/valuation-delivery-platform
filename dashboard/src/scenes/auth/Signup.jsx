import React from 'react'
import {
  Box,
  Stack,
  Checkbox,
  Grid,
  TextField,
  FormControlLabel,
  Paper,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material'
import { useState } from 'react';
import "../../assets/scss/auth.css"
import { Label, TextFieldsOutlined } from '@mui/icons-material';
import Image from 'mui-image';
import profileImage from "assets/profile.jpg";
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

function Signup() {
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  return (
    <Box display={'flex'} flexDirection={'column'}
          width={isNonMobile ? "50%" : "80%"}
          sx={{

            justifyContent: 'center',
            marginRight: '10%',
            marginLeft: '20%',
            borderColor: theme.palette.primary,
            borderRadius: '10px'
          }}  >

          <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >CREATE ACCOUNT</Typography>

          <Typography variant='p' sx={{ mb: 4 }} align='center' >Creating A company Account</Typography>
          <Typography sx={{ ml: 1 }}>Your Full Names</Typography>
          <TextField placeholder='Full Names' sx={{ m: 1 }} id="outlined-basic" fullWidth />
          <Typography sx={{ ml: 1 }}>Account Login Email</Typography>
          <TextField placeholder='Account Login Email' sx={{ m: 1 }} id="outlined-basic" fullWidth />
          <Typography sx={{ ml: 1 }}>Company Name</Typography>
          <TextField placeholder='Company Name' sx={{ m: 1 }} id="outlined-basic" fullWidth />
          <Grid container direction={isNonMobile ? 'row' : 'column'} >
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>Directors VRB Number</Typography>
          <TextField placeholder='Directors VRB Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" />
            </Grid>
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>ISK Number</Typography>
          <TextField placeholder='ISK Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" />
            </Grid>
          </Grid>
          <Typography sx={{ ml: 1 }}>Contact Phone Number</Typography>
          <TextField placeholder='Contact Phone Number'  sx={{ pl:1, mb:1 }} id="outlined-basic"  fullWidth/>
          
          <Grid container direction={isNonMobile ? 'row' : 'column'}  >
            <Grid item md={6}  sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }} >Password</Typography>
          <TextField type='password' placeholder='Password'  sx={{ pl: 1}} fullWidth id="outlined-basic" />
            </Grid>
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }} >Confirm Password</Typography>
          <TextField type='password' placeholder='Confirm Password' sx={{pl:1 }} fullWidth id="outlined-basic" />
            </Grid>
          </Grid>

          
          <Button
            variant='contained'
            sx={{ m: 2, backgroundColor: theme.palette.primary[800] }}
            size='large' >Login</Button>
          <Grid container direction={isNonMobile ? 'row' : 'column'} sx={{ m: 2 }} >
            <Grid item md={6} sm={12}>
              <Link to={'/login'} >Have an Account?  Login</Link>
            </Grid>
            <Grid item md={6} sm={12}>
              <Link to={'/forgot-password'}>Forgot password</Link>
            </Grid>
          </Grid>

        </Box>
  )
 
}

export default Signup;