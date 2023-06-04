import React, { useState, useEffect } from 'react';
import { Autocomplete, MenuItem } from '@mui/material';

import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize, Input, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Row, Col } from 'antd';

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import "../../assets/scss/validation.css";
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useGetAccesorsListQuery } from 'features/accessorsListSlice';
import { useUploadValuationReportMutation } from 'features/valuationReportUploadSlice';
import { useDispatch } from 'react-redux';
import { setfetchvaluationreports } from 'scenes/auth/authSlice';
import { useGetValuationReportsQuery } from 'features/ValuationReportsSlice';
const style = {
    position: 'absolute',
    top: '5%',
    left: '25%',
    right: '25%',
    transform: 'translate(-25%, -25%,-25%)',
    width: "50%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 10,
    position: "absolute"
};

function UploadReport() {
    const {refetch} =  useGetValuationReportsQuery();
    const [uploadReport, { isLoading: isUploading }] = useUploadValuationReportMutation();
    const dispatch = useDispatch();
    const {
        data: accesorslist,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAccesorsListQuery();
    const schema = yup.object().shape({
        market_value: yup
            .number().typeError('Invalid Market Value: not a number')
            .positive("Market Value must be a positive number")
            .required("Market Value is required"),
        forced_market_value: yup
            .number().typeError('Invalid Forced Market Value: not a number')
            .positive("Forced Market Value must be a positive number")
            .required("Forced Market Value is required"),
        property_lr: yup.string().required("Property LR is required"),
        encuberence_details: yup.string().required("Encuberence Details is required"),
        report_description: yup.string().required("Report description are required"),
        valuation_date: yup.string().required("Valuation Date is required"),
        recipient: yup.array().of(yup.object().shape({
            value: yup.string(),
            label: yup.string()
        })
        ).min(1, "Recipient required").max(1, "Only one recipient is required."),
        file: yup
            .mixed()
            .required('Please upload a file')
            .nullable()
            .test('fileSize', 'File size is too large', (value) => {
                if (value[0]) {
                    return value[0].size <= 1024 * 1024 * 2;
                }
                return true;

            })
            .test('fileType', 'Only PDF files are allowed', (value) => {
                if (value[0]) {
                    return ['application/pdf', 'pdf'].includes(value[0].type);
                }
                return true;

            })

    });

    const { register, handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
    });

    const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    //upload image
    const [image, setImage] = useState();
    const [uploadedFile, setUploadedFile] = useState();
    const handleImage = (e) => {

        setImage(e.target.files[0]);
        if (e.target.files[0]) {
            setUploadedFile(e.target.files[0].name);
        }
    }
    //upload image
    const [options, setOptions] = useState([]);
    // useEffect(() => {
    //     // make API call or update state to fetch options with IDs
    //     setOptions(accesorslist?.accesors);
    // }, []);
    const onSubmit = (data) => {
    console.log(data);
    const formData= new FormData();
    formData.append("report_description",data.report_description);
    formData.append("market_value",data.market_value);
    formData.append("forced_market_value",data.forced_market_value);
    formData.append("property_lr",data.property_lr);
    formData.append("valuation_date",data.valuation_date);
    formData.append("encumberrence_details",data.encuberence_details);
    formData.append("receiving_company_id",data.recipient[0].id);
    formData.append("report_pdf",data.file[0]);
    const response=uploadReport(formData);
    console.log(response);
    if(response.data.originalStatus==200){
        setTimeout(()=>{
            window.location.reload(false);
        }, 500);
    }

 };

    return (
        
        <Box>
            { accesorslist?.accesors &&<>
            <Button icon={<UploadOutlined />} onClick={handleOpen}>Upload New Report</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflow: 'scroll' }}
            >
                <Box sx={style}>
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <Row gutter={16}>
                            <Col span={isNonMediumScreens ? 12 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Recipient</Typography>
                                <Controller
                                    name="recipient"
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                                        <Autocomplete
                                            {...field}
                                            disableClearable
                                            disablePortal
                                            filterSelectedOptions
                                            options={accesorslist?.accesors}
                                            multiple
                                            getOptionDisabled={(option) => option.disabled}
                                            getOptionLabel={(option) => option.organization_name}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            id="days-autocomplete"
                                            onChange={(event, value) => field.onChange(value)}
                                            
                                            renderInput={(params) => (
                                                <TextField
                                                    id="receipient"
                                                    name="recipient"
                                                    type="search"
                                                    inputRef={ref}
                                                    {...params}
                                                />

                                            )}
                                        />

                                    )}

                                />
                                <span className='errorSpan' >{errors.recipient?.message}</span>
                            </Col>
                            <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Property LR</Typography>
                                <Controller
                                    control={control}
                                    name="property_lr"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} autoComplete="off" fullWidth />
                                            <span className='errorSpan' >{errors.property_lr?.message}</span>
                                        </div>
                                    )}
                                />

                            </Col>
                        </Row>
                        <Row gutter={16} >
                            <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Market Value</Typography>
                                <Controller
                                    control={control}
                                    name="market_value"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} autoComplete="off"  fullWidth />
                                            <span className='errorSpan' >{errors.market_value?.message}</span>
                                        </div>
                                    )}
                                />
                            </Col>
                            <Col className="gutter-row" span={isNonMediumScreens ? 12 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Forced Market Value</Typography>
                                <Controller
                                    control={control}
                                    name="forced_market_value"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} autoComplete="off"  fullWidth />
                                            <span className='errorSpan' >{errors.forced_market_value?.message}</span>
                                        </div>
                                    )}
                                />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Encuberence Details</Typography>
                                <Controller
                                    control={control}
                                    name="encuberence_details"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field}
                                                multiline
                                                rows={4}
                                                fullWidth />
                                            <span className='errorSpan' >{errors.encuberence_details?.message}</span>
                                        </div>
                                    )}
                                />

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={isNonMediumScreens ? 24 : 24} justify="center">
                                <Typography sx={{ ml: 1, mt: 3 }}>Report Description</Typography>
                                <Controller
                                    control={control}
                                    name="report_description"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} fullWidth
                                                multiline
                                                rows={4}
                                            />
                                            <span className='errorSpan' >{errors.report_description?.message}</span>
                                        </div>
                                    )}
                                />

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={isNonMediumScreens ? 12 : 24} >
                                <Typography sx={{ ml: 1, mt: 3 }}>Valuation Date</Typography>

                                <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>

                                    <Controller
                                        control={control}
                                        name="valuation_date"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <DatePicker
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>


                                <span className='errorSpan' ><br></br>{errors.valuation_date?.message}</span>
                            </Col>
                            <Col span={isNonMediumScreens ? 12 : 24} justify="center">
                                <label htmlFor="upload-photo">
                                    <input
                                        style={{ display: 'none' }}
                                        id="upload-photo"
                                        type="file"
                                        {...register("file", {
                                            onChange: handleImage
                                        })}

                                    />
                                    <Typography sx={{ ml: 1, mt: 3 }}>Report Document(Only PDF)</Typography>

                                    <BTNMUI variant="outlined" sx={{ mt: 0, textAlign: "left", height: 70, width: 200 }} color="secondary" component="span" >
                                        <UploadOutlined sx={{ fontSize: "55px" }} />
                                    </BTNMUI><br />
                                    {(uploadedFile != "") ? <span sx={{ mt: 3, fontSize: "25px" }} className='successSpan'>{uploadedFile}</span> : ""}
                                </label>
                                <span className='errorSpan' ><br></br>{errors.file?.message}</span>
                            </Col>
                        </Row>
                        <Row gutter={16} >
                            <Col className="gutter-row" span={isNonMediumScreens ? 12 : 12} justify="center">

                            </Col>
                            <Col className="gutter-row" span={isNonMediumScreens ? 24 : 24} justify="center">
                                <BTNMUI type="submit" variant="contained" sx={{ mt: 3, height: 50, backgroundColor: "blue", color: "white" }} fullWidth>Send</BTNMUI>

                            </Col>
                        </Row>
                    </form>
                </Box>
            </Modal>
            </>   }
        </Box>

    )
}

export default UploadReport