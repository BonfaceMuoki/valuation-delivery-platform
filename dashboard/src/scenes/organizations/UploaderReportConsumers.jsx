import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, ButtonBase, TextField, Grid, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';
import { useMediaQuery } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useGetAccesorsFirmsQuery } from 'features/accessorFirmsSlice';
import { useSendAccesorInviteMutation } from 'features/sendAccesornviteSlice';
import CircularProgress from '@mui/material/CircularProgress';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function UploaderReportConsumers(row) {
    
    const [blocked, setBlocked] = useState(false);
    const base_url = process.env.REACT_APP_FRONTEND_BASE_URL;
    console.log(base_url);
    const viewValuationFirmDetails = (row) => {

    }
    const editValuationFirm = (row) => {

    }
    const blockValuationFirm = (row) => {

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
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 400,
            renderCell: (params) => {
                return <>
                    <Button variant='contained' onClick={() => viewValuationFirmDetails(params.row)}>view</Button> &nbsp;&nbsp;
                    <Button variant='contained' onClick={() => editValuationFirm(params.row)}>Edit</Button> &nbsp;&nbsp;
                    <Button variant='contained' onClick={() => blockValuationFirm(params.row)} >Block</Button>
                </>
            },
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
    } = useGetAccesorsFirmsQuery();
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    ///intialize invite form
    const inviteformschema = yup.object().shape({
        accesor_name: yup.string().required("Please provide the Accesor name"),
        email: yup.string().email("Plase provide valid Email").required("Please provide email"),
        contact_person_phone: yup.string().required("Please provide the Contact person phone"),
        contact_person_name: yup.string().required("Please provide the contact Person name")
    });
    const {
        register: registerInvitForm,
        handleSubmit: handleInviteFormsubmit,
        reset:resetAccesorInviteForm,
        formState: { errors: inviteFormErrors } } = useForm({
            resolver: yupResolver(inviteformschema)
        });
    ///intialize invite form
    const [backendValErrors,setBackendValErrors]=useState({});
    const [sendAccesorInvite, { isLoading: sendingAccesorInvite }] = useSendAccesorInviteMutation();
    const onSubmitInviteFormsubmit = async (data) => {
        const formData = new FormData();
        formData.append("register_as", "Report Accessor Admin");
        formData.append("contact_person_name", data.contact_person_name);
        formData.append("full_name", data.contact_person_name);
        formData.append("contact_person_phone", data.contact_person_phone);
        formData.append("login_url", `${base_url}/complete-accesor-invite-by-login`);
        formData.append("registration_url", `${base_url}/complete-accesor-invite-by-registering`);
        formData.append("email", data.email);
        formData.append("accesor_name", data.accesor_name);
        const result =await sendAccesorInvite(formData);
        console.log(result);
        if ('error' in result) {    
          toastMessage(result.error.data.message, "error");
          if('backendvalerrors' in result.error.data){
            setBackendValErrors(result.error.data.backendvalerrors);
            resetAccesorInviteForm();
            setBlocked(false);   
          }  
        } else {

          toastMessage(result.data.message, "success");
          setBlocked(false);   
    
        }

    }

    return (
    <BlockUI blocked={blocked}>
        <ConfirmDialog />
        <FlexBetween sx={{ ml: 5 }}>
            <Header sx={{ ml: 30 }} title="Report Consumers" subtitle="List of Report Consumers" />
            <Button sx={{ mt: 10, ml: 10, mr: 10 }} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; New REport Accessor</Button>
        </FlexBetween>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    INVITE ACCESOR FIRM
                </Typography>
                <hr></hr>
                <form name='invitevaluationformform' onSubmit={handleInviteFormsubmit(onSubmitInviteFormsubmit)}>
                {
                            sendingAccesorInvite &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                    <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>

                        <Grid item xs={12} sm={6} md={6} >
                            <Typography>Accesor Name</Typography>
                            <div>
                                <TextField autoComplete="off" fullWidth {...registerInvitForm("accesor_name")} />
                                <span className='errorSpan' >{inviteFormErrors.accesor_name?.message}</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} >
                            <Typography>Admin Email</Typography>
                            <div>
                                <TextField autoComplete="off" fullWidth {...registerInvitForm("email")} />
                                <span className='errorSpan' >{inviteFormErrors.email?.message}</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} >
                            <Typography>Contact Person Name</Typography>
                            <div>
                                <TextField autoComplete="off" fullWidth {...registerInvitForm("contact_person_name")} />
                                <span className='errorSpan' >{inviteFormErrors.contact_person_name?.message}</span>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} >
                            <Typography>Contact Person Phone</Typography>
                            <div>
                                <TextField autoComplete="off" fullWidth {...registerInvitForm("contact_person_phone")} />
                                <span className='errorSpan' >{inviteFormErrors.contact_person_phone?.message}</span>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} >
                            {
                                !sendingAccesorInvite && <Button variant='contained' fullWidth type="submit">Send Invite</Button>
                            }
                            
                        </Grid>

                    </Grid>
                </form>
            </Box>
        </Modal>
        <Box sx={{ mt: 10, ml: 10, mr: 10, height: "650px;" }} >

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

export default UploaderReportConsumers