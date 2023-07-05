import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'
import { useGetValuationReportsQuery } from '../../features/ValuationReportsSlice'
import { istofetchvaluationreports } from 'scenes/auth/authSlice';

import Valuationreportactions from 'scenes/reports/Valuationreportactions';
import { DownloadDoneOutlined, UpcomingOutlined } from '@mui/icons-material';

import { Box,useTheme } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ReportsTable () {
  const theme = useTheme();  
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


    const columns = [
        {
            headerName: "LR Number",
            field: "property_lr",
            flex: 1,
        }, {
            headerName: "Valuation Date",
            field: "valuation_date",
            flex: 1
        }, {
            headerName: "Client Name",
            field: "organization_name",
            flex: 1
        }, {
            headerName: "Market Value (KES)",
            field: "market_value",
            flex: 1
        }, {
            headerName: "Forced Sale value(KES)",
            field: "forced_market_value",
            flex: 1,
        },
        {
            field: 'actions',
            headerName: <DownloadDoneOutlined></DownloadDoneOutlined>,
            type: 'actions',
            width: 400,
            renderCell: (params) => <Valuationreportactions {...{ params }} />,
        }
    ];
    const {
        data: reports,
        isFetching,
        isLoading,
        refetch: refetchValuations,
        isSuccess,
        isError,
        error
    } =  useGetValuationReportsQuery();   
    isError &&   toastMessage("Error while fetching","error");
    isError && console.log(error);
    return (
        <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="5rem"
        borderRadius="0.55rem"
        width="100%"
        height="650px"

      >
    
            
            {isFetching&& <span>Is refetching</span>}
            {/* {isLoading&& <span>Is refetching</span>} */}
            <DataGrid
                loading={isLoading || !reports}
                getRowId={(row) => row.id}
                rows={reports || []}
                columns={columns}
                initialState={{
                    ...reports,
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
            />
        </Box>
    )
}

export default ReportsTable