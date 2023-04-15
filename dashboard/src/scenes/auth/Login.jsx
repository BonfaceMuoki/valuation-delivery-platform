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
import { useGetUsersQuery,useLoginUserMutation } from 'features/authapi';
import { useSelector } from "react-redux";

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
  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUsersQuery();
  const schema = yup.object().shape({
    email: yup.string().required("Please provide your Username/Email"),
    password: yup.string().required("Please provide your Password.")
  });
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [addNewPost, response] = useLoginUserMutation();
  const [open, setOpen] = React.useState(false);
  const submitLoginForm = (data) => {
    // setOpen(true);
    // setOpen(false);
    let formData= new FormData();
    formData.append("image",image);
    formData.append("email",data.email);
    formData.append("password",data.password);

    addNewPost(formData)
      .unwrap()
      .then((response) => {
        console.log(response);
      })
      .then((error) => {
        console.log(error)
      })
    toast.success('Success Notification !', {
      position: toast.POSITION.TOP_RIGHT
    });
  }
  //upload image
  const [image,setImage]=useState();
  const handleImage=(e)=>{     
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);

  }
 
  //upload image
  
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
        <Typography variant='h2' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >LOGIN</Typography>
        <Typography sx={{ ml: 2 }}>Username</Typography>
        <Typography sx={{ ml: 2 }} className="errorp">{errors.email?.message}</Typography>
        <TextField placeholder='Username' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("email")} />
        <Typography sx={{ ml: 2 }} >Password</Typography>
        <Typography sx={{ ml: 2 }} className="errorp">{errors.password?.message}</Typography>
        <TextField type='password' placeholder='Password' sx={{ m: 2 }} id="outlined-basic" fullWidth {...register("password")} />

        <input
          accept="image/*"
          className="input"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          name="files"
          onChange={handleImage}
        />
        <label htmlFor="raised-button-file">
          <Button variant="raised" component="span" sx={{ m: 2, backgroundColor: theme.palette.primary[1000], width: '100%' }}
            size='large'  >
            Upload profile pic
          </Button>
        </label>
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

export default Login