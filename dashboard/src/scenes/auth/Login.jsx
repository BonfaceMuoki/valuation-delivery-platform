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
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useGetUsersQuery } from 'features/authapi';
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

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


function Login() {
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const userId = useSelector((state)=>state.global.userId);
  const {data}= useGetUsersQuery();
  console.log("data "+data+ " userid"+userId);
  const schema = yup.object().shape({
    email:yup.string().required("Please provide your Username/Email"),
    password: yup.string().required("Please provide your Password.")
  });
  const {register,handleSubmit,formState : {errors} } = useForm({
    resolver: yupResolver(schema),
});
  const submitLoginForm = ()=>{
    alert({
      text: 'Notice me, senpai!',
    });
  }

  return (

        <Box display={'flex'} flexDirection={'column'}
          width={isNonMobile ? "50%" : "80%"}
          sx={{
            justifyContent: 'center',
            borderColor: theme.palette.primary,
          }}  >
<form className='form' name="loginform" onSubmit={handleSubmit(submitLoginForm)}>
          <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >LOGIN</Typography>
          <Typography sx={{ ml: 2 }}>Username</Typography>
          <Typography sx={{ ml: 2 }} className="errorp">{errors.email?.message}</Typography>
          <TextField placeholder='Username' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("email")} />     
          <Typography sx={{ ml: 2 }} >Password</Typography>
          <Typography sx={{ ml: 2 }} className="errorp">{errors.password?.message}</Typography>
          <TextField type='password' placeholder='Password' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("password")} />
          <Button
            type="submit"
            variant='contained'
            sx={{ m: 2, backgroundColor: theme.palette.primary[800], width:'100%' }}
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

export default Login