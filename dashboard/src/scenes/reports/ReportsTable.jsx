import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'
import { useGetValuationReportsQuery } from '../../features/ValuationReportsSlice'
import { istofetchvaluationreports } from 'scenes/auth/authSlice';

import Valuationreportactions from 'scenes/reports/Valuationreportactions';
import { DownloadDoneOutlined, UpcomingOutlined } from '@mui/icons-material';


function ReportsTable  () {
    

    const columns = [
        {
            headerName: "LR Number",
            field: "property_lr",
            flex: 1,
        }, {
            headerName: "Valauation Date",
            field: "valuation_date",
            flex: 1
        }, {
            headerName: "Accesor Name",
            field: "organization_name",
            flex: 1
        }, {
            headerName: "Market Value",
            field: "market_value",
            flex: 1
        }, {
            headerName: "Forced Market value",
            field: "forced_market_value",
            flex: 1
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
    return (
        <div style={{ height: 475, width: '100%' }}>
            {isFetching&& <span>Is refetching</span>}
            {/* {isLoading&& <span>Is refetching</span>} */}
            <DataGrid
                loading={isLoading || !reports}
                getRowId={(row) => row.id}
                rows={reports || []}
                columns={columns}
            />
        </div>
    )
}

export default ReportsTable