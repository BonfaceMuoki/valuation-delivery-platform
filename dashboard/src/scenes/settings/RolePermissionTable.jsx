import React from 'react'
import AddRole from './AddRole'
import { DataGrid } from '@mui/x-data-grid'
import { Box,Button } from '@mui/material';
import RolesActions from './RolesActions';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import { Add } from '@mui/icons-material';

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
        renderCell: (params) => <RolesActions {...{ params }} />,
    }
];
const roles = [
    {
        name: "Add permission",
        id: 1
    }, {
        name: "Add Role",
        id: 2
    },
];
const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);
return (

    <>

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
        <Box sx={{ mt: 10, ml: 10, mr: 10, height: "450px;" }} >
            <DataGrid
                columns={columns}
                rows={roles}
                getRowId={(row) => row.id}

            />
        </Box>
    </>

)
}

export default RolePermissionTable