import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Stepper, Step, StepLabel, Button, Paper, TextField, Grid, Typography, Button as BTNMUI, useTheme, Box, Select, MenuItem, Autocomplete, Divider } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "../../assets/scss/validation.css";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import { UploadFileOutlined } from '@mui/icons-material';
import { valauationFormSlice, setValuationDetails, setValuationLocationDetails, setValuationPropertyDetails, setReportRecipient, selectCurrentSignatories, setReportSignatories, selectCurrentRecipient } from 'scenes/auth/authSlice';
import { selectValuationDetails, selectLocationDetails, selectPropertyDetails } from 'scenes/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

import Table from '@mui/material/Table';

import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useGetUsersQuery } from 'features/usersSlice';
import { useGetAccesorsListQuery } from 'features/accessorsListSlice';
import { useUploadValuationReportV2Mutation } from 'features/valuationReportUploadV2Slice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { useGetPropertyTypeListQuery } from 'features/propertyTypeListSlice';


const styles = {
  root: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    width: "95%",
    marginLeft: "2.5%",
    marginRight: "2.5%",
    marginTop: "3.5%"

  },
  stepper: {
    backgroundColor: '#e0e0e0',
    padding: '16px',
    color: 'green'
  },
  content: {
    flex: 1,
  },
  buttonContainerLeft: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-left',
    marginTop: '16px',
  },
  button: {
    marginLeft: '8px',
    color: 'white',
    backgroundColor: '#0096FF',
    borderRadius: "20px",
    width: "50%"
  },
};
const steps = ['Location', 'Property Details', 'Valuation', 'Signature', 'Confirm'];

