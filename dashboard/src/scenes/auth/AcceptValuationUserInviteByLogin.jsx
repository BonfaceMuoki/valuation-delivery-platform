import React from 'react'
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
import { Link, Navigate, useNavigate, useSearchParams,useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from "react-redux";

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
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice'; 
import { useGetValuerInviteDetailsQuery } from 'features/retrieveValuerInviteSlice';

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


function AcceptValuationUserInviteByLogin() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    

   console.log(params.get("token"));

   const {data:retrieved,isError,error} = useGetValuerInviteDetailsQuery(params.get("token"));

   console.log(retrieved);

  const dispatch = useDispatch();
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  // const { data } = useGetUsersQuery();
  const schema = yup.object().shape({
    email: yup.string().required("Please provide your Username/Email"),
    password: yup.string().required("Please provide your Password.")
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = React.useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const  submitLoginForm = async (data) => {
    // setOpen(true);
    // setOpen(false);
    let formData= new FormData();
    formData.append("email",data.email);
    formData.append("password",data.password);
    let email=data.email;
    let password = data.password;
    const userData = await login({ email, password }).unwrap()
    dispatch(setCredentials({ ...userData, email }));
    console.log(userData.role.name);
    if(userData.role.name==="Super Admin"){
      navigate('/admin-dashboard')
    }else if(userData.role.name==="Report Uploader"){
      navigate('/dashbaord')
    }else if(userData.role.name==="Report Accesor"){
      navigate('/dashbaord')
    }
    
    
 
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
        <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >LOGIN TO ACCEPT INVITE</Typography>
       
        <Typography sx={{ ml: 2 }}>Username</Typography>
        <Typography sx={{ ml: 2 }} className="errorp">{errors.email?.message}</Typography>
        <TextField placeholder='Username' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("email")} />
        <Typography sx={{ ml: 2 }} >Password</Typography>
        <Typography sx={{ ml: 2 }} className="errorp">{errors.password?.message}</Typography>
        <TextField type='password' placeholder='Password' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("password")} />


        <Button
          type="submit"
          variant='contained'
          sx={{ m: 2, backgroundColor: theme.palette.primary[700], width: '100%' }}
          size='large' >Login</Button>
        <Grid container direction={isNonMobile ? 'row' : 'column'} sx={{ m: 2 }} >
          <Grid item md={6} >
            <Link to={'/signup'} >Create Account</Link>
          </Grid>
          <Grid item md={6}>
            <Link to={'/forgot-password'}>Forgot password</Link>
          </Grid>
        </Grid>
      </form>
    </Box>

  )
}

export default AcceptValuationUserInviteByLogin