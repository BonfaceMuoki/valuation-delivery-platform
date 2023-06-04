import React from 'react'
import { Button } from '@mui/material'

function RolesActions({ params }) {
    const handleEditRole = (role)=>{
      console.log(role);
    }
    const handleDeleteRole = (role)=>{
        console.log(role);
    }
    return (
        <div>
            <a href="#" >
                <Button variant='contained' onClick={() => handleEditRole(params.id, 0)}>Edit</Button>
            </a> &nbsp;&nbsp;&nbsp;
            <a href="#">
                <Button variant='contained'  onClick={() => handleDeleteRole(params.id, 1)}>Delete</Button>
            </a>
        </div>
    )
}

export default RolesActions