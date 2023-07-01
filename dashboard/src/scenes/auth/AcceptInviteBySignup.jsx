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
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSearchParams,useLocation } from 'react-router-dom';

import { useGetValuerInviteDetailsQuery } from 'features/retrieveValuerInviteSlice';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import "../../assets/scss/validation.css"
import { useRegisterUploaderMutation } from 'features/registerUploaderCompanySlice';
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

function AcceptInviteSignup() {

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


  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {data:retrieved,isError,error} = useGetValuerInviteDetailsQuery(params.get("token"));
  const [backendValErrors,setBackendValErrors]=useState({});
  const [registerValuer,{isLoading:loadingValuer}] = useRegisterUploaderMutation();

  const schema = yup.object().shape({
   company_name: yup.string().required("Company Name is required"),
   full_name: yup.string().required("Your name is required"),
   vrb_number: yup.string().required("VRB Number is required"),
   isk_number: yup.string().required("ISK Number is required"),
   phone_number: yup.string().required("Phone number is required"),
   password: yup.string().required("Please provide password").matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{6,}$/,
    'Password must be at least 8 characters long and contain at least one letter, one number, and one special character'
  ),
   confirm_password:  yup.string().oneOf([yup.ref("password"),null],"Passwords do not match.").required("Please confirm the password")

  });

  const {register: acceptInviteRegister, handleSubmit: handleSubmitRegisterValuer , setValue: setInviteValue ,isLoading: loadingInviteDetails, formState:{ errors: acceptInviteerrors}} = useForm({
    resolver: yupResolver(schema)
  });

useEffect(() => {
  if (!loadingInviteDetails && retrieved) {
    setInviteValue("company_name",retrieved?.valauaion_firm_name);
    setInviteValue("full_name",retrieved?.director_name);
    setInviteValue("email",retrieved?.invite_email);
    setInviteValue("vrb_number",retrieved?.vrb_number);
    setInviteValue("isk_number",retrieved?.isk_number);
    setInviteValue("phone_number",retrieved?.invite_phone);
  }
}, [retrieved, loadingInviteDetails, setInviteValue,]);
const navigate = useNavigate();
const submitRegister = async (data)=>{
    const formdata= new FormData();
    formdata.append("company_name",data.company_name);
    formdata.append("email",data.email);
    formdata.append("organization_phone",data.phone_number);
    formdata.append("vrb_number",data.vrb_number);
    formdata.append("directors_vrb",data.vrb_number);
    formdata.append("isk_number",data.isk_number);
    formdata.append("password",data.password);
    formdata.append("password_confirmation",data.confirm_password);
    formdata.append("company_email",data.email);
    formdata.append("register_as","Report Uploader Admin");
    formdata.append("full_name",data.fulls_name);
    const result = await registerValuer(formdata);
    if ('error' in result) {

      toastMessage(result.error.data.message, "error");
      if('backendvalerrors' in result.error.data){

        setBackendValErrors(result.error.data.backendvalerrors);

      }
    


    } else {
      toastMessage(result.data.message, "success");
      navigate('/login');      

    }

}
if(!retrieved){
  return (  <Box display={'flex'} flexDirection={'column'}
  width={isNonMobile ? "50%" : "80%"}
  sx={{

    justifyContent: 'center',
    marginRight: '10%',
    marginLeft: '20%',
    borderColor: theme.palette.primary,
    borderRadius: '10px'
  }}  >
      <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >.</Typography>
  </Box>

  )
}

if(Object.keys(retrieved).length === 0){
 
  return (  <Box display={'flex'} flexDirection={'column'}
  width={isNonMobile ? "50%" : "80%"}
  sx={{

    justifyContent: 'center',
    marginRight: '10%',
    marginLeft: '20%',
    borderColor: theme.palette.primary,
    borderRadius: '10px'
  }}  >
      <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  > Invalid / Expired Invite.</Typography>
  </Box>)
}else{
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
        <form onSubmit={handleSubmitRegisterValuer(submitRegister)} >
          <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >ACCEPT INVITE BY ACCOUNT CREATION.</Typography>
          <Typography variant='p' sx={{ mb: 4 }} align='center'>Creating A Valuation company Account</Typography>
          <Typography sx={{ ml: 1 }}>Your Full Names</Typography>         
          <TextField placeholder='Full Names' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("full_name")} disabled />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.full_name?.message}</span>
          <Typography sx={{ ml: 1 }}>Account Login Email</Typography>
          <TextField placeholder='Account Login Email' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("email")} disabled />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.email?.message}</span>
          <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.email}</span>
          <Typography sx={{ ml: 1 }}>Company Name</Typography>
          <TextField placeholder='Company Name' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("company_name")} disabled />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.company_name?.message}</span>
          <Grid container direction={isNonMobile ? 'row' : 'column'} >
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>Directors VRB Number</Typography>
          <TextField placeholder='Directors VRB Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("vrb_number")} disabled />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.vrb_number?.message}</span>
          <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.vrb_number}</span>
            </Grid>
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }}>ISK Number</Typography>
          <TextField placeholder='ISK Number'  sx={{ pl:1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("isk_number")} disabled />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.isk_number?.message}</span>
          <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.isk_number}</span>
            </Grid>
          </Grid>
          <Typography sx={{ ml: 1 }}>Contact Phone Number</Typography>
          <TextField placeholder='Contact Phone Number'  sx={{ pl:1, mb:1 }} id="outlined-basic" {...acceptInviteRegister("phone_number")} disabled   fullWidth/>
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.phone_number?.message}</span>
          <Grid container direction={isNonMobile ? 'row' : 'column'}  >
            <Grid item md={6}  sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }} >Password</Typography>
          <TextField type='password' placeholder='Password'  sx={{ pl: 1}} fullWidth id="outlined-basic" {...acceptInviteRegister("password")}  />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.password?.message}</span>
            </Grid>
            <Grid item md={6} sm={12} sx={{mb:1}}>
            <Typography sx={{ ml: 1 }} >Confirm Password </Typography>
          <TextField type='password' placeholder='Confirm Password' sx={{pl:1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("confirm_password")}  />
          <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.confirm_password?.message}</span>
            </Grid>
          </Grid>

          
          <Button
          type='submit'
            variant='contained'
            fullWidth
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
          </form>
        </Box>
  )
}


}

export default AcceptInviteSignup;