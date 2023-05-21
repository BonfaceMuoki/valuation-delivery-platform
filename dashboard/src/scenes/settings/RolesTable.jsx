import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button, Grid, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import RolesActions from './RolesActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';
import { Divider } from 'antd';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { BlockUI } from 'primereact/blockui';
import { Panel } from 'primereact/panel';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import "../../assets/scss/validation.css"
import { useGetRolesListQuery } from 'features/rolesSlice';
import { useGetPermissionsListQuery } from 'features/permissionsSlice';
import { useAssignRolePermissionsListMutation } from 'features/assignRolePermissionsSlice';
import { useAddRoleMutation } from 'features/addRoleSlice';
import { apiSlice } from 'features/apiSlice';
import { useUpdateRoleMutation } from 'features/updateRoleSlice';

const style = {
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
function RolesTable() {

  const toastMessage = (message,type)=>{
    if(type=="success"){
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }else if(type=="error"){
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }else if(type=="warning"){
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }
  } 

  const { data: allpermissions,
    isFetching: isFetchingpermissions,
    isLoading: isLoadingPermissions,
    refetch: refetchPermissions,
    isSuccess: isSuccessPermission,
    isError: isErrorPermissions,
    error: errorPermissions } = useGetPermissionsListQuery();
  const { data: roleslist,
    isFetching,
    isLoading,
    refetch: refetchRoles,
    isSuccess,
    isError,
    error } = useGetRolesListQuery();

  const [allperms, setAllPerms] = useState(null);
  useEffect(() => {
    setAllPerms(allpermissions);
  }, [allpermissions]);


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
  const [sendAddRole,{isLoading: addingRole,}] = useAddRoleMutation({
    // Define onSuccess callback
    onSuccess: () => {
      alert("SUcceded")
      // Refetch data after successful mutation
      apiSlice.endpoints.getRolesList.invalidate();
    },
  });
  const addRoleFormSchema = yup.object().shape({
    role_name: yup.string().required("The role Name is required")
  });
  const { register: registerAddRoleForm, handleSubmit: handleSubmitAddRoleForm, formState: { errors: addRoleFormErrors }, reset : resetAddroleForm } = useForm({
    resolver: yupResolver(addRoleFormSchema)
  });
  const submitAddRoleForm = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("role_name",data.role_name);    
    const result = await sendAddRole(formData);
    if ('error' in result) {
      toastMessage(result.error.data.message,"error");

    } else {
      resetAddroleForm();
      toastMessage(result.data.message,"success");

    }
    refetchRoles();
  }
  // close add role
  //edit role form
  const [submitUpdateRole, {isLoading: updatingrole, isError: errorUpdatingRole}] = useUpdateRoleMutation();
  const [roleToEdit, setRoleToEdit] = useState();
  const [roleNameToEdit, setRoleNameToEdit] = useState();
  const editRoleFormSchema = yup.object().shape({
    role_name: yup.string().required("Role Name is required")
  })
  const { register: registerEditRoleForm, handleSubmit: handleSubmitEditRoleForm, setValue: setEditValue, setFocus: setEditFocus, formState: { errors: editRoleForErrors } } = useForm({
    resolver: yupResolver(editRoleFormSchema)
  });
  const SubmitEditRoleForm = async(data) => {
   console.log(data);
   const role_name= data.role_name;
   const role=data.role;
   const updatedata ={role_name:role_name};
   const result = await submitUpdateRole({data:updatedata,role});
   if ('error' in result) {
    toastMessage(result.error.data.message,"error");

  } else {
    resetAddroleForm();
    toastMessage(result.data.message,"success");
    handleCloseEditRoleModal();

  }
   refetchRoles();

  }
  const handleRoleNameToEditChange = (event) => {
    setRoleNameToEdit(event.target.value);
  }

  ///close edit role form
  // design view form
  const [assignPolePermissions,{isloading: isLoadingAssignPermissions}] = useAssignRolePermissionsListMutation();
  const { register: registerrolepermissionsform, handleSubmit: handlerolePermissionsForm } = useForm();
  const seeRoleDetails = (row) => {
    console.log(row.permissions);
    setSelectedRole(row);
    setselectedRolePermissions(row.permissions);
    handleOpenViewPermissionsModal();
  }
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedRolePermissions, setselectedRolePermissions] = useState();

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const isPermissionChecked = (permissionId) => {
    return selectedRolePermissions.some((selectedPerm) => selectedPerm.id == permissionId);
  };
  const submitRolePermissions = async (data) => {
    const rolepermissionsselected = Object.entries(data)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => parseInt(key));
    console.log(rolepermissionsselected);
    const formdata = new FormData();
    rolepermissionsselected.forEach((item, index) => {
      formdata.append('permissions[]', item);
    });
    formdata.append("role", selectedRole.id);    
    const result = await assignPolePermissions(formdata);
    if ('error' in result) {
      toastMessage(result.error.data.message,"error");

    } else {
      resetAddroleForm();
      toastMessage(result.data.message,"success");

    }
    refetchRoles();


  }
  // design view form
  //design forms


  const [blocked, setBlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEditRoleModal, setOpenEditRoleModal] = useState(false);

  const handleOpenEditRoleModal = () => setOpenEditRoleModal(true);

  const [openViewPermissionsModal, setOpenViewPermissionsModal] = useState(false);
  const handleOpenViewPermissionsModal = () => setOpenViewPermissionsModal(true);
  const handleCloseViewPermissionsModal = () => setOpenViewPermissionsModal(false);

  const roleInputRef = useRef(null);
  const nameInputRef = useRef(null);


  const handleCloseEditRoleModal = () => {

    setEditValue("role", "");
    setEditValue("role_name", "");
    setOpenEditRoleModal(false);

  }


  const displayEditModalForRole = (rolee) => {
    setRoleToEdit(rolee.id);
    setRoleNameToEdit(rolee.name);
    setEditValue("role", rolee.id);
    setEditValue("role_name", rolee.name);
    setEditFocus("role_name", rolee.name);
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
      <Modal
        open={openViewPermissionsModal}
        onClose={handleCloseViewPermissionsModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll' }}
      >
        <Box sx={style}>
          <Typography>{selectedRole.name} Permissions</Typography>
          <Divider></Divider>
          <form onSubmit={handlerolePermissionsForm(submitRolePermissions)}>
            <Grid container pacing={2} sx={{ mt: 1 }}>
              
              <Grid item sm={12} xs={12} md={12}>
                <FormGroup>
                  {
                    (allperms != null && selectedRolePermissions != null) &&
                    allperms.map((perm) => (
                      <FormControlLabel
                        key={perm.id}
                        control={
                          <Checkbox
                            defaultChecked={isPermissionChecked(perm.id)}
                            disabled={false}
                            {...registerrolepermissionsform(`${perm.id}`)}
                          />
                        }
                        label={perm.name}
                      />
                    ))
                  }
                </FormGroup>
                <Grid item sm={12} xs={12} md={12}>
                  <Button variant='contained' sx={{ mt: 3, height: 50, backgroundColor: "blue", color: "white" }} type="submit" fullWidth>Save</Button>
                </Grid>
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

      <Box sx={{ mt: 10, ml: 10, mr: 10, height: "650px;" }} >

        <DataGrid
          loading={isLoading || !roleslist}
          getRowId={(row) => row.id}
          columns={columns}
          rows={roleslist || []}
          initialState={{
            ...roleslist,
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </BlockUI>

  )
}

export default RolesTable