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


function Login() {
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



          <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >LOGIN</Typography>

          <Typography variant='p' sx={{ mb: 4 }} align='center' >Please Login to continue</Typography>
          <Typography sx={{ ml: 2 }}>Username</Typography>
          <TextField placeholder='Username' sx={{ m: 2 }} id="outlined-basic" />
          <Typography sx={{ ml: 2 }} >Password</Typography>
          <TextField type='password' placeholder='Password' sx={{ m: 2 }} id="outlined-basic" />
          <Button
            variant='contained'
            sx={{ m: 2, backgroundColor: theme.palette.primary[800] }}
            size='large' >Login</Button>
          <Grid container direction={isNonMobile ? 'row' : 'column'} sx={{ m: 2 }} >
            <Grid md={6} >
              <Link to={'/signup'} >Create Account</Link>
            </Grid>
            <Grid md={6}>
              <Link to={'/forgot-password'}>Forgot password</Link>
            </Grid>
          </Grid>

        </Box>
  )
}

export default Login