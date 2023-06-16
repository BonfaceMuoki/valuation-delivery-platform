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
import { Link,useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useSearchParams, useLocation } from 'react-router-dom';

import { useGetAccesorUserInviteDetailsQuery } from 'features/retrieveAccesorInviteSlice';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import "../../assets/scss/validation.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { useRegisterAccesorUserMutation } from 'features/rgisterAccesorOrgSlice';
import { useResetPasswordMutation, useVerifyResetTokenQuery } from './authApiSlice';


// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

function ResetPassword() {
    const navigate = useNavigate();
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
    const { data: retrievedUserInvite, isError, error } = useVerifyResetTokenQuery(params.get("token"));
    const token=params.get("token");
    const [backendValErrors, setBackendValErrors] = useState({});
    const [resetPassword, { isLoading: loadingValuer }] = useResetPasswordMutation();
    const schema = yup.object().shape({
        email: yup.string().required("Your account Email is required"),
        password: yup.string().required("Please provide password").matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{6,}$/,
            'Password must be at least 8 characters long and contain at least one letter, one number, and one special character'
        ),
        confirm_password: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match.").required("Please confirm the password")
    });

    const { register: acceptInviteRegister, handleSubmit: handleSubmitRegisterValuer, setValue: setInviteValue, isLoading: loadingInviteDetails, formState: { errors: acceptInviteerrors } } = useForm({
        resolver: yupResolver(schema)
    });


    const submitRegister = async (data) => {
        const formdata = new FormData();
        formdata.append("password", data.password);
        formdata.append("email", data.email);
        formdata.append("reset_token", token);
        const result = await resetPassword(formdata);
        console.log(result);
        if ('error' in result) {

            toastMessage(result.error.data.message, "error");
            if ('backendvalerrors' in result.error.data) {

                setBackendValErrors(result.error.data.backendvalerrors);
                console.log(backendValErrors['email']);

            }

        } else {
            toastMessage(result.data.message, "success");
            navigate('/login');


        }

    }
    if (!retrievedUserInvite) {
        return (<Box display={'flex'} flexDirection={'column'}
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

    if (Object.keys(retrievedUserInvite).length === 0) {

        return (<Box display={'flex'} flexDirection={'column'}
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
    } else {
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
                    <Typography variant='h5' sx={{ mb: 2, fontWeight: 'bold' }} align='center'  >Reset Password.</Typography>
                    <Typography sx={{ ml: 1 }}>Account Login Email</Typography>
                    <TextField placeholder='Account Login Email' sx={{ m: 1 }} id="outlined-basic" fullWidth {...acceptInviteRegister("email")} autoComplete="off" />
                    <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.email?.message}</span>
                    <span sx={{ ml: 1 }} className='errorSpan'>{backendValErrors?.email}</span>
                    <Grid container direction={isNonMobile ? 'row' : 'column'}  >
                        <Grid item md={6} sm={12} sx={{ mb: 1 }}>
                            <Typography sx={{ ml: 1 }} >New Password</Typography>
                            <TextField type='password' placeholder='Password' sx={{ pl: 1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("password")} autoComplete="off" />
                            <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.password?.message}</span>
                        </Grid>
                        <Grid item md={6} sm={12} sx={{ mb: 1 }}>
                            <Typography sx={{ ml: 1 }} >Confirm Password </Typography>
                            <TextField type='password' placeholder='Confirm Password' sx={{ pl: 1 }} fullWidth id="outlined-basic" {...acceptInviteRegister("confirm_password")} autoComplete="off" />
                            <span sx={{ ml: 1 }} className='errorSpan'>{acceptInviteerrors.confirm_password?.message}</span>
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                        sx={{ m: 2, backgroundColor: theme.palette.primary[800] }}
                        size='large' >Submit New Password</Button>
                </form>
            </Box>
        )
    }


}

export default ResetPassword;