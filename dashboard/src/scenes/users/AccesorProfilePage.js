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
import { useUpdateAccesorPersonalInfoMutation } from "features/updateAccesorPersonalInfoSlice";
import { updateUserDetails } from "scenes/auth/authSlice";
import { useGetAccesorOrgDetailsDetailsQuery } from "features/retrieveAccesorOrgDetailsSlice";
import { useUpdateAccesorCompanyInfoMutation } from "features/updateAccesorCompanyInfoSlice";

function AccesorProfilePage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
  console.log(useSelector((state)=>state));
  const schemaPersonal = yup.object().shape({
    full_name: yup.string().required("Please provide your Username/Email"),
    email: yup.string().required("Please provide your Password."),
    profile_pic: yup
      .mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only jpeg,jpg", (value) => {
        if (value[0]) {
          console.log(value[0].type);
          return ["image/jpg", "image/jpeg","image/png"].includes(value[0].type);
        }
        return true;
      }),
  });
  const {
    register: registerPersonalForm,
    handleSubmit: handlePersonalFormSubmit,
    formState: { errors: personalFormErrors },
    setValue: setPersonalInfoValue,
  } = useForm({
    resolver: yupResolver(schemaPersonal),
  });
  const [updatePersonalInformation,{isLoading:updatingpersonalInformation}]= useUpdateAccesorPersonalInfoMutation();
  const submitPersonalInformation =  async(data) => {
    console.log(data);
    console.log(currentuser);
    const userid = currentuser.user_id;
    const formData= new FormData();
    formData.append("full_name",data.full_name);
    formData.append("email",data.email);
    formData.append("profile_pic",data.profile_pic[0]);
    formData.append("userid",userid);
    const email = data.email;
    const response = await updatePersonalInformation(formData);
    console.log("res");
    console.log(response);
    const userData= response.data;
    dispatch(updateUserDetails({...userData,email}));  
    
  };


  //close submit personal info
  const [image, setImage] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const currentuser = useSelector(selectCurrentUser);
  console.log(currentuser?.full_name);
  useEffect(() => {
    if (currentuser) {
      setPersonalInfoValue("full_name", currentuser?.full_name);
      setPersonalInfoValue("email", currentuser?.email);
    }
  }, [currentuser]);

  //company information

  const [logo, setLogo] = useState();
  const [uploadedLogoFile, setUploadedLogoFile] = useState();
  const handleLogo = (e) => {
    console.log("Logo upload");
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setLogo(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const schemaCompany = yup.object().shape({
    organization_name: yup
      .string()
      .required("Please provide your Username/Email"),
    organization_email: yup.string().required("Please provide your Password."),
    organization_phone: yup.string().required("Please provide your Password."),
    organization_logo: yup
      .mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only jpeg,jpg", (value) => {
        if (value[0]) {
          console.log(value[0].type);
          return ["image/jpg", "image/jpeg","image/png"].includes(value[0].type);
        }
        return true;
      }),
  });
  const {
    register: registerCompanyForm,
    handleSubmit: handleCompanyFormSubmit,
    setValue:setOrgValue,
    formState: { errors: companyFormErrors },
  } = useForm({
    resolver: yupResolver(schemaCompany),
  });
  const {data:retrivedOrgDetails,isLoading:loadingOrgDetails,refetch:refetchOrgdetails}=useGetAccesorOrgDetailsDetailsQuery()
  useEffect(() => {
    if (!loadingOrgDetails && retrivedOrgDetails) {
      setOrgValue("organization_name",retrivedOrgDetails?.organization_name);
      setOrgValue("organization_email",retrivedOrgDetails?.organization_email);
      setOrgValue("organization_phone",retrivedOrgDetails?.organization_phone);
      setOrgValue("directors_vrb",retrivedOrgDetails?.directors_vrb);
    }
  }, [retrivedOrgDetails, loadingOrgDetails, setOrgValue]);

  const [updateCompanyInformation,{isLoading:updatingcompanyInformation}]= useUpdateAccesorCompanyInfoMutation();

  const submitCompanyInformation =  async (data) => {
    console.log(data);
    const formData= new FormData();
    formData.append("organization_name",data.organization_name);
    formData.append("organization_email",data.organization_email);
    formData.append("organization_phone",data.organization_phone);
    formData.append("organization_logo",data.organization_logo[0]);
    const response= await updateCompanyInformation(formData);
    refetchOrgdetails();

  };
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
        }}
      >
        <Avatar
          alt="Avatar"
          src={image ? image : profileImage} // Replace with the actual path to your image
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
            <form
              onSubmit={handlePersonalFormSubmit(submitPersonalInformation)}
            >
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
                  sx={{ m: 2 }}
                >
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    Personal Information
                  </Typography>
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
                        sx={{
                          mt: 0,
                          textAlign: "left",
                          height: 60,
                          width: "100%",
                        }}
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
                        height: "60px",
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
                  alignItems: "center",
                }}
              >
                <Grid
                  container
                  direction={isNonMobile ? "row" : "column"}
                  sx={{ m: 2 }}
                >
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    Organization Information
                  </Typography>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography sx={{ ml: 0 }}>Organization Name</Typography>
                    <br></br>
                    <TextField
                      placeholder="Organization Name"
                      id="outlined-basic"
                      fullWidth
                      {...registerCompanyForm("organization_name")}
                    />
                    <span className="errorSpan">
                      <br></br>
                      {companyFormErrors.organization_name?.message}
                    </span>
                  </Grid>
                  <Grid container spacing={2} item xs={12} sm={12} md={12}>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography sx={{ ml: 0 }}>Organization Phone</Typography>
                      <br></br>
                      <TextField
                        placeholder="Organization Phone"
                        id="outlined-basic"
                        fullWidth
                        {...registerCompanyForm("organization_phone")}
                      />
                      <span className="errorSpan">
                        <br></br>
                        {companyFormErrors.organization_phone?.message}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Typography sx={{ ml: 0 }}>Organization Email</Typography>
                      <br></br>
                      <TextField
                        placeholder="Organization Email"
                        id="outlined-basic"
                        fullWidth
                        {...registerCompanyForm("organization_email")}
                      />
                      <span className="errorSpan">
                        <br></br>
                        {companyFormErrors.organization_email?.message}
                      </span>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} item xs={12} sm={12} md={12}>
                  <Grid item xs={12} sm={6} md={6}>
                    <label htmlFor="upload-logo">
                      <input
                        style={{ display: "none" }}
                        id="upload-logo"
                        type="file"
                        {...registerCompanyForm("organization_logo", {
                          onChange: handleLogo,
                        })}
                      />
                      <Typography sx={{ ml: 1, mt: 3 }}>
                        Organization Logo
                      </Typography>

                      <Button
                        variant="outlined"
                        sx={{
                          mt: 0,
                          textAlign: "left",
                          height: 60,
                          width: "100%",
                        }}
                        color="secondary"
                        component="span"
                      >
                        <CameraAltOutlined sx={{ fontSize: "55px" }} />
                      </Button>
                      <br />
                    </label>
                    <span className="errorSpan">
                      <br></br>
                      {companyFormErrors.organization_logo?.message}
                    </span>
                  
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Box
                      sx={{width:"100%", display:"flex", justifyContent:"right",mt:2,mb:2}}
                      >
                      
         <Avatar
          alt="Avatar"
          src={logo ? logo : profileImage} // Replace with the actual path to your image
          style={{ width: "100px", height: "100px", marginTop:"5px" }} // Adjust the size of the avatar as needed
        />
                      </Box>
           
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                  <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: theme.palette.primary[700],
                        width: "100%",
                        height: "60px",
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

export default AccesorProfilePage;
