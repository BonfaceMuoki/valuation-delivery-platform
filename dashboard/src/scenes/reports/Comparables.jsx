import React, { useEffect } from 'react';
import { Box,useTheme } from '@mui/material';
import { Typography } from 'antd';


function Comparables () {
  const theme = useTheme();  

  toastMessage("Comming Soon. We shall update you");
  const toastMessage = (message,type)=>{
    if(type=="success"){
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }else if(type=="error"){
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }else if(type=="warning"){
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT
    });
    }
  } 


    
    
    return (
        <Box
        gridColumn="span 12"
        gridRow="span 5"
        backgroundColor={theme.palette.background.alt}
        p="5rem"
        borderRadius="0.55rem"
        width="100%"
        height="650px"
        justifyContent={center}
      >
      <Typography>Please note that this module is coming soon. Continue uploading reports so that you can get your access credits once we come live.</Typography>
        </Box>
    )
}

export default Comparables