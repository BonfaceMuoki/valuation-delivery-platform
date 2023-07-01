import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize,Input,Modal } from '@mui/material';
import Header from 'components/Header';
import StatBox from 'components/StatBox';
import { Email, CalendarMonthOutlined, CorporateFareOutlined, DocumentScannerOutlined } from '@mui/icons-material';
import ReportsTable from '../reports/ReportsTable';
import UploadReport from 'scenes/reports/UploadReport';
import { useGetValuerDashboardDetailsQuery } from 'features/retrieveValuerDashboardSlice';




function ValuerDashboard() {  
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const {data:valuerdashboard,isLoading:loadingdashboard}=useGetValuerDashboardDetailsQuery();
  console.log(valuerdashboard);
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
          title="Total Reports"
          value={valuerdashboard?.allreports}
          increase=""
          description="All Reports"
          icon={
            <DocumentScannerOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Reports"
          value={valuerdashboard?.thismonthreports}
          increase=""
          description="This Month"
          icon={
            <CalendarMonthOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Clients served"
          value={valuerdashboard?.servedaccesors}
          increase=""
          description="All Clients"
          icon={
            <CorporateFareOutlined
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
          <ReportsTable />
        </Box>

      </Box>
    </Box>
  )
}

export default ValuerDashboard;