const ReportSubmit = () => {


  const toastMessage = (message, type) => {
    if (type == "success") {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (type == "error") {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else if (type == "warning") {
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  //map auto complete

  const inputRef = useRef()
  const inputStyle = {
    boxShadow: 'inset 0 0 10px #eee !important',
    border: '2px solid #eee',
    width: '456px',
    height: '40px',
    marginLeft: '16px',
    borderRadius: '20px',
    fontWeight: '300 !important',
    outline: 'none',
    padding: '10px 20px',
    marginBottom: '10px',
  }


  const autoComplete = new window.google.maps.places.Autocomplete(
    inputRef.current,
  )

  const [existingAccessors, setExistingAccessors] = useState();
  const { data: propertytypesapi, isLOading } = useGetPropertyTypeListQuery();

 
  const [propertyTypes, setPropertyTypes] = useState([]);
  useEffect(() => {
    setPropertyTypes(propertytypesapi);
  }, [propertytypesapi]);

  autoComplete.addListener('place_changed', () => {
    const place = autoComplete.getPlace()
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      alert("this location not available")
    }
    if (place.geometry.viewport || place.geometry.location) {
      // do something
    
    }
  })
  //map autocomplete

  const [signatories, setSignatories] = useState([]);
  //upload image
  const [image, setImage] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedFileD, setUploadedFileD] = useState();
  const dispatch = useDispatch();
  const handleImage = (e) => {

    setImage(e.target.files[0]);
    if (e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
      setUploadedFileD(e.target.files[0]);
    }
  }
  const locationDetails = useSelector(selectLocationDetails);
  const propertdetails = useSelector(selectPropertyDetails);
  const valauationdetails = useSelector(selectValuationDetails);
  const reportignatories = useSelector(selectCurrentSignatories);
  const recipientdetails = useSelector(selectCurrentRecipient);

  //upload image
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(true);
  const locationformRef = useRef(null);
  const onSubmitLocation = async (data) => {
    dispatch(setValuationLocationDetails(data));
    handleNext();
  }
  const onSubmitPropertyDetails = async (data) => {
   
    dispatch(setValuationPropertyDetails(data));
    handleNext();
  }
  const onSubmitPropertyValuation = async (data) => {

    delete data.file;
    dispatch(setValuationDetails(data));
    dispatch(setReportRecipient(data.recipient));
    if(existingAccessors.length > 0){
      handleNext();
    } else{
      toastMessage("Please contact the admin to add the recipient you want to submit report to","error");
    }

  }
  const onSubmitSignee = async (data) => {

    dispatch(setReportSignatories(data));
    setSignatories(data.signees);
    handleNext();
  }
  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepCompleted = (step) => {
    return step < activeStep;
  };

  //submit report toserver\\
  const [uploadReport, { isLoading: isUploading }] = useUploadValuationReportV2Mutation();
  const [recipientUsernames, setRecipientUsernames] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [recipientPhone, setRecipientPhone] = useState([]);

  const submitReportForSinature = async () => {
    const formData = new FormData();
    //location details
    formData.append("location_name", locationDetails?.locationName);
    formData.append("county", locationDetails?.county);
    formData.append("town", locationDetails?.town);
    formData.append("neighbourhood", locationDetails?.neighbourHood);
    formData.append("street", locationDetails?.street);
    //location details
    //property details
    formData.append("property_lr", propertdetails?.PropertyLR);
    formData.append("Property_type", propertdetails?.PropertyType[0].name);
    formData.append("total_built_up_area", propertdetails?.totalBuiltUpArea);
    formData.append("land_size", propertdetails?.landSize);
    formData.append("tenure", propertdetails?.tenure);
    //property details
    // valuation summary        
    formData.append("report_description", valauationdetails?.report_description);
    formData.append("market_value", valauationdetails?.marketValue);
    formData.append("annual_gross_rental_income", valauationdetails?.annualGRossRentalIncome);
    formData.append("forced_market_value", valauationdetails?.forcedSaleValue);
    formData.append("insurence_value", valauationdetails?.insurenceValue);
    formData.append("valuation_date", valauationdetails?.valuationDate);
    formData.append("instruction_date", valauationdetails?.InstructionDate);
    formData.append("receiving_company_id", recipientdetails[0].id);
    formData.append("report_pdf", uploadedFileD);
    // valuation summary

    //recipients
    recipientUsernames.map((field, key) => {
      formData.append("report_users_name[]", valauationdetails.report_user_name[key]);
      formData.append("report_users_phone[]", valauationdetails.report_user_phone[key]);
      formData.append("report_users_email[]", valauationdetails.report_user_email[key]);
    })
    //recipients

    // signatories

    signatories.map((signatory, key) => {
      formData.append("signatory[]", signatory.id);
      formData.append("signatory_name[]", signatory.full_name);
      // formData.append("signatory_phone[]", valauationdetails.report_user_phone[key]);
      formData.append("signatory_email[]", signatory.email);
    })
    //signatories
    const result = await uploadReport(formData);
    if ('error' in result) {
      toastMessage(result.error.data.message, "error");
      if ('backendvalerrors' in result.error.data) {
        // setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      toastMessage(result.data.message, "success");

    }


  }

  const submitReportToClient = async () => {

  }
  //submit report to server



  // Separate component for rendering the Google Map
  const MapContainer = React.memo(({ isLoaded }) => {
    const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);
    const customMarker = {
      path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
      fillColor: "red",
      fillOpacity: 2,
      strokeWeight: 1,
      rotation: 0,
      scale: 1,
    };

    return (
      <div className="App">
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={10}
          >
            <Marker
              position={{ lat: 18.52043, lng: 73.856743 }}
              icon={customMarker}
            />
          </GoogleMap>
        )}
      </div>
    );
  });

  const LocationForm = () => {

    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    });
    const locationValidationSchema = Yup.object().shape({
      locationName: Yup.string().required('Location Name is required'),
      town: Yup.string().required('Town is required'),
      street: Yup.string().required('Street is required'),
      county: Yup.string().required('County is required'),
      neighbourHood: Yup.string().required('Neighbourhood is required'),
    });
    const { register: registerlocation, setValue: setLocationValues, handleSubmit: handleLocationSubmit, formState: { errors: locationerrors, isValid: locationIsValid } } = useForm({
      resolver: yupResolver(locationValidationSchema),
    });
    useEffect(() => {
      if (locationDetails != null) {
        setLocationValues("locationName", locationDetails?.locationName);
        setLocationValues("county", locationDetails?.county);
        setLocationValues("neighbourHood", locationDetails?.neighbourHood);
        setLocationValues("street", locationDetails?.street);
        setLocationValues("town", locationDetails?.town);
        
      }
    }, [locationDetails])
    return (

      <Box component={Paper} sx={{ p: 5 }}>
        <form onSubmit={handleLocationSubmit(onSubmitLocation)}>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1 }}>Location Name</Typography>
                <TextField
                  {...registerlocation('locationName', { required: true }, { shouldRender: !locationerrors.locationName })}
                  placeholder="Location Name"
                  fullWidth
                />
                <span className='errorSpan' >{locationerrors.locationName?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1 }}>County</Typography>
                <TextField {...registerlocation('county', { required: true }, { shouldRender: !locationerrors.county })} placeholder="County" fullWidth /><br />
                <span className='errorSpan' >{locationerrors.county?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1 }}>Town</Typography>
                <TextField {...registerlocation('town', { required: true }, { shouldRender: !locationerrors.town })} placeholder="town" fullWidth /><br />
                <span className='errorSpan' >{locationerrors.town?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} >

            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1 }}>Street</Typography>
                <TextField {...registerlocation('street', { required: true }, { shouldRender: !locationerrors.neighbourHood })} placeholder="Street" fullWidth /><br />
                <span className='errorSpan' >{locationerrors.street?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1 }}>Neighbourhood</Typography>
                <TextField
                  {...registerlocation('neighbourHood', { required: true }, { shouldRender: !locationerrors.neighbourHood })}
                  placeholder="Neighbourhood"
                  fullWidth
                /><br />
                <span className='errorSpan' >{locationerrors.neighbourHood?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={12} md={12} justifyContent="center" alignItems="center">
              <Typography sx={{ mb: 1, mt: 1 }}>Loction Map</Typography>
              <MapContainer isLoaded={isLoaded} />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="left" alignItems="left">
              <div style={styles.buttonContainerLeft} justifyContent="left" alignItems="left" >
                <BTNMUI align='left' variant='contained' disabled={activeStep === 0} onClick={handleBack} style={styles.button} >
                  Back
                </BTNMUI>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div style={styles.buttonContainer} justify="center" alignItems="center">
                <BTNMUI
                  style={styles.button}
                  width="50%"
                  variant="contained"
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </BTNMUI>
              </div>
            </Grid>
          </Grid>
        </form>

      </Box>
    );
  };
  const PropertyDetailsForm = () => {
   
    const propertyDetailsSchema = Yup.object().shape({
      PropertyLR: Yup.string().required('The proprty Lr is required'),
      PropertyType: Yup.array().of(Yup.object().shape({
        value: Yup.string(),
        label: Yup.string()
      })
      ).min(1, "Property tYPE required").max(1, "Only one Property Type is required."),
      totalBuiltUpArea: Yup.number().required('Total Builtup area is required'),
      tenure: Yup.string().required('Tenure is required'),
      landSize: Yup.number().required('Land size is required')
    });
    const { register: registerproperty, control, setValue: setPropertyDetailsValues, handleSubmit: handlePropertyDetailsSubmit, formState: { errors: properrtyErrors, isValid: propertyDetailsIsValid } } = useForm({
      resolver: yupResolver(propertyDetailsSchema),
    });
    useEffect(() => {
      if (propertdetails != null) {

        setPropertyDetailsValues("PropertyLR", propertdetails?.PropertyLR);
        setPropertyDetailsValues("propertyType", propertdetails?.propertyType);
        setPropertyDetailsValues("totalBuiltUpArea", propertdetails?.totalBuiltUpArea);
        setPropertyDetailsValues("tenure", propertdetails?.tenure);
        setPropertyDetailsValues("landSize", propertdetails?.landSize);
      }
    }, [propertdetails]);
    return (
      <Box component={Paper} sx={{ p: 5 }}>
        <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)} >
          <Grid container>
            <Grid item xs={12} sm={12} md={12} >
              <Typography sx={{ ml: 1, mt: 3 }}>Property LR</Typography>
              <TextField {...registerproperty('PropertyLR')} placeholder="Property Lr Number / Title" fullWidth /><br />
              <span className='errorSpan' >{properrtyErrors.PropertyLR?.message}</span>

            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Property Type</Typography>
                {propertytypesapi && propertytypesapi.length > 0 && (
                  <Controller
                    name="propertyType"
                    control={control}
                    defaultValue={[]}
                    sx={{
                      border: '1px solid #ced4da', // Add border styles here
                      borderRadius: '4px', // Add border radius here
                    }}
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        disableClearable
                        disablePortal
                        filterSelectedOptions
                        options={propertytypesapi}
                        getOptionDisabled={(option) => option.disabled}
                        getOptionLabel={(option) => option.type_name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        id="propertyType"
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            id="propertyType"
                            name="propertyType"
                            type="search"
                            inputRef={ref}
                            {...params}
                          />

                        )}
                      />

                    )}

                  />
                )}


                <span className='errorSpan' >{properrtyErrors.propertyType?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Total Built Up Area</Typography>
                <TextField {...registerproperty('totalBuiltUpArea')} placeholder="Total Built Up Area" fullWidth /><br />
                <span className='errorSpan' >{properrtyErrors.totalBuiltUpArea?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Land Size</Typography>
                <TextField
                  {...registerproperty('landSize')}
                  placeholder="Land Size"
                  fullWidth
                /><br />
                <span className='errorSpan' >{properrtyErrors.landSize?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Tenure</Typography>
                <TextField {...registerproperty('tenure')} placeholder="Tenure" fullWidth /><br />
                <span className='errorSpan' >{properrtyErrors.tenure?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="left" alignItems="left">
              <div style={styles.buttonContainerLeft} justifyContent="left" alignItems="left" >
                <BTNMUI align='left' variant='contained' disabled={activeStep === 0} onClick={handleBack} style={styles.button} >
                  Back
                </BTNMUI>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div style={styles.buttonContainer} justify="center" alignItems="center">
                <BTNMUI
                  style={styles.button}
                  width="50%"
                  variant="contained"
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </BTNMUI>
              </div>
            </Grid>
          </Grid>
        </form>

      </Box>
    );
  };

  const PropertyValuationForm = () => {
    const propertyValuationValidationSchema = Yup.object().shape({
      marketValue: Yup.string().required('Market Value is required'),
      forcedSaleValue: Yup.number().required('Forced Sale value is required').typeError("FSV must be a valid number"),
      insurenceValue: Yup.number().required("Insurence Value is required").typeError("Insurence value must be a valid number"),
      valuationDate: Yup.string().required("Valuation date is required"),
      annualGRossRentalIncome: Yup.string(),
      PropertyDescription:Yup.string(),
      InstructionDate: Yup.string().required("Instruction Date is required"),
      recipient: Yup.array().of(Yup.object().shape({
        value: Yup.string(),
        label: Yup.string()
      })
      ).min(1, "Recipient required").max(1, "Only one recipient is required."),
      file: Yup
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
    const { register: registerpropertyValuation, control, setValue: setPropertValuationValues, handleSubmit: handlePropertyValuationsSubmit, formState: { errors: propertyValuationErrors, isValid: propertyValuationIsValid } } = useForm({
      resolver: yupResolver(propertyValuationValidationSchema),
    });

    const [reportUsersFields, setReportUsersFields] = useState([]);
    const addReportUser = (nameVal="",phoneVal="",emailVal="") => {
      setReportUsersFields([...reportUsersFields,{
        formFieldName: "report_user_name",
        fieldEmail: "report_user_email",
        fieldPhoneNumber: "report_user_phone",
        formFildNameValue:nameVal,
        fieldEmailValue: emailVal,
        fieldPhoneNumberValue: phoneVal,
        formFieldNamePlace: "Recipient Name",
        fieldEmailPlace: "Recipient Email",
        fieldPhoneNumberPlace: "Recipient Phone"
      }]);
    }

    useEffect(() => {
      if (valauationdetails != null) {
        setPropertValuationValues("marketValue", valauationdetails?.marketValue);
        setPropertValuationValues("forcedSaleValue", valauationdetails?.forcedSaleValue);
        setPropertValuationValues("insurenceValue", valauationdetails?.insurenceValue);
        setPropertValuationValues("annualGrossRentalIncome", valauationdetails?.annualGrossRentalIncome);
        setPropertValuationValues("propertyDescription", valauationdetails?.propertyDescription);        
        setPropertValuationValues("valuationDate", valauationdetails?.valuationDate);
        setPropertValuationValues("InstructionDate", valauationdetails?.InstructionDate);
        if (recipientdetails != null) {
          setPropertValuationValues("recipient", recipientdetails);
        }
        if (uploadedFileD != null) {
          setPropertValuationValues("file", [uploadedFileD]);
        }
      
     
       setRecipientUsernames(valauationdetails?.report_user_name);
       setRecipientEmails(valauationdetails?.report_user_email);
       setRecipientPhone(valauationdetails?.report_user_phone);
      



      }else{
        setReportUsersFields([...reportUsersFields,{
          formFieldName: "report_user_name",
          fieldEmail: "report_user_email",
          fieldPhoneNumber: "report_user_phone",
          formFildNameValue: "",
          fieldEmailValue: "",
          fieldPhoneNumberValue: "",
          formFieldNamePlace: "Recipient Name",
          fieldEmailPlace: "Recipient Email",
          fieldPhoneNumberPlace: "Recipient Phone"
        }]);
        
      }
    }, [valauationdetails, recipientdetails]);
  
    const {
      data: accesorslist,
      isLoading: loadingAccesors,
      isSuccess: accesorsLoaded,
      isError: errorLodingAccesors,
      error: loadingAccesorError
    } = useGetAccesorsListQuery();
    useEffect(() => {
      setExistingAccessors(accesorslist);
    }, [accesorslist]);


    const handleRemoveReprtUser = (index) => {
      const values = [...reportUsersFields];
      values.splice(index, 1);
      setReportUsersFields(values);
    };
    const handleRemoveAddedOrgRecipient = (index) =>{
      const values = [...recipientUsernames];
      values.splice(index, 1);
      setRecipientUsernames(values);
    }

    return (
      <Box component={Paper} sx={{ p: 5 }}>
        <form onSubmit={handlePropertyValuationsSubmit(onSubmitPropertyValuation)} >
          {JSON.stringify(recipientUsernames)}
           {JSON.stringify(recipientEmails)}
            {JSON.stringify(recipientPhone)}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} >
              <Typography sx={{ ml: 1, mt: 2, mb: 1 }}>Recipient</Typography>
              {existingAccessors && existingAccessors.length > 0 ? (
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
                      getOptionLabel={(option) => option.organization_name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id || ''}
                      id="recipient"
                      onChange={(event, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          id="recipient"
                          name="recipient"
                          type="search"
                          inputRef={ref}
                          {...params}
                        />

                      )}
                    />
                  )}

                />
              ):<Typography className="errorSpan">There are no recipients in the system.Please contact Admin because you will need them to continue to the next step.</Typography> }
              <span className='errorSpan' >{propertyValuationErrors.recipient?.message}</span>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12} sx={{ mt: 1 }} >
              <label htmlFor="upload-file">
                <input
                  style={{ display: 'none' }}
                  id="upload-file"
                  type="file"
                  {...registerpropertyValuation("file", {
                    onChange: handleImage
                  })}
                />
                <Typography sx={{ ml: 1, mt: 1 }}>Report Document(Only PDF)</Typography>
                <BTNMUI variant="outlined" sx={{ mt: 0, textAlign: "left", height: 50, width: "100%" }} color="secondary" component="span" >
                  <UploadFileOutlined sx={{ fontSize: "25px" }} />
                </BTNMUI><br />
                {(uploadedFile != "") ? <span sx={{ mt: 0, fontSize: "25px" }} className='successSpan'>{uploadedFile}</span> : ""}
              </label>
              <span className='errorSpan' ><br></br>{propertyValuationErrors.file?.message}</span>
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
                <Typography sx={{ ml: 1, mt: 0 }}>Add Recipients within the client organization</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={6} justifyContent="right" display="flex" alignItems="right" >
                <BTNMUI onClick={() => addReportUser()} variant='contained' sx={{ ml: 1, mt: 0, width: "60px", height: "60px", borderRadius: '100%', backgroundColor: "blue", color: "white" }} >+</BTNMUI>

              </Grid>
            </Grid>

            {/* {Object.keys(reportUsersFields).length} */}
        
            {
              reportUsersFields.length>0 &&
              reportUsersFields.map((field, index) => {    
                if(field.formFieldName!=undefined){
                  return (
                  
                    <Box>
                      <Grid container spacing={2}>
                    
                        <Grid item xs={12} sm={4} md={4} >
  
                     
  
                          <Typography sx={{ ml: 1, mt: 1 }}>Name</Typography>

                   
                          <div>
                            <TextField
                              {...registerpropertyValuation(`${field.formFieldName}[${index}]`)}
                              autoComplete="off" fullWidth required placeholder={`${field.formFieldNamePlace}`} defaultValue={`${field.formFildNameValue}`} />
                          </div>
  
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} >
                          <Typography sx={{ ml: 1, mt: 1 }}>Email</Typography>
  
                          <div>
                            <TextField type='email' {...registerpropertyValuation(`${field.fieldEmail}[${index}]`)}
                             autoComplete="off"
                              required
                               fullWidth
                               placeholder={`${field.fieldEmailPlace}`} defaultValue={`${field.fieldEmailValue}`} />
                            {/* <span className='errorSpan' >{errors.market_value?.message}</span> */}
                          </div>
  
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} >
                          <Typography sx={{ ml: 1, mt: 1 }}>Phone</Typography>
  
                          <div>
                            <TextField   {...registerpropertyValuation(`${field.fieldPhoneNumber}[${index}]`)}
                             autoComplete="off" 
                             required
                              fullWidth
                              placeholder={`${field.fieldPhoneNumberPlace}`}  defaultValue={`${field.fieldPhoneNumberValue}`} />
                            {/* <span className='errorSpan' >{errors.market_value?.message}</span> */}
                          </div>
  
                        </Grid>
                        <Grid item xs={12} sm={1} md={1} display="flex" justifyContent="center" alignItems="center">
                          <BTNMUI onClick={() => handleRemoveReprtUser(index)} variant='contained' sx={{ ml: 1, mt: 1, width: "60px", height: "60px", borderRadius: '100%', backgroundColor: "red", color: "white" }} >X</BTNMUI>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }            

              })
            }
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Phone</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    Object.keys(recipientUsernames).length >0  &&
                    recipientUsernames.map((orgrecipient,key) => {
                      return (
                        <>
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {orgrecipient}
                            </TableCell>
                            <TableCell >{recipientEmails[key]}</TableCell>
                            <TableCell >{recipientPhone[key]}</TableCell>
                            <TableCell ><BTNMUI onClick={() => handleRemoveAddedOrgRecipient(key)} variant='contained' sx={{ ml: 1, mt: 1, width: "10px", height: "10px", borderRadius: '10%', backgroundColor: "red", color: "white" }} >X</BTNMUI>
                       </TableCell>
                          </TableRow>
                        </>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>


          </Box>
          {/* close users to consume */}
          <Grid container spacing={2} sx={{ mt: 2 }} >
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Market Value</Typography>
                <TextField
                  {...registerpropertyValuation('marketValue')}
                  placeholder="Market Value"
                  fullWidth
                />
                <span className='errorSpan' >{propertyValuationErrors.marketValue?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Forced Sale Value</Typography>
                <TextField {...registerpropertyValuation('forcedSaleValue')} placeholder="Forced Sale Value" fullWidth /><br />
                <span className='errorSpan' >{propertyValuationErrors.forcedSaleValue?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Total Built Up Area</Typography>
                <TextField {...registerpropertyValuation('insurenceValue')} placeholder="Total Built Up Area" fullWidth /><br />
                <span className='errorSpan' >{propertyValuationErrors.insurenceValue?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }} >
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Annual Grooss Income</Typography>
                <TextField
                  {...registerpropertyValuation('annualGrossRentalIncome')}
                  placeholder="Annual Gross Renetal Income"
                  fullWidth
                /><br />
                <span className='errorSpan' >{propertyValuationErrors.annualGRossRentalIncome?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Valuation Date</Typography>
                <TextField {...registerpropertyValuation('valuationDate')} placeholder="Date Of Valuation" fullWidth /><br />
                <span className='errorSpan' >{propertyValuationErrors.valuationDate?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Instruction Date</Typography>
                <TextField {...registerpropertyValuation('InstructionDate')} placeholder="Instruction Date" fullWidth /><br />
                <span className='errorSpan' >{propertyValuationErrors.InstructionDate?.message}</span>
              </div>
            </Grid>

          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} >
              <Typography sx={{ ml: 1, mt: 3 }}>Property Description</Typography>
           
                    <TextField  fullWidth
                      multiline
                      rows={4}
                      {...registerpropertyValuation('PropertyDescription')}
                    />
                    <span className='errorSpan' >{propertyValuationErrors.PropertyDescription?.message}</span>
             

            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="left" alignItems="left">
              <div style={styles.buttonContainerLeft} justifyContent="left" alignItems="left" >
                <BTNMUI align='left' variant='contained' disabled={activeStep === 0} onClick={handleBack} style={styles.button} >
                  Back
                </BTNMUI>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div style={styles.buttonContainer} justify="center" alignItems="center">
                <BTNMUI
                  style={styles.button}
                  width="50%"
                  variant="contained"
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </BTNMUI>
              </div>
            </Grid>
          </Grid>

        </form>
      </Box>
    );
  };
  const ValuationSignatures = () => {
    const {
      data: loadedusers,
      isFetching,
      isLoading,
      refetch: refetchUsers,
      isSuccess,
      isError,
      error
    } = useGetUsersQuery();
   
    const [existingUsers, setExistingUsers] = useState();
    useEffect(() => {
      setExistingUsers(loadedusers);
    }, [loadedusers]);

    const signeesvalidationschema = Yup.object().shape({
    });
    const { register: registerSignees, control, setValue: setSigneesValues, handleSubmit: handleSigneeSubmit,
      formState: { errors: signeeErrors, isValid: signeesAreValid } } = useForm({
        resolver: yupResolver(signeesvalidationschema),
      });
    useEffect(() => {
      if (signeesAreValid != null) {
      }
    }, [signeesAreValid]);

    useEffect(() => {
      if(reportignatories!=null){
        setSigneesValues("signees", reportignatories);
      }
     
    }, [reportignatories]);


    return (
      <Box component={Paper} sx={{ p: 5 }}>
        <form onSubmit={handleSigneeSubmit(onSubmitSignee)} >
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={12} md={12} justifyContent="center" alignItems="center">
              <div>
                <Typography sx={{ mb: 1, mt: 1 }}>Signatories</Typography>
                {existingUsers && existingUsers.length > 0 && (
                  <Controller
                    name="signees"
                    control={control}
                    defaultValue={[]}
                    sx={{
                      border: '1px solid #ced4da', // Add border styles here
                      borderRadius: '4px', // Add border radius here
                    }}
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        disableClearable
                        disablePortal
                        multiple
                        filterSelectedOptions
                        options={existingUsers}
                        getOptionDisabled={(option) => option.disabled}
                        getOptionLabel={(option) => option.full_name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        id="signees"
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            id="signees"
                            name="signees"
                            type="search"
                            inputRef={ref}
                            {...params}
                          />

                        )}
                      />

                    )}

                  />
                )}


                <span className='errorSpan' >{signeeErrors.signees?.message}</span>
              </div>
            </Grid>

          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="left" alignItems="left">
              <div style={styles.buttonContainerLeft} justifyContent="left" alignItems="left" >
                <BTNMUI align='left' variant='contained' disabled={activeStep === 0} onClick={handleBack} style={styles.button} >
                  Back
                </BTNMUI>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div style={styles.buttonContainer} justify="center" alignItems="center">
                <BTNMUI
                  style={styles.button}
                  width="50%"
                  variant="contained"
                  type='submit'
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </BTNMUI>
              </div>
            </Grid>
          </Grid>
        </form>

      </Box>
    );
  };
  // Remaining form components and steps...
  const ValuationSummary = () => {

    function createData(name, calories, fat, carbs, protein) {
      return { name, calories, fat, carbs, protein };
    }

  
    useEffect(() => {
      setRecipientUsernames(valauationdetails?.report_user_name);
    }, [valauationdetails]);


    const [recipientUserEmail, setRecipientUserEmail] = useState([]);
    useEffect(() => {
      setRecipientUserEmail(valauationdetails?.report_user_email);
    }, [valauationdetails]);

    const [recipientUserPhone, setRecipientUserPhone] = useState([]);
    useEffect(() => {
      setRecipientUserPhone(valauationdetails?.report_user_phone);
    }, [valauationdetails]);


    return (
      <Box component={Paper} sx={{ p: 5 }}>
        <Grid container spacing={2} sx={{ mt: 5 }} >
          <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
            <Typography sx={{ mb: 1, ml: 2 }} variant='h4' >Location Details</Typography>
            <Divider></Divider>
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      County
                    </TableCell>
                    <TableCell align="left">{locationDetails.locationName}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Town
                    </TableCell>
                    <TableCell align="left">{locationDetails.town}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      NeighbourHood
                    </TableCell>
                    <TableCell align="left">{locationDetails.neighbourHood}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Street
                    </TableCell>
                    <TableCell align="left">{locationDetails.street}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Location Name
                    </TableCell>
                    <TableCell align="left">{locationDetails.street}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
            <Typography sx={{ mb: 1, ml: 2 }} variant='h4'>Property Details</Typography>
            <Divider></Divider>
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Property Type
                    </TableCell>
                    <TableCell align="left">{propertdetails.propertyType.name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Total Built Up Area
                    </TableCell>
                    <TableCell align="left">{propertdetails.totalBuiltUpArea}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Land Size
                    </TableCell>
                    <TableCell align="left">{propertdetails.landSize}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Tenure
                    </TableCell>
                    <TableCell align="left">{propertdetails.tenure}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

        </Grid>
        <Grid container spacing={2} sx={{ mt: 1 }} >
          <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
            <Typography sx={{ mb: 1, ml: 2 }} variant='h4'>Valuation </Typography>
            <Divider></Divider>
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Client
                    </TableCell>
                    <TableCell align="left">{recipientdetails[0].organization_name}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Market Value
                    </TableCell>
                    <TableCell align="left">{valauationdetails.marketValue}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Forced Sale Value
                    </TableCell>
                    <TableCell align="left">{valauationdetails.forcedSaleValue}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Insurence Value
                    </TableCell>
                    <TableCell align="left">{valauationdetails.insurenceValue}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Annual Gross Rental Income
                    </TableCell>
                    <TableCell align="left">{valauationdetails.annualGRossRentalIncome}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Date of Valuation
                    </TableCell>
                    <TableCell align="left">{valauationdetails.valuationDate}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Date of Instruction
                    </TableCell>
                    <TableCell align="left">{valauationdetails.InstructionDate}</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Uploaded Report
                    </TableCell>
                    <TableCell align="left">{uploadedFileD?.name}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
            <Typography sx={{ mb: 1, ml: 2 }} variant='h4'>Report Signatories</Typography>
            <Divider ></Divider>
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    signatories.map((signee) => {
                      return (
                        <>
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {signee.full_name}
                            </TableCell>
                            <TableCell align="left">{signee.email}</TableCell>
                          </TableRow>
                        </>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Typography sx={{ mb: 1, ml: 2, mt: 2 }} variant='h4'>Recipients for Client Organization</Typography>
            <Divider ></Divider>
            <TableContainer component={Paper} sx={{ width: "95%", ml: "2.5%", mr: "2.5%", mt: 2 }}>
              <Table size="large" aria-label="a  table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {

                 (JSON.stringify(recipientUsernames)!=null && JSON.stringify(recipientUsernames)!="") &&
                    recipientUsernames.map((signee, key) => {
                      return (
                        <>
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {signee}
                            </TableCell>
                            <TableCell align="left">{recipientUserEmail[key]}</TableCell>
                            <TableCell align="left">{recipientUserPhone[key]}</TableCell>
                          </TableRow>
                        </>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container spacing={2} sx={{ mt: 5 }} >
              <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
                <div style={styles.buttonContainer}>
                  <BTNMUI fullWidth color="primary" variant='contained' disabled={activeStep === 0} onClick={handleBack} style={styles.button}>
                    Back
                  </BTNMUI>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
                <div style={styles.buttonContainer}>

                  <BTNMUI
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={styles.button}
                    onClick={submitReportForSinature}
                  >
                    {activeStep === steps.length - 1 ? 'Save and Send for Signature' : ''}
                  </BTNMUI>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} justifyContent="center" alignItems="center">
                <div style={styles.buttonContainer}>

                  <BTNMUI
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={styles.button}
                  >
                    {activeStep === steps.length - 1 ? 'Save and Send to Client' : ''}
                  </BTNMUI>
                </div>
              </Grid>
            </Grid>
          </Grid>

        </Grid>


      </Box>
    );
  }
  const theme = useTheme();
  return (
    <Box sx={{ mt: 3, ml: 10, mr: 10, minHeight: "850px;", backgroundColor: theme.palette.background.alt, padding: 4 }} >
      <div style={styles.stepper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepCompleted(index)}>
              <StepLabel style={{ color: "green" }} >{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div style={styles.content}>
        {activeStep === 0 && <LocationForm />}
        {activeStep === 1 && <PropertyDetailsForm />}
        {activeStep === 2 && <PropertyValuationForm />}
        {activeStep === 3 && <ValuationSignatures />}
        {activeStep === 4 && <ValuationSummary />}


      </div>

    </Box>
  );
};

export default ReportSubmit;
