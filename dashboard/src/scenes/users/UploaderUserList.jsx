import React,{useState} from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, ButtonBase, TextField, Grid, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';
import UserActions from './UserActions';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "../../assets/scss/validation.css";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';
import 'react-toastify/dist/ReactToastify.css';
import { useGetValuationFirmsQuery } from 'features/valuationFirmsSlice';
import { useGetValuationFirmUsersQuery } from 'features/valuationFirmUsersSlice';
import { useGetUsersQuery } from 'features/usersSlice';


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

function UploaderUsersList() {

const viewUserDEtails = (row) =>{

}
const editUser = (row) =>{

}
const blockUser = (row)=>{

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
      headerName: "Phone Number",
      field: "email",
      flex: 1
    },
    {
      headerName: "Role",
      flex: 1,
      valueGetter: (params) => params.row.roles.map((role) => role.name).join(', ') 
    },
    {
      field: 'actions',
      headerName: "Actions",
      type: 'actions',
      width: 400,
      renderCell: (params) =>{
        return <><Button variant='contained' onClick={() => viewUserDEtails(params.row)}>view</Button> &nbsp;&nbsp;
        <Button variant='contained' onClick={() => editUser(params.row)}>Edit</Button> &nbsp;&nbsp;
        <Button variant='contained' onClick={() => blockUser(params.row)} >Block</Button></>
        },
    }
  ];
  const [blocked, setBlocked] = useState(false);
  const [openInviteModal,setOpenInviteModal] = useState(false);
  const handleOpen = ()=>{
    setOpenInviteModal(true);
  }
  const handleClose = ()=>{
    setOpenInviteModal(false);
  }
   ///intialize invite form
   const inviteformschema = yup.object().shape({
    name: yup.string().required("Please provide the valuation firm registred name"),
    email: yup.string().email("Plase provide valid Email").required("Please provide email"),
    phone: yup.string().required("Please provide the VRB number"),
    isk_number: yup.string(),
    instruction: yup.string()
});
const {
    register: registerInvitForm,
    handleSubmit: handleInviteFormsubmit,
    reset: resetValuerInviteForm,
    formState: { errors: inviteFormErrors } } = useForm({
        resolver: yupResolver(inviteformschema)
    });

    const onSubmitInviteFormsubmit = async (data) => {
      setBlocked(true);
      console.log(data);
      const formdata = new FormData();
      formdata.append("name",data.name);
      formdata.append("vrb_number",data.vrb_number);
      formdata.append("isk_number",data.isk_number);
      formdata.append("phone",data.phone);
      formdata.append("email",data.email);
    //  const result =await inviteUploader(formdata);
      // console.log(result);
      // if ('error' in result) {    
      //   toastMessage(result.error.data.message, "error");
      //   if('backendvalerrors' in result.error.data){
      //     // setBackendValErrors(result.error.data.backendvalerrors);
      //     resetValuerInviteForm();
      //     setBlocked(false);   
      //   }  
      // } else {

      //   toastMessage(result.data.message, "success");
      //   setBlocked(false);   
  
      // }
  
  }
///intialize invite form
  return (
    
    <BlockUI blocked={blocked}>

            <FlexBetween sx={{ ml: 5 }}>
                <Header sx={{ ml: 30 }} title="Valuation Firms" subtitle="List of Valuation Firms" />
                <Button sx={{ mt: 10, ml: 10, mr: 10 }} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; Invite User</Button>
            </FlexBetween>
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
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("vrb_number")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_vrb_number?.message}</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} >
                                {
                                    // !sendingUploaderInvite &&
                                    <Button variant='contained' fullWidth type="submit">Send Invite</Button>
                                }
                               
                            </Grid>

                        </Grid>
                    </form>
                </Box>
            </Modal>
       <Box sx={{ mt: 10, ml: 10, mr: 10, height: "650px;" }} >
        
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
            />
        </Box>
        </BlockUI>
  )
}

export default UploaderUsersList