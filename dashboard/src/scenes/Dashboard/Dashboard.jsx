import React from 'react';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import StatBox from 'components/StatBox';
import { DownloadOutlined, Email } from '@mui/icons-material';
import { useGetValuationReportsQuery } from './ValuationReportsSlice';


function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const {
    data: reports,
    isLoading,
    isSuccess,
    isError,
    error
} = useGetValuationReportsQuery(2);
  console.log(reports?.reports.data);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Dashbaord" subtitle="Welcome to your Dashaboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Upload Report
          </Button>
        </Box>

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
          title="Total Customers"
          value="10"
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Customers"
          value="10"
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Total Customers"
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
        gridRow="span 4"
        backgroundColor={theme.palette.background.alt}
        p="1rem"
        borderRadius="0.55rem"
        >
        </Box>


      </Box>
    </Box>
  )
}

export default Dashboard;
