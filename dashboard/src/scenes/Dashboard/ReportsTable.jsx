import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { useGetValuationReportsQuery } from './ValuationReportsSlice'


function ReportsTable() {
 
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
        }
    ];
    const {
        data: reports,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetValuationReportsQuery();

    console.log(reports);
    return (
        <div style={{ height: 400, width: '100%' }}>
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