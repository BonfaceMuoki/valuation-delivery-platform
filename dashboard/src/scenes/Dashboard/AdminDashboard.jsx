import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize,Input,Modal } from '@mui/material';
import Header from 'components/Header';
import StatBox from 'components/StatBox';
import { CasesOutlined, CommentBankOutlined, CorporateFareSharp, Email, MoneyOutlined } from '@mui/icons-material';
import ReportsTable from '../reports/ReportsTable';
import UploadReport from 'scenes/reports/UploadReport';
import { useGetAdminDashboardDetailsQuery } from 'features/retrieveAdminDashboardSlice';
import ValuationFirmRequests from 'scenes/organizations/ValuationFirmRequests';




function AdminDashboard() {
  
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const {data:adminDashboard,isLoading:loadingdashboard}=useGetAdminDashboardDetailsQuery();
  return (
    <Box m={isNonMediumScreens ? "1.5rem 1.5rem 0rem" : "1.5rem 1.5rem 0rem"}
    >
      <FlexBetween>
        <Header title="Dashbaord" subtitle="Welcome to your Dashaboard" />
        <UploadReport/>
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* row 1 */}
        <StatBox
          title="Total Valuers"
          value={adminDashboard?.allvaluers}
          increase=""
          description="Since First Day"
          icon={
            <MoneyOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Lenders / Courts"
          value={adminDashboard?.allaccesors}
          increase=""
          description="This Month"
          icon={
            <CasesOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="System Access Requests"
          value={adminDashboard?.allaccesors}
          increase=""
          description="Valuer / Courts / Lenders"
          icon={
            <CorporateFareSharp
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* row 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 5"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
          width="100%"
        >
         <ValuationFirmRequests/>
        </Box>

      </Box>
    </Box>
  )
}

export default AdminDashboard;
