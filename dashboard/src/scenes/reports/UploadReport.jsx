import React, { useState, useEffect } from 'react';
import { Autocomplete, MenuItem } from '@mui/material';

import { Button as BTNMUI, Box, useTheme, useMediaQuery, TextField, Typography, TextareaAutosize, Input, Modal, Grid } from '@mui/material';
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
import { useSelector } from "react-redux"
import { selectCurrentPermissions } from 'scenes/auth/authSlice';
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
const stylemobile = {
    position: 'absolute',
    top: '5%',
    left: '0.5%',
    right: '0.5%',
    transform: 'translate(-25%, -25%,-25%)',
    width: "99%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 10,
    position: "absolute"
};

function UploadReport() {
    const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1200px)");
    const permissions = useSelector(selectCurrentPermissions);
    const { refetch } = useGetValuationReportsQuery();
    const [uploadReport, { isLoading: isUploading }] = useUploadValuationReportMutation();
    const dispatch = useDispatch();
    const [existingAccessors, setExistingAccessors] = useState();
    const {
        data: accesorslist,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetAccesorsListQuery();

    useEffect(() => {
        setExistingAccessors(accesorslist);
    }, [accesorslist]);

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
        const formData = new FormData();
        formData.append("report_description", data.report_description);
        formData.append("market_value", data.market_value);
        formData.append("forced_market_value", data.forced_market_value);
        formData.append("property_lr", data.property_lr);
        formData.append("valuation_date", data.valuation_date);
        formData.append("encumberrence_details", data.encuberence_details);
        formData.append("receiving_company_id", data.recipient[0].id);
        formData.append("report_pdf", data.file[0]);
        
        reportUsersFields.map((field,key)=>{
            formData.append("report_users_name[]", data.report_user_name[key]);
            formData.append("report_users_phone[]", data.report_user_phone[key]);
            formData.append("report_users_email[]", data.report_user_email[key]);
        })
        const response=uploadReport(formData);
        console.log(response);
        if(response.data.originalStatus==200){
            setTimeout(()=>{
                window.location.reload(false);
            }, 500);
        }

    };

    const [reportUsersFields, setReportUsersFields] = useState([{ formFildName: "name" }]);
    const addReportUser = () => {
        setReportUsersFields([...reportUsersFields, { formFildName: "name" }]);
    }
    const handleRemoveReprtUser = (index) => {
        const values = [...reportUsersFields];
        values.splice(index, 1);
        setReportUsersFields(values);
    };
    return (

        <Box>
            {
                (permissions.find(p => p.name === "upload report")) ? <Button icon={<UploadOutlined />} onClick={handleOpen}>Upload New Report</Button> : ""
            }
            {/* <Button icon={<UploadOutlined />} onClick={handleOpen}>Upload New Report</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{ overflow: 'scroll' }}
            >
                <Box sx={isNonMobile ? style : stylemobile}>
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} >
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
                                            options={existingAccessors}
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
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
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

                            </Grid>
                        </Grid>
                        {/* users to consume */}
                        <Box style={{
                            border: '1px solid lightgrey',
                            padding: '20px',
                            marginTop: '15px'
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={6} >
                                    <Typography sx={{ ml: 1, mt: 3 }}>Add Users within the organization to access the report</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} justifyContent="right" display="flex" alignItems="right" >
                                    <BTNMUI onClick={() => addReportUser()} variant='contained' sx={{ ml: 1, mt: 3, width: "60px", height: "60px", borderRadius: '100%', backgroundColor: "blue", color: "white" }} >+</BTNMUI>

                                </Grid>
                            </Grid>
                            {
                                reportUsersFields &&
                                reportUsersFields.map((field, index) => {
                                    return (
                                        <Box>
                                            <Grid container spacing={2}>

                                                <Grid item xs={12} sm={4} md={4} >

                                                    <Typography sx={{ ml: 1, mt: 3 }}>Name</Typography>

                                                    <div>
                                                        <TextField  
                                                        {...register(`report_user_name[${index}]`)} 
                                                        autoComplete="off" fullWidth  required
                                                        />
                                                        <span className='errorSpan' >{errors.market_value?.message}</span>
                                                    </div>

                                                </Grid>
                                                <Grid item xs={12} sm={4} md={4} >
                                                    <Typography sx={{ ml: 1, mt: 3 }}>Email</Typography>

                                                    <div>
                                                        <TextField type='email' {...register(`report_user_email[${index}]`)} autoComplete="off"  required fullWidth />
                                                        <span className='errorSpan' >{errors.market_value?.message}</span>
                                                    </div>

                                                </Grid>
                                                <Grid item xs={12} sm={3} md={3} >
                                                    <Typography sx={{ ml: 1, mt: 3 }}>Phone</Typography>

                                                    <div>
                                                        <TextField   {...register(`report_user_phone[${index}]`)} autoComplete="off" required fullWidth />
                                                        <span className='errorSpan' >{errors.market_value?.message}</span>
                                                    </div>

                                                </Grid>
                                                <Grid item xs={12} sm={1} md={1} display="flex" justifyContent="center" alignItems="center">

                                                    <BTNMUI onClick={() => handleRemoveReprtUser(index)} variant='contained' sx={{ ml: 1, mt: 5, width: "60px", height: "60px", borderRadius: '100%', backgroundColor: "red", color: "white" }} >X</BTNMUI>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    );
                                })
                            }


                        </Box>
                        {/* close users to consume */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} >
                                <Typography sx={{ ml: 1, mt: 3 }}>Market Value</Typography>
                                <Controller
                                    control={control}
                                    name="market_value"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} autoComplete="off" fullWidth />
                                            <span className='errorSpan' >{errors.market_value?.message}</span>
                                        </div>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <Typography sx={{ ml: 1, mt: 3 }}>Forced Market Value</Typography>
                                <Controller
                                    control={control}
                                    name="forced_market_value"
                                    defaultValue=""
                                    render={({ field }) => (
                                        <div>
                                            <TextField  {...field} autoComplete="off" fullWidth />
                                            <span className='errorSpan' >{errors.forced_market_value?.message}</span>
                                        </div>
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} >
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

                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} >
                                <Typography sx={{ ml: 1, mt: 3 }}>Property Description</Typography>
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

                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} >
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
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
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

                                    <BTNMUI variant="outlined" sx={{ mt: 0, textAlign: "left", height: 70, width: "100%" }} color="secondary" component="span" >
                                        <UploadOutlined sx={{ fontSize: "55px" }} />
                                    </BTNMUI><br />
                                    {(uploadedFile != "") ? <span sx={{ mt: 3, fontSize: "25px" }} className='successSpan'>{uploadedFile}</span> : ""}
                                </label>
                                <span className='errorSpan' ><br></br>{errors.file?.message}</span>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} >

                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <BTNMUI type="submit" variant="contained" sx={{ mt: 3, height: 50, backgroundColor: "blue", color: "white" }} fullWidth>Send</BTNMUI>

                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

        </Box>

    )
}

export default UploadReport