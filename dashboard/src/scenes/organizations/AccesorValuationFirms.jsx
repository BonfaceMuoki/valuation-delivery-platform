
import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, ButtonBase, TextField, Grid, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';

import ValuationFirmActions from './ValuationFirmActions';
import { useMediaQuery,useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "../../assets/scss/validation.css";
import { ToastContainer, toast } from 'react-toastify';
import { useGetValuationFirmsQuery } from 'features/valuationFirmsSlice';
import { useInviteUploaderMutation } from 'features/inviteUploaderSlice';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function AccesorValuationFirms(row) {
    const theme = useTheme();
    const [blocked, setBlocked] = useState(false);
    const viewValuationFirmDetails = (row)=>{

    }
    const editValuationFirm = (row)=>{
      
    }
    const blockValuationFirm = (row)=>{
      
    }
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
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    ///intialize invite form
    const inviteformschema = yup.object().shape({
        valuation_firm_name: yup.string().required("Please provide the valuation firm registred name"),
        valuation_firm_admin_email: yup.string().email("Plase provide valid Email").required("Please provide email"),
        valuation_firm_vrb_number: yup.string().required("Please provide the VRB number"),
        valuation_firm_isk_number: yup.string().required("Please provide the ISK number"),
        valuation_firm_director_name: yup.string().required("Please provide the director name")
    });
    const {
        register: registerInvitForm,
        handleSubmit: handleInviteFormsubmit,
        reset: resetValuerInviteForm,
        formState: { errors: inviteFormErrors } } = useForm({
            resolver: yupResolver(inviteformschema)
        });
    ///intialize invite form
    //intialize edit form
    const editFromSchema = yup.object().shape({

    });
    const {
        register: editValuationFirmForm,
        handleSubmit: handleEditFormSubmit,
        formState: { errors: editValuationFormErrors },
        control: editFormControl } = useForm();
    ///intialize edit form

    const columns = [
        {
            headerName: 'Name',
            field: 'organization_name',
            flex: 1
        },
        {
            headerName: 'Phone',
            field: 'organization_phone',
            flex: 1
        },
        {
            headerName: 'Email',
            field: 'organization_email',
            flex: 1
        },
        {
            headerName: 'VRB',
            field: 'directors_vrb',
            flex: 1
        },
        {
            headerName: 'ISK NUmber',
            field: 'isk_number',
            flex: 1
        }
        ,
        {
            headerName: 'Idemnity Amount',
            field: 'idemnity_amount',
            flex: 1
        }
    ];
    const {
        data: firms,
        isFetching,
        isLoading,
        refetch: refetchFirms,
        isSuccess,
        isError,
        error
    } = useGetValuationFirmsQuery();

    const [inviteUploader,{isLoading: sendingUploaderInvite}] = useInviteUploaderMutation();

    isError && toastMessage("Error while fetching", "error");
    isError && console.log(error);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openEditValauationFirmModal, setOpenEditValauationFirmModal] = useState(false);
    const handleOpenValauationFirmModal = () => setOpenEditValauationFirmModal(true);
    const handleCloseValauationFirmModal = () => setOpenEditValauationFirmModal(false);

    const [backendValErrors,setBackendValErrors]=useState({});
    

    const onSubmitInviteFormsubmit = async (data) => {
        setBlocked(true);
        console.log(data);
        const formdata = new FormData();
        formdata.append("company_name",data.valuation_firm_name);
        formdata.append("vrb_number",data.valuation_firm_v);
        formdata.append("isk_number",data.valuation_firm_isk_number);
        formdata.append("login_url","http://www.localhost:3000/complete-invite-by-login");
        formdata.append("registration_url","http://www.localhost:3000/complete-invite-by-registering");
        formdata.append("email",data.valuation_firm_admin_email);
        formdata.append("directors_name",data.valuation_firm_director_name);
       const result =await inviteUploader(formdata);
        console.log(result);
        if ('error' in result) {    
          toastMessage(result.error.data.message, "error");
          if('backendvalerrors' in result.error.data){
            setBackendValErrors(result.error.data.backendvalerrors);
            resetValuerInviteForm();
            setBlocked(false);   
          }  
        } else {

          toastMessage(result.data.message, "success");
          setBlocked(false);   
    
        }
    
    }
    return (

        <BlockUI blocked={blocked}>
            {/* close modal edit valuation firm */}
            <Modal
                open={openEditValauationFirmModal}
                onClose={handleCloseValauationFirmModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography>Edit Valauation Firm</Typography>
                    <Divider></Divider>
                    <Grid container spacing={2} sx={{ mt: 1 }} >
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography>Valuation Firm Name</Typography>
                            <TextField fullWidth />
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            {/* close modal edit valuation firm  */}

            <FlexBetween sx={{ ml: 5 }}>
                <Header sx={{ ml: 30 }} title="Valuation Firms" subtitle="List of Valuation Firms" />
                  </FlexBetween>
            {/* modal invite valuation firm */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        INVITE VALUATION FIRM
                    </Typography>
                    <hr></hr>
                    <form name='invitevaluationformform' onSubmit={handleInviteFormsubmit(onSubmitInviteFormsubmit)}>
                        {
                            sendingUploaderInvite &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                   
                        <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>

                            <Grid item xs={12} sm={6} md={6} >
                                <Typography>Valuation Firm</Typography>
                                <div>
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("valuation_firm_name")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_name?.message}</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <Typography>Admin Email</Typography>
                                <div>
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("valuation_firm_admin_email")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_admin_email?.message}</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} >
                                <Typography>ISK Number</Typography>
                                <div>
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("valuation_firm_isk_number")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_isk_number?.message}</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} >
                                <Typography>VRB Number</Typography>
                                <div>
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("valuation_firm_vrb_number")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_vrb_number?.message}</span>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} >
                                <Typography>Director Name</Typography>
                                <div>
                                    <TextField autoComplete="off" fullWidth {...registerInvitForm("valuation_firm_director_name")} />
                                    <span className='errorSpan' >{inviteFormErrors.valuation_firm_director_name?.message}</span>
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
             sx={{ mt: 10, ml: 10, mr: 10, height: "650px;",p:"5rem;" }}
             backgroundColor={theme.palette.background.alt}

              >
                {isFetching && <span>Is refetching</span>}
                {/* {isLoading&& <span>Is refetching</span>} */}
                <DataGrid
                    loading={isLoading || !firms}
                    getRowId={(row) => row.id}
                    rows={firms || []}
                    columns={columns}
                    initialState={{
                        ...firms,
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </Box>
        </BlockUI>

    )
}

export default AccesorValuationFirms
