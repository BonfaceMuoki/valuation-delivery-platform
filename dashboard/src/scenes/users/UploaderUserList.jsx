import React,{useState} from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Button } from '@mui/material';
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
  return (
    
    <BlockUI blocked={blocked}>
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