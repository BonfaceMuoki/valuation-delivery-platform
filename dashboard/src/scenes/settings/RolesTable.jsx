import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Grid, TextField } from '@mui/material';
import RolesActions from './RolesActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';
import { Divider } from 'antd';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';
import { Panel } from 'primereact/panel';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import  "../../assets/scss/validation.css"
import { useGetRolesListQuery } from 'features/rolesSlice';


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
function RolesTable() {
  const {data: roleslist,
    isFetching,
    isLoading,
    refetch: refetchRoles,
    isSuccess,
    isError,
    error} = useGetRolesListQuery();
  console.log(roleslist);
  const toast = useRef(null);
  const seeRoleDetails = ()=>{

  }

  const columns = [
    {
      headerName: "ROLE ID",
      field: "id",
      flex: 1
    },
    {
      headerName: "ROLE NAME",
      field: "name",
      flex: 1
    },
    {
      field: 'actions',
      headerName: "Actions",
      type: 'actions',
      width: 400,
      renderCell: (params) => {
        return <>
          <Button variant='contained' onClick={() => seeRoleDetails(params.row)}>view</Button> &nbsp;&nbsp;
          <Button variant='contained' onClick={() => displayEditModalForRole(params.row)}>Edit</Button> &nbsp;&nbsp;
          <Button variant='contained' onClick={() => handleOnDelete(params.row)} >Delete</Button>
        </>
      },
    }
  ];
 
// design forms
  //add role
  const addRoleFormSchema = yup.object().shape({
  role_name: yup.string().required("The role Name is required")
  });
  const {register: registerAddRoleForm,handleSubmit: handleSubmitAddRoleForm,formState:{ errors: addRoleFormErrors}  } = useForm({
    resolver: yupResolver(addRoleFormSchema)
  });
  const submitAddRoleForm = (data) =>{
    console.log(data);
  }
   // close add role
   //edit role form
   const [roleToEdit, setRoleToEdit] = useState();
   const [roleNameToEdit, setRoleNameToEdit] = useState();
   const editRoleFormSchema = yup.object().shape({
    role_name: yup.string().required("Role Name is required")
   })
   const { register: registerEditRoleForm, handleSubmit: handleSubmitEditRoleForm,setValue: setEditValue,setFocus:setEditFocus ,formState:{ errors: editRoleForErrors} } = useForm({
    resolver: yupResolver(editRoleFormSchema)
   });
   const SubmitEditRoleForm = (data)=>{
      // const updatedroles= roles.map((role,key)=>{
      //   if(role.id==data.role){
      //     role.name=data.role_name;
      //   }
      //   return role;
      // })
      // console.log(updatedroles);
    
   }
   const handleRoleNameToEditChange =(event)=>{
     setRoleNameToEdit(event.target.value);
   }

   ///close edit role form
//design forms


  const [blocked, setBlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false);

  const handleOpenEditRoleModal = () => setOpenEditRoleModal(true);

  const roleInputRef = useRef(null);
  const nameInputRef = useRef(null);


  const handleCloseEditRoleModal = () => {

    setEditValue("role","");
    setEditValue("role_name","");
    setOpenEditRoleModal(false);

  }

 
  const displayEditModalForRole = (rolee) => {
    setRoleToEdit(rolee.id);
    setRoleNameToEdit(rolee.name);
    setEditValue("role",rolee.id);
    setEditValue("role_name",rolee.name);
    setEditFocus("role_name",rolee.name);
    setOpenEditRoleModal(true);
   
  }

  const acceptDEletionOfRole = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const rejectDeletionOfRole = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  const handleOnDelete = (row) => {
    confirmDialog({
      message: `Do you want to delete  ' ${row.row.name} ' Role?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-success',
      acceptDEletionOfRole,
      rejectDeletionOfRole
    });
  }


  return (

    <BlockUI blocked={blocked}>
       <Toast ref={toast} />
      <ConfirmDialog />
      <Modal
          open={open}
          onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
        <form name="addroleform" onSubmit={handleSubmitAddRoleForm(submitAddRoleForm)}>
          <Grid container spacing={2} sx={{ mt: 1 }}  >
            <Typography>Youa are about to Add a new Role</Typography>
            <Divider></Divider>
            <Grid item xs={12} sm={12} md={12} >
              <Typography>Role Name</Typography>
              <TextField sx={{ mt: 2 }} fullWidth {...registerAddRoleForm("role_name")} ></TextField>
              <span className='errorSpan'>{addRoleFormErrors.role_name?.message}</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12} > <br />
              <Button type='submit' variant='contained' fullWidth>SAVE</Button>
            </Grid>
          </Grid>
          </form>
        </Box>




      </Modal>
      <FlexBetween sx={{ ml: 5 }}>
        <Header sx={{ ml: 30 }} title="Roles" subtitle="List of Roles" />
        <Button sx={{ mt: 10, ml: 10, mr: 10 }} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; New Role</Button>
      </FlexBetween>
      <Modal

      open={openEditRoleModal}
      onClose={handleCloseEditRoleModal}      
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"

      >
        <Box sx={style}>
        <form name="editroleform" onSubmit={handleSubmitEditRoleForm(SubmitEditRoleForm)}>
          <Grid container spacing={2} sx={{ mt: 1 }}  >
            <Typography>Youa are about to edit {roleNameToEdit} Role</Typography>
            <Divider></Divider>
            <Grid item xs={12} sm={12} md={12} >
              <Typography>Role Name</Typography>
              <input type="hidden"
               value={roleToEdit} 
               {...registerEditRoleForm("role")}
               />
              <TextField sx={{ mt: 2 }}
               fullWidth {...registerEditRoleForm("role_name")}
               >

               </TextField>
              <span className='errorSpan'>{editRoleForErrors.role_name?.message}</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12} > <br />
              <Button type='submit' variant='contained' fullWidth>SAVE</Button>
            </Grid>
          </Grid>
          </form>
        </Box>
      </Modal>
    
      <Box sx={{ mt: 10, ml: 10, mr: 10, height: "450px;" }} >
     
        <DataGrid
          loading={isLoading || !roleslist}
          getRowId={(row) => row.id}
          columns={columns}
          rows={roleslist || []}
        />
      </Box>
      </BlockUI>

  )
}

export default RolesTable