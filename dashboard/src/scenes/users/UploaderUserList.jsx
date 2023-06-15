import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {
  Box, Button, TextField, Grid, Autocomplete, Avatar, useTheme,
  useMediaQuery,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add, LockOpenOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "../../assets/scss/validation.css";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUsersQuery } from 'features/usersSlice';
import { useSendValuationFirmUserInviteMutation } from 'features/sendValuationFirmUserInviteSlice';
import { useGetRolesListQuery } from 'features/rolesSlice';
import { useGetUserDetailsQuery } from 'features/getUserDetailsSlice';
import profileImage from "assets/profile.jpg";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useBlockUserMutation } from 'features/uploaderManageUserSlice';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleUserdetailsModalBox = {
  position: 'absolute',
  top: '5%',
  left: '25%',
  right: '25%',
  transform: 'translate(-25%, -25%,-25%)',
  width: "50%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 10,
  position: "absolute"
};

function UploaderUsersList() {

  const [image, setImage] = useState();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
  const viewUserDEtails = (row) => {
    setSelectedUserID(row.id);
    setOpenUserDetailsModal(true);
  }
  const editUser = (row) => {

  }
  const [blockThisUser,{isLoading:blockingUser}]=useBlockUserMutation();
  const blockUser = (row) => {
    confirmDialog({
      message: `Are you sure you want to block ${row.full_name}? This will deny them access to reports and any other items concerning your organization.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => acceptBlockingUser(row.id,0), // Pass row.id as a parameter to accept function
      reject: () => { } // Empty reject function for now
    });
  }
  const unblockUser= (row) => {
    confirmDialog({
      message: `Are you sure you want to block ${row.full_name}? This will deny them access to reports and any other items concerning your organization.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => acceptBlockingUser(row.id,1), // Pass row.id as a parameter to accept function
      reject: () => { } // Empty reject function for now
    });
 
  }
  const acceptBlockingUser = async(id,status) => {
   const formData=new FormData();
   formData.append("user",id);
   formData.append("status",status);
   const result= await blockThisUser(formData);
   if ('error' in result) {
    toastMessage(result.error.data.message, "error");
    if ('backendvalerrors' in result.error.data) {
      // setBackendValErrors(result.error.data.backendvalerrors);
      resetValuerInviteForm();
      setBlocked(false);
    }
  } else {
    toastMessage(result.data.message, "success");
    refetchUsers();
  }
  

  }
  const {
    data: users,
    isFetching,
    isLoading,
    refetch: refetchUsers,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery();

  const { data: roleslist,
    isFetching: fetchingRole,
    isLoading: ladingRoles,
    refetch: refetcrefetcuseGetRolesListQueryuseGetRolesListQueryhRolesuseGetRolesListQueryuseGetRolesListQueryhRoles,
    isSuccess: successfulFetchingRoles,
    isError: errorFetchingRoles,
    error: fetching } = useGetRolesListQuery()

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
  const columns = [
    {
      headerName: "User ID",
      field: "id",
      flex: 1
    },
    {
      headerName: "Full Name",
      field: "full_name",
      flex: 1
    },
    {
      headerName: "Email",
      field: "email",
      flex: 1
    },
    {
      field: 'actions',
      headerName: "Actions",
      type: 'actions',
      width: 400,
      renderCell: (params) => {
        if(params.row.is_active==="1"){
          return <>
          <Button variant='contained'  sx={{width:"20%"}}  onClick={() => viewUserDEtails(params.row)}>view</Button> &nbsp;&nbsp;
          <Button variant='contained'  sx={{width:"20%"}}  onClick={() => blockUser(params.row)} >Block</Button></>
        }else if(params.row.is_active==="0"){
          return <>
          <Button variant='contained' sx={{width:"20%"}} onClick={() => viewUserDEtails(params.row)}>view</Button> &nbsp;&nbsp;
          <Button variant='contained'  sx={{width:"20%"}}  onClick={() => unblockUser(params.row)} >UnBlock</Button></>
        }

      },
    }
  ];
  const [blocked, setBlocked] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const handleOpen = () => {
    setOpenInviteModal(true);
  }
  const handleClose = () => {
    setOpenInviteModal(false);
  }
  ///intialize invite form
  const inviteformschema = yup.object().shape({
    name: yup.string().required("Please provide the valuation firm registred name"),
    email: yup.string().email("Plase provide valid Email").required("Please provide email"),
    phone: yup.string().required("Please provide the VRB number").min(10, "phone Number must be 10 characters.").max(10, "Phone Number must be 10 characters."),
    vrb_number: yup.string(),
    isk_number: yup.string(),
    instruction: yup.string()
  });
  const {
    register: registerInvitForm,
    handleSubmit: handleInviteFormsubmit,
    reset: resetValuerInviteForm,
    formState: { errors: inviteFormErrors }, control } = useForm({
      resolver: yupResolver(inviteformschema)
    });
  const [inviteUploaderuser, { isLoading: sendingUploaderInvite }] = useSendValuationFirmUserInviteMutation();
  const onSubmitInviteFormsubmit = async (data) => {
    const formdata = new FormData();
    formdata.append("name", data.name);
    formdata.append("vrb_number", data.vrb_number);
    formdata.append("isk_number", data.isk_number);
    formdata.append("phone", data.phone);
    formdata.append("email", data.email);
    formdata.append("invited_as", data.invited_as.id);
    formdata.append("login_url", `${process.env.REACT_APP_FRONT_BASE_URL}/complete-valuer-user-registration-login`);
    formdata.append("registration_url", `${process.env.REACT_APP_FRONT_BASE_URL}/complete-valuer-user-registration-register`);
    const result = await inviteUploaderuser(formdata);
    if ('error' in result) {
      toastMessage(result.error.data.message, "error");
      if ('backendvalerrors' in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
        resetValuerInviteForm();
        setBlocked(false);
      }
    } else {
      toastMessage(result.data.message, "success");
      setBlocked(false);
    }
  }
  const getOptionLabel = (option) => {
    if (!option) {
      return ''; // Return an empty string for undefined or null options
    }
    // Handle other cases based on your data structure
    return (option.name) ? option.name : ''; // Assuming each option has a 'label' property
  };
  ///intialize invite form
  // userdetails
  const [openUserDetailsModal, setOpenUserDetailsModal] = useState(false);
  const handleCloseUserDetailsModal = () => {
    setOpenUserDetailsModal(false);
  }
  const handleOpenUserDetailsModal = () => {
    setOpenUserDetailsModal(true);
  }
  const [selectedUserID, setSelectedUserID] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserermissions, setSelectedUserPermissions] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState(null);
  const { data: alluserdetails, isLoading: loadingUserDetails } = useGetUserDetailsQuery(selectedUserID);
  useEffect(() => {
    if (alluserdetails) {
      setSelectedUser(alluserdetails?.user);
      setSelectedUserPermissions(alluserdetails?.permissions);
      setSelectedUserRoles(alluserdetails?.roles);
    }
  }, [alluserdetails]);
  console.log("user details");
  console.log(selectedUser);
  console.log("user permissions");
  console.log(selectedUserermissions);
  console.log("user roles");
  console.log(selectedUserRoles);
  // userdetails  
  return (

    <BlockUI blocked={blocked}>
      <ConfirmDialog />
      <FlexBetween sx={{ ml: 5 }}>
        <Header sx={{ ml: 30 }} title="Users" subtitle="List of my Users" />
        <Button sx={{ mt: 10, ml: 10, mr: 10 }} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; Invite User</Button>
      </FlexBetween>
      {/* //modal show user getUserDetails */}
      <Modal
        open={openUserDetailsModal}
        onClose={handleCloseUserDetailsModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleUserdetailsModalBox}>

          <Box
            sx={{
              ml:10,
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
                      User Information
                    </Typography>
                    <Grid item xs={12} sm={12} md={12}>
                      <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 2 }}
                        aria-label="contacts"
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          Full Name: {selectedUser?.full_name}
                        </Typography>
                        <Typography sx={{ ml: 0 }} variant="subtitle1" gutterBottom>Email: {selectedUser?.email}</Typography>

                        <Typography sx={{ ml: 0 }} variant="subtitle1" gutterBottom>Phone: {selectedUser?.email}</Typography>
                        <br></br>
                        <Typography sx={{ ml: 0 }} variant="subtitle1" gutterBottom>VRB Number: {selectedUser?.vrb_number}</Typography>
                        <br></br>
                        <Typography sx={{ ml: 0 }} variant="subtitle1" gutterBottom>ISK Number: {selectedUser?.isk_number}</Typography>
                        <br></br>
                      </List>
                      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                        Roles
                      </Typography>
                      <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        aria-label="contacts"
                      >
                        {selectedUserRoles &&
                          selectedUserRoles.map((role, key) => {
                            return (
                              <ListItem disablePadding>
                                <ListItemButton>
                                  <ListItemIcon>
                                    <LockOpenOutlined />
                                  </ListItemIcon>
                                  <ListItemText primary={role.name} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })
                        }
                      </List>
                    </Grid>

                  </Grid>
                </Box>

              </Grid>
              <Grid item xs={12} sm={6} md={6}>

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
                      Permissions
                    </Typography>
                    <Grid item xs={12} sm={12} md={12}>
                      <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        aria-label="contacts"
                      >
                        {selectedUserermissions &&
                          selectedUserermissions.map((permission, key) => {
                            return (
                              <ListItem disablePadding>
                                <ListItemButton>
                                  <ListItemIcon>
                                    <LockOpenOutlined />
                                  </ListItemIcon>
                                  <ListItemText primary={permission.name} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })
                        }
                      </List>

                    </Grid>

                  </Grid>
                </Box>

              </Grid>
            </Grid>
          </Box>

        </Box>
      </Modal>
      {/* //close modal show user getuserdetails  */}
      <Modal
        open={openInviteModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            INVITE VALUATION FIRM USER
          </Typography>
          <hr></hr>
          <form name='invitevaluationfirmuser' onSubmit={handleInviteFormsubmit(onSubmitInviteFormsubmit)}>
            <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>
              <Grid item xs={12} sm={12} md={12}>
                <Typography sx={{ ml: 1, mt: 3 }}>Invited As</Typography>
                <Controller
                  name="invited_as"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <Autocomplete
                      {...field}
                      disableClearable
                      disablePortal
                      filterSelectedOptions
                      options={roleslist}
                      getOptionDisabled={(option) => option.disabled}
                      getOptionLabel={getOptionLabel}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      id="days-autocomplete"
                      onChange={(event, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          id="invited_as"
                          name="invited_as"
                          type="search"
                          inputRef={ref}
                          {...params}
                        />

                      )}
                    />

                  )}

                />
                <span className='errorSpan' >{inviteFormErrors.recipient?.message}</span>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>Name</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("name")} />
                  <span className='errorSpan' >{inviteFormErrors.name?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>Email</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("email")} />
                  <span className='errorSpan' >{inviteFormErrors.email?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>Phone</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("phone")} />
                  <span className='errorSpan' >{inviteFormErrors.phone?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>ISK Number</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("isk_number")} />
                  <span className='errorSpan' >{inviteFormErrors.isk_number?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>VRB Number</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("vrb_number")} />
                  <span className='errorSpan' >{inviteFormErrors.vrb_number?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>Invite Note</Typography>
                <div>
                  <TextField autoComplete="off" fullWidth {...registerInvitForm("instruction")} />
                  <span className='errorSpan' >{inviteFormErrors.instruction?.message}</span>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} >
                {
                  !sendingUploaderInvite &&
                  <Button variant='contained' fullWidth type="submit">Send Invite</Button>
                }

              </Grid>

            </Grid>
          </form>
        </Box>
      </Modal>
      
      <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="5rem"
        borderRadius="0.55rem"
        width="95%"
        height="650px"
        sx={{ml:2.5,mr:2.5,mt:5}}
      >

        <DataGrid
          loading={isLoading || !users}
          getRowId={(row) => row.id}
          rows={users || []}
          columns={columns}
          initialState={{
            ...users,
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        >

        </DataGrid>
      </Box>
    </BlockUI>
  )
}

export default UploaderUsersList