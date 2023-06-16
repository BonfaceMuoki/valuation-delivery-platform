import React,{ useRef }  from 'react'
import {
  Box,
  Grid,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material'
import { useState } from 'react';
import "../../assets/scss/auth.css"
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { useSendForgotPasswordMutation } from './authApiSlice';
import { ArrowForwardOutlined } from '@mui/icons-material';

// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;
defaultModules.set(PNotifyMobile, {});


function ForgotPassword() {

  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  // const { data } = useGetUsersQuery();
  const schema = yup.object().shape({
    email: yup.string().required("Please provide your Username/Email")
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = React.useState(false);

  const [resetPassword, { isLoading }] = useSendForgotPasswordMutation();
  const navigate = useNavigate();

  const  submitLoginForm = async (data) => {
    // setOpen(true);
    // setOpen(false);
    let formData= new FormData();
    const token = captchaRef.current.getValue();
    let email=data.email;
    let password = data.password;
    let recaptcha_token = token;
    let reset_link=`${frontendbaseurl}/reset-user-password`;
    const userData = await resetPassword({ email, password,recaptcha_token,reset_link }).unwrap()
   
    
 
  }
  
  return (




    <Box display={'flex'} flexDirection={'column'}
      width={isNonMobile ? "50%" : "80%"}
      sx={{
        justifyContent: 'center',
        borderColor: theme.palette.primary,
      }}  >
      <ToastContainer />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}

      > <CircularProgress color="inherit" />  </Backdrop>
      <form className='form' name="loginform" onSubmit={handleSubmit(submitLoginForm)}>
        <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >RESET ACCOUNT PASSWORD</Typography>
        <Typography sx={{ ml: 2 }}>Your Login Email</Typography>
        <Typography sx={{ ml: 2 }} className="errorp">{errors.email?.message}</Typography>
        <TextField placeholder='Email' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("email")} />
        <ReCAPTCHA
          className="recaptcha"
          sitekey={SITE_KEY}
          ref={captchaRef}
        />
        <Button
          type="submit"
          variant='contained'
          sx={{ m: 2, backgroundColor: theme.palette.primary[700], width: '100%' }}
          size='large' >Send Reset Link</Button>
              
        <Grid container direction={isNonMobile ? 'row' : 'column'} sx={{ m: 2 }} >
          <Grid item md={6} >
            <Link to={'/request-valuer-access'} >Request Valuer access </Link>
          </Grid>
          <Grid item md={6} >
            <Link to={'/request-accesor-access'} >Request Lender or Court Access</Link>
          </Grid>

        </Grid>
        <Grid container direction={isNonMobile ? 'row' : 'column'} sx={{ m: 2 }} >
        <Grid item md={12} display="flex" justifyContent="center">
           <p>Remembered Password ?</p>
          </Grid>
          <Grid item md={12} display="flex" justifyContent="center">
            <Link to={'/login'} >Please proceed to Login </Link><ArrowForwardOutlined/>
          </Grid>
        </Grid>

          
      </form>
    </Box>

  )
}

export default ForgotPassword