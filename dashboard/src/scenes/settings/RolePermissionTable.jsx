import React,{useEffect, useState} from 'react'
import AddRole from './AddRole'
import { DataGrid } from '@mui/x-data-grid'
import { Box,Button } from '@mui/material';
import RolesActions from './RolesActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetRolePermissionsQuery } from 'features/rolePermissionsSlice';

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
function RolePermissionTable() {


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
        headerName: "ROLE ID",
        field: "role_id",
        flex: 1
    },
    {
        headerName: "ROLE NAME",
        field: "role_name",
        flex: 1
    },
    ,
    {
        headerName: "PERMISSION NAME",
        field: "permission_name",
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
const { data: allrolepermissions,
  isFetching: isRolePermissions,
  isLoading: isLoadingRolePermissions,
  refetch: refetchRolePermissions,
  isSuccess: isSuccessRolePermission,
  isError: isErrorRolePermissions,
  error: errorPermissions } = useGetRolePermissionsQuery();

const [roles, setRoles] = useState(null);
useEffect(()=>{
setRoles(allrolepermissions);
},[allrolepermissions]);
const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const getRowId = (row) => {
  // Generate custom ID based on row properties
  return `${row.role_id}-${row.permission_id}`;
};

return (

    <Box>

<FlexBetween sx={{ml:5}}>
    <Header sx={{ml:30}} title="Role Permissions" subtitle="List of Role Permissios" />
    <Button sx={{ mt: 10, ml: 10, mr: 10}} variant='contained' onClick={handleOpen}> <Add></Add>&nbsp;&nbsp; Assign Role Permissions</Button>
  </FlexBetween>
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Text in a modal
      </Typography>
      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </Typography>
    </Box>
  </Modal>
  <Box sx={{ mt: 10, ml: 10, mr: 10, height: "650px;" }} >

        <DataGrid
          getRowId={getRowId}
          columns={columns}
          rows={roles || []}
          initialState={{
            ...roles,
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
    </Box>

)
}

export default RolePermissionTable