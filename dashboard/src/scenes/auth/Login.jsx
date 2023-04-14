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

  const userId = useSelector((state)=>state.global.userId);
  const {data}= useGetUsersQuery();
  console.log("data "+data+ " userid"+userId);
  const schema = yup.object().shape({
    email:yup.string().required(),
    password: yup.string().required()
  });
  const {register,handleSubmit,formState : {errors} } = useForm({
    resolver: yupResolver(schema),
});
  const submitLoginForm = ()=>{
    alert("submit?");
  }

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
<form className='form' name="loginform" onSubmit={handleSubmit(submitLoginForm)}>


          <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >LOGIN</Typography>

          {/* <Typography variant='p' sx={{ mb: 2 }} align='center'  fullWidth>Please Login to continue</Typography> */}
          <Typography sx={{ ml: 2 }}>Username</Typography>
          <TextField placeholder='Username' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("email")} />
          <p className="errorp">{errors.email?.message}</p><br/>
          <Typography sx={{ ml: 2 }} >Password</Typography>
          <TextField type='password' placeholder='Password' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("password")} />
          <p className="errorp">{errors.password?.message}</p><br/>
          <br/>
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