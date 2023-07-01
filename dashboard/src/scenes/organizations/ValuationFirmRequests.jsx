
import React, { useEffect, useState } from 'react'
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
import { useArchiveUploaderRegistrationRequestMutation, useRequestUploaderRegistrationStatusQuery } from 'features/registerUploaderCompanySlice';

import ValuationFirmActions from './ValuationFirmActions';
import { useMediaQuery } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "../../assets/scss/validation.css";
import { ToastContainer, toast } from 'react-toastify';
import { useGetValuationFirmsQuery } from 'features/valuationFirmsSlice';
import { useInviteUploaderMutation } from 'features/inviteUploaderSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useApproveValuationFirmRequestMutation, useGetValuationFirmRequestsQuery, useRejectValuationFirmRequestMutation } from 'features/valuationFirmRequestsSlice';
import { useTheme } from '@emotion/react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function ValuationFirmRequests(row) {
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
    const [acceptValuationAccessRequest, { isLoading: sendingUploaderInvite }] = useApproveValuationFirmRequestMutation();
    const [rejectValuationFirmRequest, { isloading: sendingReject }] = useRejectValuationFirmRequestMutation();
    const [blocked, setBlocked] = useState(false);
    const acceptRequest = (row) => {
        confirmDialog({
            message: `Are you sure you want to accept registration for ${row.valauaion_firm_name}?. This will send aan email to them to set up an admin account which will allow them access the system..`,
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => acceptAcceptingRegistartion(row.id, 1), // Pass row.id as a parameter to accept function
            reject: () => { } // Empty reject function for now
        });
    }
    const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;
    const acceptAcceptingRegistartion = async (data) => {
        setBlocked(true);
        const formData = new FormData();
        formData.append("request_id", data);
        formData.append("login_url", `${frontendbaseurl}/complete-invite-by-login`);
        formData.append("registration_url", `${frontendbaseurl}/complete-invite-by-registering`);
        const result = await acceptValuationAccessRequest(formData);
        if ('error' in result) {
            toastMessage(result.error.data.message, "error");
            if ('backendvalerrors' in result.error.data) {
                toastMessage(result.data.message, "error");
                // setBackendValErrors(result.error.data.backendvalerrors);
            }
            setBlocked(false);
        } else {
            toastMessage(result.data.message, "success");
            setBlocked(false);
        }
      

        refetchFirmRequests();
    }
    const [activeRequest,setActiveRequest]=useState(0);
    const declineRequest = (row) => {
        setActiveRequest(row.id);
        setOpenRejectNotModal(true);
        // rejectValuationFirmRequest();
    }
    const submitDeclineRequest =  async(data) => {
        console.log(data);
        const formData = new FormData()
        formData.append("invite",activeRequest);
        formData.append("reason",data.reasonForRejection);
        const result = await rejectValuationFirmRequest(formData);
        if ('error' in result) {
            toastMessage(result.error.data.message, "error");
            if ('backendvalerrors' in result.error.data) {
                toastMessage(result.data.message, "error");
                // setBackendValErrors(result.error.data.backendvalerrors);
            }
        } else {
            toastMessage(result.data.message, "success");
            refetchFirmRequests();
        }

        // rejectValuationFirmRequest();
    }
    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    ///intialize invite form
    ///intialize invite form
    //intialize edit form
    ///intialize edit form
    const [regOrgDetails,setRegOrgDetails]=useState();
    const {data:requestregdetails,isLoading:isLoadingRequestDetails}=  useRequestUploaderRegistrationStatusQuery(activeRequest);
    useEffect(()=>{
      if(requestregdetails?.orgdetails){
        setRegOrgDetails(requestregdetails?.orgdetails);
      }
    },[requestregdetails,isLoadingRequestDetails]);
    const viewRegistrationStatus = async (row)=>{  
       setActiveRequest(row.id);
       setOpenRequestDetailsModal(true);
    }
    const viewCompanyStatus = async (row)=>{  
        setActiveRequest(row.id);
        setOpenRequestDetailsModal(true);
     }
     const [archiveRequestt]=useArchiveUploaderRegistrationRequestMutation();
     const archiveRequest = async(row)=>{
        const formData= new FormData();
        formData.append("invite",row.id);
        const result = await archiveRequestt(formData);
        if ('error' in result) {
            toastMessage(result.error.data.message, "error");
            if ('backendvalerrors' in result.error.data) {
                toastMessage(result.data.message, "error");
                // setBackendValErrors(result.error.data.backendvalerrors);
            }
        } else {
            toastMessage(result.data.message, "success");
            refetchFirmRequests();
        }
     }
    const columns = [
        {
            headerName: 'Name',
            field: 'valauaion_firm_name',
            flex: 1
        },
        {
            headerName: 'Phone',
            field: 'invite_phone',
            flex: 1
        },
        {
            headerName: 'Email',
            field: 'invite_email',
            flex: 1
        },
        {
            headerName: 'VRB',
            field: 'vrb_number',
            flex: 1
        },
        {
            headerName: 'ISK NUmber',
            field: 'isk_number',
            flex: 1
        }
        ,
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 400,
            renderCell: (params) => {
                if (params.row.status === "Requested") {
                    return <>
                        <Button variant='contained' onClick={() => acceptRequest(params.row)}>Accept Request</Button> &nbsp;&nbsp;
                        <Button variant='contained' onClick={() => declineRequest(params.row)} >Decline Request</Button>
                    </>
                } else if (params.row.status === "Approved") {
                    return <>
                        <Button variant='contained' sx={{ width: "75%;" }} onClick={() => viewRegistrationStatus(params.row)}>View Registration Status</Button> &nbsp;&nbsp;
                    </>
                } else if (params.row.status === "Rejected") {
                    return <>
                        <Button variant='contained' sx={{ width: "75%;" }} onClick={() => archiveRequest(params.row)} >Archive Request</Button> &nbsp;&nbsp;
                    </>
                } else if (params.row.status === "Registered") {
                    return <>
                        <Button variant='contained' sx={{ width: "75%;" }} onClick={() => viewCompanyStatus(params.row)}>View Company Details</Button> &nbsp;&nbsp;
                    </>
                }

            },
        }
    ];
    const {
        data: firms,
        isFetching,
        isLoading,
        refetch: refetchFirmRequests,
        isSuccess,
        isError,
        error
    } = useGetValuationFirmRequestsQuery();
    const theme = useTheme();
    const [openRejectNoteModal, setOpenRejectNotModal] = useState(false);
    const handleCloseRejectModal = () => {
        setOpenRejectNotModal(false);
    }
    const [openRequestDetailsModal, setOpenRequestDetailsModal] = useState(false);
    const handleCloseRequestDetailsModal = () => {
        setOpenRequestDetailsModal(false);
    }
    //process decline form
    const schema = yup.object().shape({
        reasonForRejection:yup.string().required("Reason is required")
    });
    const {register: registerDeclineForm, handleSubmit: handleSubmitDeclineForm, formState:{errors: registerDeclineFormErrorrs}} = useForm({
        resolver:yupResolver(schema)
    })
    // const [submitRequestDecline,]
    //process decline form
    return (
        <BlockUI blocked={blocked} fullScreen >
            <ConfirmDialog />
            {/* close modal details valuation firm */}
            <Modal
                open={openRequestDetailsModal}
                onClose={handleCloseRequestDetailsModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                   <Typography variant='h2' >Requet Details</Typography>
                   <Divider/>
                   <Grid container spacing={1}>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >Company Name: </Grid>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}}  >{regOrgDetails?.organization_name}</Grid>
                   </Grid>
                   <Divider/>
                   <Grid container spacing={1}>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}}  >Phone: </Grid>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >{regOrgDetails?.organization_phone}</Grid>
                   </Grid>
                   <Divider/>
                   <Grid container spacing={1}>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >Email: </Grid>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >{regOrgDetails?.organization_email}</Grid>
                   </Grid>

                   <Divider/>
                   <Grid container spacing={1}>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >ISK Number: </Grid>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >{regOrgDetails?.isk_number}</Grid>
                   </Grid>
                   <Divider/>
                   <Grid container spacing={1}>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >VRB Number: </Grid>
                      <Grid item xs={12} md={6} sm={12} sx={{padding:1}} >{regOrgDetails?.directors_vrb}</Grid>
                   </Grid>
                   <Divider/>
                </Box>
            </Modal>
            {/* close modal details valuation firm  */}
            <FlexBetween sx={{ ml: 5 }}>
                <Header sx={{ ml: 30 }} title="Valuation Firm Requests" subtitle="List of Valuation Firm Requests" />
            </FlexBetween>
            {/* modal invite valuation firm */}
            <Modal
                open={openRejectNoteModal}
                onClose={handleCloseRejectModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={handleSubmitDeclineForm(submitDeclineRequest)} >
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 5 }} >
                        Decline Registration Access
                    </Typography>
                    <hr></hr>

                    <TextField placeholder='Reason for rejection / Instruction on the next action' fullWidth
                        multiline
                        rows={4} sx={{ mt: 3, mb:3 }} {...registerDeclineForm('reasonForRejection')} />
                       <span className='errorSpan' > {registerDeclineFormErrorrs.reasonForRejection?.message}</span>
                    <Button variant='contained' type='submit' sx={{ mt: 2, height:60 }} fullWidth >Submit </Button>
                    </form>
                </Box>
            </Modal>


            <Box sx={{ mt: 2, ml: 2, mr: 2, height: "650px;", backgroundColor: theme.palette.background.alt, padding: 5 }} >
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

export default ValuationFirmRequests
