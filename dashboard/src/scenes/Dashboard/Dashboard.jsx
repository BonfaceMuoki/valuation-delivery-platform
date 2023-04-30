import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FlexBetween from 'components/FlexBetween';
import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize,Input,Modal } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import StatBox from 'components/StatBox';
import { Email } from '@mui/icons-material';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useGetValuationReportsQuery } from './ValuationReportsSlice';
import { Button } from 'antd';
import ReportsTable from './ReportsTable';
import { Row, Col } from 'antd';
const style = {
  position: 'absolute',
  top: '5%',
  left: '10%',
  right:'10%',
  transform: 'translate(-10%, -10%,-10%)',
  width: "80%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 10,
position: "absolute" 
};



function Dashboard() {
  const theme = useTheme();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <Box m={isNonMediumScreens ? "1.5rem 1.5rem 0rem" : "1.5rem 1.5rem 0rem"}

    >
      <FlexBetween>
        <Header title="Dashbaord" subtitle="Welcome to your Dashaboard" />
        <Box>
          <Button icon={<UploadOutlined />} onClick={handleOpen}>Upload New Report</Button>
          <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll' }}
      >
        <Box sx={style}>
        <form>
              <Row gutter={16}>
                <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                  <Typography sx={{ ml: 1, mt: 3 }}>Property LR Number</Typography>
                  <TextField placeholder='Property LR Number' sx={{ pl: 1 }} fullWidth id="outlined-basic" />
                </Col>
              </Row>
              <Row gutter={16} >
                <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                  <Typography sx={{ ml: 1, mt: 3 }}>Market Value</Typography>
                  <TextField placeholder='Market Value' sx={{ pl: 1 }} fullWidth id="outlined-basic" />
                </Col>
                <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                  <Typography sx={{ ml: 1, mt: 3 }}>Forced Market Value</Typography>
                  <TextField placeholder='Forced Market Value' sx={{ pl: 1 }} fullWidth id="outlined-basic" />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                  <Typography sx={{ ml: 1, mt: 3 }}>Encuberence Details</Typography>
                  <TextField
                    multiline
                    rows={4} placeholder='Encuberence Details' sx={{ pl: 1 }} fullWidth id="outlined-basic" />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                  <Typography sx={{ ml: 1, mt: 3 }}>Report Description</Typography>
                  <TextField
                    multiline
                    rows={4} placeholder='Report Description' sx={{ pl: 1 }} fullWidth id="outlined-basic" />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                <label htmlFor="upload-photo">
  <input
    style={{ display: 'none' }}
    id="upload-photo"
    name="upload-photo"
    type="file"
  />

  <BTNMUI variant="outlined"  fullWidth sx={{mt:3,textAlign:"left"}} color="secondary"  component="span" >
    Click to select your Report in PDF format
  </BTNMUI>
</label>
                </Col>
              </Row>
              <Row gutter={16} >
                <Col className="gutter-row" span={isNonMediumScreens ? 12 : 12} justify="center">
                  
                </Col>
                <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                  <BTNMUI type="submit" variant="contained" sx={{mt:3}} fullWidth>Save</BTNMUI>
                </Col>
              </Row>
            </form>
        </Box>
      </Modal>

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

export default Dashboard;
