import React, { useEffect } from 'react'
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
import { useSearchParams,useLocation } from 'react-router-dom';

import { useGetValuerInviteDetailsQuery } from 'features/retrieveValuerInviteSlice';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

function AcceptInviteSignup() {

  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  console.log(params.get("token"));
  const {data:retrieved,isError,error} = useGetValuerInviteDetailsQuery(params.get("token"));

  const schema = yup.object().shape({
   company_name: yup.string().required("Company Name is required"),
   full_name: yup.string().required("Your name is required"),
   vrb_number: yup.string().required("VRB Number is required"),
   isk_number: yup.string().required("ISK Number is required"),
   phone_number: yup.string().required("Phone number is required")
  });

  const {register: acceptInviteRegister, setValue: setInviteValue , formState:{ errors: acceptInvite}} = useForm({
    resolver: yupResolver(schema)
  });
useEffect(()=>{

  setInviteValue("company_name",retrieved?.valauaion_firm_name);
  setInviteValue("full_name",retrieved?.director_name);
  setInviteValue("email",retrieved?.invite_email);
  setInviteValue("vrb_number",retrieved?.vrb_number);
  setInviteValue("isk_number",retrieved?.isk_number);
},[]);




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



          <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >ACCEPT INVITE BY ACCOUNT CREATION.</Typography>

          <Typography variant='p' sx={{ mb: 4 }} align='center'>Creating A company Account</Typography>
          <Typography sx={{ ml: 1 }}>Your Full Names</Typography>
          <TextField placeholder='Full Names' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("full_name")} disabled />
          <Typography sx={{ ml: 1 }}>Account Login Email</Typography>
          <TextField placeholder='Account Login Email' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("email")} disabled />
          <Typography sx={{ ml: 1 }}>Company Name</Typography>
          <TextField placeholder='Company Name' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("company_name")} disabled />
          <Grid container direction={isNonMobile ? 'row' : 'column'} >
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>Directors VRB Number</Typography>
          <TextField placeholder='Directors VRB Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("vrb_number")} disabled />
            </Grid>
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>ISK Number</Typography>
          <TextField placeholder='ISK Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("isk_number")} disabled />
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

export default AcceptInviteSignup;