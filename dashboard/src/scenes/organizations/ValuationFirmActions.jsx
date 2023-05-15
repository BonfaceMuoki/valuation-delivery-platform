import React, { useState } from 'react'
import { Divider, Modal, TextField } from '@mui/material';
import { Button, Box } from '@mui/material'
import { Typography } from 'antd';
import {Grid} from '@mui/material';
function ValuationFirmActions({ row }) {

  const [openEditValauationFirmModal, setOpenEditValauationFirmModal] = useState(false);
  const handleOpenValauationFirmModal = () => setOpenEditValauationFirmModal(true);
  const handleCloseValauationFirmModal = () => setOpenEditValauationFirmModal(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      <Button variant='contained' onClick={handleOpenValauationFirmModal}>Edit</Button>
      {/* close modal edit valuation firm */}
      <Modal
        open={openEditValauationFirmModal}
        onClose={handleCloseValauationFirmModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography>Edit {row.row.name}</Typography>
          <Divider></Divider>
          <Grid container spacing={2}  sx={{mt:1}} >
            <Grid item xs={12} sm={6} md={4}>
              <Typography>Valuation Firm Name</Typography>
              <TextField fullWidth />
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* close modal edit valuation firm  */}
    </div>
  )
}

export default ValuationFirmActions