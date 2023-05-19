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
    <>
    </>
  )
}

export default ValuationFirmActions