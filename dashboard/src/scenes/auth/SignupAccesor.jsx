import React, { useRef } from 'react'
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
import { ArrowForwardIosRounded, ArrowForwardOutlined, ArrowForwardSharp, Label, TextFieldsOutlined } from '@mui/icons-material';
import Image from 'mui-image';
import profileImage from "assets/profile.jpg";
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import ReCAPTCHA from "react-google-recaptcha";

import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import "../../assets/scss/validation.css"
import { useRequestUploaderAccessMutation } from 'features/registerUploaderCompanySlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";



// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;


function SignupAccesor() {

  const toastMessage = (message, type) => {
    if (type == "success") {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (type == "error") {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (type == "warning") {
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }


  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;
  const captchaRef = useRef(null);
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  //register form
  const [requestValuerAccess,{isLOading:isSubmitting}]=useRequestUploaderAccessMutation();
  const [backendValErrors, setBackendValErrors] = useState({});
  const schema = yup.object().shape({
    full_names: yup.string().required("Directors name is required"),
    login_email: yup.string().required("Login Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
    company_name: yup.string().required("Company Name is required"),
  });
  const { register: registerValuerRequestForm, isLoading: isSubmittingForm, reset:resetRequestForm ,handleSubmit: handleSubmitRequestValuerAccess, formState: { errors: requestvalueraccesserrors } } = useForm({
    resolver: yupResolver(schema)
  });
  const sendRequestForm = async (data) => {
    console.log(data);
    const formData= new FormData();
    const token = captchaRef.current.getValue();
    formData.append("recaptcha_token",token);
    formData.append("full_names",data.full_names);
    formData.append("company_name",data.company_name);
   
    formData.append("login_email",data.login_email);
    formData.append("phone_number",data.phone_number);
    const result= await requestValuerAccess(formData);
    if ('error' in result) {
      toastMessage(result.error.data.message, "error");
      if('backendvalerrors' in result.error.data){
        setBackendValErrors(result.error.data.backendvalerrors);
        console.log(backendValErrors['email']);

      }   

    } else {
      resetRequestForm();
      toastMessage(result.data.message, "success");

    }

  }
  //close register page


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
      <form onSubmit={handleSubmitRequestValuerAccess(sendRequestForm)}>
        <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >Request System Access</Typography>
        <Typography variant='p' sx={{ mb: 4 }} align='center' >Request Lender / Court Access</Typography>
        <Typography sx={{ ml: 1 }}>Contact person Full Names</Typography>
        <TextField placeholder='Full Names' sx={{ m: 1 }} id="outlined-basic" fullWidth {...registerValuerRequestForm("full_names")} />
        <span sx={{ ml: 1 }} className='errorSpan'>{requestvalueraccesserrors.full_names?.message}</span>
        <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.name}</span>
        <Typography sx={{ ml: 1 }}>Account Login Email</Typography>
        <TextField placeholder='Account Login Email' sx={{ m: 1 }} id="outlined-basic" fullWidth   {...registerValuerRequestForm("login_email")} />
        <span sx={{ ml: 1 }} className='errorSpan'>{requestvalueraccesserrors.login_email?.message}</span>
        <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.email}</span>
        <Typography sx={{ ml: 1 }}>Lender / Court Name</Typography>
        <TextField placeholder='Court / Lender Name' sx={{ m: 1 }} id="outlined-basic" fullWidth   {...registerValuerRequestForm("company_name")} />
        <span sx={{ ml: 1 }} className='errorSpan'>{requestvalueraccesserrors.company_name?.message}</span>
        <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.company_name}</span>
        
        <Typography sx={{ ml: 1 }}>Contact Phone Number</Typography>
        <TextField placeholder='Contact Phone Number' sx={{ pl: 1, mb: 1 }} id="outlined-basic" fullWidth {...registerValuerRequestForm("phone_number")} />
        <span sx={{ ml: 1 }} className='errorSpan'>{requestvalueraccesserrors.phone_number?.message}</span>
        <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.phone_number}</span>
        <ReCAPTCHA
          className="recaptcha"
          sitekey={SITE_KEY}
          ref={captchaRef}
        />

        <Button
          type="submit"
          variant='contained'
          sx={{ m: 2, backgroundColor: theme.palette.primary[700], width: '100%' }}
          size='large' >Submit Request</Button>
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
           <p>Do you have an account ?</p>
          </Grid>
          <Grid item md={12} display="flex" justifyContent="center">
            <Link to={'/login'} >Please proceed to Login </Link><ArrowForwardOutlined/>
          </Grid>
        </Grid>
      </form>
    </Box>
  )

}

export default SignupAccesor;