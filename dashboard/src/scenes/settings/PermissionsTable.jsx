import React,{useEffect,useState} from 'react'
import AddRole from './AddRole'
import { DataGrid } from '@mui/x-data-grid'
import RolesActions from './RolesActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';
import { Row,Col } from 'antd';
import { useGetPermissionsListQuery } from 'features/permissionsSlice';
import { Box, Button, Grid, TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { Divider } from 'antd';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ToastContainer, toast } from 'react-toastify';
import { useAddPermissionMutation } from 'features/addPermissionSlice';
import { apiSlice } from 'features/apiSlice';


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
function PermissionsTable() {

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
        headerName: "PERMISSION ID",
        field: "id",
        flex: 1
    },
    {
        headerName: "PERMISSION NAME",
        field: "name",
        flex: 1
    },
    {
        field: 'actions',
        headerName: "Actions",
        type: 'actions',
        width: 400,
        renderCell: (params) => <RolesActions {...{ params }} />,
    }
];
const { data: allpermissions,
  isFetching: isFetchingpermissions,
  isLoading: isLoadingPermissions,
  refetch: refetchPermissions,
  isSuccess: isSuccessPermission,
  isError: isErrorPermissions,
  error: errorPermissions } = useGetPermissionsListQuery();

const [allperms, setAllPerms] = useState(null);
useEffect(() => {
  setAllPerms(allpermissions);
}, [allpermissions]);
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
  //add permissions
  const [sendAddPermission, { isLoading: addingRole, }] = useAddPermissionMutation({
    // Define onSuccess callback
    onSuccess: () => {
      // Refetch data after successful mutation
      apiSlice.endpoints.getRolesList.invalidate();
    },
  });
  const addPermissionFormSchema = yup.object().shape({
    permission_name: yup.string().required("The Permission Name is required")
  });
  const { register: registerAddPermissionForm, handleSubmit: handleSubmitAddPermissionForm, formState: { errors: addPermissionFormErrors }, reset: resetAddPermissionForm } = useForm({
    resolver: yupResolver(addPermissionFormSchema)
  });
  const submitAddRoleForm = async (data) => {
    console.log(data);
    const formData = new FormData();
    
    formData.append("permission_name", data.permission_name);

    const result = await sendAddPermission(formData);

    if ('error' in result) {
      toastMessage(result.error.data.message, "error");

    } else {
      resetAddPermissionForm();
      toastMessage(result.data.message, "success");
    }
    refetchPermissions();
  }
  // close add permissions
return (

    <>

<FlexBetween sx={{ml:5}}>
    <Header sx={{ml:30}} title="Permissions" subtitle="List of Permissions" />
    <Button sx={{ mt: 10, ml: 10, mr: 10}} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; New Permission</Button>
  </FlexBetween>
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
       <Box sx={style} >
          <form name="addroleform" onSubmit={handleSubmitAddPermissionForm(submitAddRoleForm)}>
            <Grid container spacing={2} sx={{ mt: 1 }}  >
              <Typography>Youa are about to Add a new Permission</Typography>
              <Divider></Divider>
              <Grid item xs={12} sm={12} md={12} >
                <Typography>Permission Name</Typography>
                <TextField sx={{ mt: 2 }} fullWidth {...registerAddPermissionForm("permission_name")} ></TextField>
                <span className='errorSpan'>{addPermissionFormErrors.permission_name?.message}</span>
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
  loading={isLoadingPermissions || !allperms}
  getRowId={(row) => row.id}
  columns={columns}
  rows={allperms || []}
  initialState={{
    ...allperms,
    pagination: { paginationModel: { pageSize: 10 } },
  }}
  pageSizeOptions={[5, 10, 25]}
/>
</Box>
    </>

)
}

export default PermissionsTable