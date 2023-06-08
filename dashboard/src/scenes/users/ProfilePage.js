import {
  Box,
  Button,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import profileImage from "assets/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UploadFileOutlined, CameraAltOutlined } from "@mui/icons-material";
import { selectCurrentUser } from "scenes/auth/authSlice";
import "../../assets/scss/validation.css";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";

function ProfilePage() {
  const theme = useTheme();

  const isNonMobile = useMediaQuery("(min-width: 1200px)");

  const schemaPersonal = yup.object().shape({
    full_name: yup.string().required("Please provide your Username/Email"),
    email: yup.string().required("Please provide your Password."),
    isk_number: yup.string().required("Please provide your Password."),
    vrb_number: yup.string().required("Please provide your Password."),
    profile_pic: yup
            .mixed()
            .required('Please upload a file')
            .nullable()
            .test('fileSize', 'File size is too large', (value) => {
                if (value[0]) {
                    return value[0].size <= 1024 * 1024 * 2;
                }
                return true;

            })
            .test('fileType', 'Only PDF files are allowed', (value) => {
                if (value[0]) {
                    return ['application/pdf', 'pdf'].includes(value[0].type);
                }
                return true;

            })
  });
  const {
    register:registerPersonalForm,
    handleSubmit: handlePersonalFormSubmit,
    formState: { errors: personalFormErrors },
    setValue: setPersonalInfoValue
  } = useForm({
    resolver: yupResolver(schemaPersonal),
  });
  const submitPersonalInformation = (data) =>{
    console.log(data);
   }

   //close submit personal info
  const [image, setImage] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const handleImage = (e) => {
    setImage(e.target.files[0]);
    // if (e.target.files[0]) {
    //     setUploadedFile(e.target.files[0].name);
    // }
  };


  const currentuser = useSelector(selectCurrentUser);
  console.log(currentuser.full_name);
  useEffect(()=>{
    if (currentuser) {
        setPersonalInfoValue("full_name",currentuser?.full_name); 
        setPersonalInfoValue("isk_number",currentuser?.isk_number); 
        setPersonalInfoValue("vrb_number",currentuser?.vrb_number); 
        setPersonalInfoValue("email",currentuser?.email);        
    }
    
  },[currentuser])

  //company information
  const schemaCompany = yup.object().shape({
    organization_name: yup.string().required("Please provide your Username/Email"),
    organization_email: yup.string().required("Please provide your Password."),
    organization_phone: yup.string().required("Please provide your Password."),
    directors_vrb_name: yup.string().required("Please provide your Password."),
    idemnity_amount: yup.string().required("Please provide your Password."),
    organization_logo: yup
            .mixed()
            .required('Please upload a file')
            .nullable()
            .test('fileSize', 'File size is too large', (value) => {
                if (value[0]) {
                    return value[0].size <= 1024 * 1024 * 2;
                }
                return true;

            })
            .test('fileType', 'Only PDF files are allowed', (value) => {
                if (value[0]) {
                    return ['application/pdf', 'pdf'].includes(value[0].type);
                }
                return true;

            })
  });
  const {
    register:registerCompanyForm,
    handleSubmit: handleCompanyFormSubmit,
    formState: { errors: companyFormErrors },
  } = useForm({
    resolver: yupResolver(schemaCompany),
  });
  const submitCompanyInformation = (data) =>{
   console.log(data);
  }
//   company information

  return (
    <>
        {/* <FlexBetween sx={{ justifyContent:"left" , ml:5}}>
                <Header sx={{ justifyContent:"left" }} title="Profile Page" subtitle="Valution Firm Profile"/>
        </FlexBetween> */}
      <Box
        sx={{
          width: "95%",
          height: "100px",
          padding: "3px",
          mr: "2.5%",
          ml: "2.5%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt:5
        }}
      >
        <Avatar
          alt="Avatar"
          src={profileImage} // Replace with the actual path to your image
          style={{ width: "100px", height: "100px", marginTop: "50px" }} // Adjust the size of the avatar as needed
        />
      </Box>
      <Box
        sx={{
          width: "90%",
          backgroundColor: theme.palette.background.alt,
          padding: "3px",
          mr: "5%",
          ml: "5%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={6} md={6}>
            <form onSubmit={handlePersonalFormSubmit(submitPersonalInformation)}>
            <Box
              sx={{
                width: "80%",
                minHeight: "100px",
                padding: "3px",
                mr: "10%",
                ml: "10%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                
              <Grid
                container
                direction={isNonMobile ? "row" : "column"}
                sx={{ m: 2}}
              >
                <Typography variant='h4' sx={{ mb: 2, fontWeight: 'bold' }}>Personal Information</Typography>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Full Nae</Typography>
                  <br></br>
                  <TextField
                    placeholder="Full Name"
                    id="outlined-basic"
                    fullWidth
                    {...registerPersonalForm("full_name")}
                  />
                     <span className="errorSpan">
                    <br></br>
                    {personalFormErrors.full_name?.message}
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Email</Typography>
                  <br></br>
                  <TextField
                    placeholder="Email"
                    id="outlined-basic"
                    fullWidth
                    {...registerPersonalForm("email")}
                  />
                           <span className="errorSpan">
                    <br></br>
                    {personalFormErrors.email?.message}
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>VRB Number</Typography>
                  <br></br>
                  <TextField
                    placeholder="vrb number"
                    id="outlined-basic"
                    fullWidth
                    {...registerPersonalForm("vrb_number")}
                  />
                           <span className="errorSpan">
                    <br></br>
                    {personalFormErrors.vrb_number?.message}
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>ISK Number</Typography>
                  <br></br>
                  <TextField
                    placeholder="ISK number"
                    id="outlined-basic"
                    fullWidth
                    {...registerPersonalForm("isk_number")}
                  />
                           <span className="errorSpan">
                    <br></br>
                    {personalFormErrors.isk_number?.message}
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      type="file"
                      {...registerPersonalForm("profile_pic", {
                        onChange: handleImage,
                      })}
                    />
                    <Typography sx={{ ml: 1, mt: 3 }}>
                      Profile Picture
                    </Typography>

                    <Button
                      variant="outlined"
                      sx={{ mt: 0, textAlign: "left", height: 60, width: "100%" }}
                      color="secondary"
                      component="span"
                    >
                      <CameraAltOutlined sx={{ fontSize: "55px" }} />
                    </Button>
                    <br />
                  </label>
                  <span className="errorSpan">
                    <br></br>
                    {personalFormErrors.profile_pic?.message}
                  </span>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary[700],
                      width: "100%",
                      height:"60px"
                    }}
                    size="large"
                  >
                    Update Information
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </form>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
          <form onSubmit={handleCompanyFormSubmit(submitCompanyInformation)}>
            <Box
              sx={{
                width: "80%",
                minHeight: "100px",
                padding: "3px",
                mr: "10%",
                ml: "10%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
               <Grid
                container
                direction={isNonMobile ? "row" : "column"}
                sx={{ m: 2 }}
              >
                 <Typography variant='h4' sx={{ mb: 2, fontWeight: 'bold' }}>Organization Information</Typography>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Organization Name</Typography>
                  <br></br>
                  <TextField
                    placeholder="Organization Name"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("organization_name")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Organization Phone</Typography>
                  <br></br>
                  <TextField
                    placeholder="Organization Phone"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("organization_phone")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Organization Name</Typography>
                  <br></br>
                  <TextField
                    placeholder="Organization Email"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("organization_email")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Directors VRB</Typography>
                  <br></br>
                  <TextField
                    placeholder="Directors VRB"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("directors_vrb")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Idemnity Amount</Typography>
                  <br></br>
                  <TextField
                    placeholder="idemnity Amount"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("idemnity_amount")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ ml: 0 }}>Idemnity Expiry</Typography>
                  <br></br>
                  <TextField
                    placeholder="Idemnity Expiry"
                    id="outlined-basic"
                    fullWidth
                    {...registerCompanyForm("idemnity_expiry")}
                  />
                </Grid>
                
                <Grid item xs={12} sm={12} md={12}>
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      type="file"
                      {...registerCompanyForm("organization_logo", {
                        onChange: handleImage,
                      })}
                    />
                    <Typography sx={{ ml: 1, mt: 3 }}>
                      Profile Picture
                    </Typography>

                    <Button
                      variant="outlined"
                      sx={{ mt: 0, textAlign: "left", height: 70, width: "100%" }}
                      color="secondary"
                      component="span"
                    >
                      <CameraAltOutlined sx={{ fontSize: "55px" }} />
                    </Button>
                    <br />
                  </label>
                  <span className="errorSpan">
                    <br></br>
                    {companyFormErrors.file?.message}
                  </span>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary[700],
                      width: "100%",
                    }}
                    size="large"
                  >
                    Update Information
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ProfilePage;
