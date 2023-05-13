import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize,Input,Modal } from '@mui/material';
import Header from 'components/Header';
import StatBox from 'components/StatBox';
import { Email } from '@mui/icons-material';
import ReportsTable from '../reports/ReportsTable';
import UploadReport from 'scenes/reports/UploadReport';




function AccesorDashboard() {
  
  const theme = useTheme();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");



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
          value="10"
          increase="+14%"
          description="Since First Day"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Reports"
          value="10"
          increase="+14%"
          description="This Month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Accesors served"
          value="10"
          increase="+14%"
          description="Since last month"
          icon={
            <Email
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

export default AccesorDashboard;
