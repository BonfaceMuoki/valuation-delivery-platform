import React from 'react'
// import { Button } from 'antd';
import { DownloadDoneOutlined } from '@mui/icons-material';
import { useTheme,Button } from '@mui/material';
import { useGetDownloadValuationReportsQuery } from 'features/downloadReportSlice';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from 'scenes/auth/authSlice';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

function Valuationreportactions({ params }) {
    
    const apiKey = process.env.REACT_APP_API_BASE_URL;
    const theme = useTheme();
    const base_url = process.env.REACT_APP_API_BASE_URL;
    const access_token = useSelector(selectCurrentToken);
    const full_url = `${base_url}/api/commons/downloadvaluationreport/${params.id}/1?access_token=${access_token}`;
    const full_url0 = `${base_url}/api/commons/downloadvaluationreport/${params.id}/0?access_token=${access_token}`;
    const handledownload = (report, type) => {
        fetch(`${base_url}/api/commons/downloadvaluationreport/${report}/1`, {
            headers: {
                'Authorization': `Bearer kk${access_token}`,
            }
        }).then(response => {
            if (response.status === 404) {
                toast.warning('File not found !', {
                    position: toast.POSITION.TOP_RIGHT
                });
                return;
            } else if (response.status === 401 && response.status == 403) {
                toast.warning('Forbidden acces !', {
                    position: toast.POSITION.TOP_RIGHT
                });
                return;
            }
            return response.blob();
        })
            .then(blob => {
                console.log(blob);
                // Do something with the blob
                (blob != null) && saveAs(blob, 'valuation.pdf');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }


    return (
        <div>
            {/* <a href="#" >
                <Button variant='contained' onClick={() => handledownload(params.id, 0)}>Unsigned</Button>
            </a> &nbsp;&nbsp;&nbsp; */}
            <a href="#">
                <Button variant='contained' sx={{backgroundColor:theme.palette.background.alt}} onClick={() => handledownload(params.id, 1)}>Download Signed Report</Button>
            </a>
        </div>
    )
}

export default Valuationreportactions