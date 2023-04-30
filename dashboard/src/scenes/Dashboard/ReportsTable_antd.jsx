import React from 'react'
import { Table, Popconfirm, Button } from 'antd'
import { useGetValuationReportsQuery } from './ValuationReportsSlice'


function ReportsTable() {
    const handleDeleteReports = ()=>{
        console.log("deleted");
    }
    const columns = [
       {
            title: "LR Number",
            dataIndex: "property_lr",
            fixed:"left"
        }, {
            title: "Valauation Date",
            dataIndex: "valuation_date"
        }, {
            title: "Accesor Name",
            dataIndex: "organization_name"
        }, {
            title: "Market Value",
            dataIndex: "market_value"
        }, {
            title: "Forced Market value",
            dataIndex: "forced_market_value"
        }, {
            title: "Actions",
            render: (_, record) =>
                (reports?.reports.length) >= 1 ? (
                    <Popconfirm
                    title="Are you sure you want to delete?"
                        onConfirm={handleDeleteReports }
                    >
                        <Button
                            type='primary'
                            danger
                        >
                            Delete
                        </Button>

                    </Popconfirm>) : null

        }
    ];
    const {
        data: reports,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetValuationReportsQuery();
    console.log(reports?.reports);
    return (
        <div>
            <Table
                columns={columns}
                dataSource={reports?.reports}
                bordered
                loading={isLoading}
                scroll={{ x: 'calc(700px + 50%)', y: 700 }}
            />
        </div>
    )
}

export default ReportsTable