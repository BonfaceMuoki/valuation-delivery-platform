import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Stepper, Step, StepLabel, Button, Paper, TextField, Grid ,Typography,Button as BTNMUI} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import "../../assets/scss/validation.css";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import { UploadFileOutlined } from '@mui/icons-material';


const styles = {
  root: {
    backgroundColor: '#f5f5f5',
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
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  button: {
    marginLeft: '8px',
  },
};
const steps = ['Location', 'Property Details', 'Valuation', 'Signature', 'Confirm'];
const locationValidationSchema = Yup.object().shape({
  locationName: Yup.string().required('Location Name is required'),
  street: Yup.string().required('Street is required'),
  county: Yup.string().required('County is required'),
  neighbourHood: Yup.string().required('Neighbourhood is required'),
});
const ReportSubmit = () => {
  const { register: registerlocation, handleSubmit: handleLocationSubmit, formState: { errors: locationerrors, isValid: locationIsValid } } = useForm({
    resolver: yupResolver(locationValidationSchema),
  });
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
  const propertyValuationValidationSchema = Yup.object().shape({
    marketValue: Yup.string().required('Market Value is required'),
    forcedSaleValue: Yup.number().required('Forced Sale value is required'),
    insurenceValue: Yup.string().required("Insurence Value is required"),
    annualGRossRentalIncome: Yup.string().required("Annual Gross Rental Income is required"),
    valuationDate: Yup.string().required("Valuation date is required"),
    InstructionDate: Yup.string().required("Instruction Date is required")
  });
  const { register: registerpropertyValuation, handleSubmit: handlePropertyValuationsSubmit, formState: { errors: propertyValuationErrors, isValid: propertyValuationIsValid } } = useForm({
    resolver: yupResolver(propertyValuationValidationSchema),
  });
  const propertyDetailsSchema = Yup.object().shape({
    propertyType: Yup.string().required('Property type is required'),
    totalBuiltUpArea: Yup.number().required('Total Builtup area is required'),
    tenure: Yup.number().required('Tenure is required'),
    landSize: Yup.number().required('Land size is required')
  });
  const { register: registerproperty, handleSubmit: handlePropertyDetailsSubmit, formState: { errors: properrtyErrors, isValid: propertyDetailsIsValid } } = useForm({
    resolver: yupResolver(propertyDetailsSchema),
  });
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(true);
  const locationformRef = useRef(null);
  const onSubmitLocation = (data) => {
    console.log(data);
  }
  const onSubmitPropertyDetails = (data) => {
    console.log(data);
  }
  const onSubmitPropertyValuation = (data) => {
    console.log(data);
  }
  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep == 0) {
      await handleLocationSubmit(onSubmitLocation)();
      if (locationIsValid) {
       
      } else {
        console.log(locationerrors);
      }
    }
    else if (activeStep == 1) {
      await handlePropertyDetailsSubmit(onSubmitPropertyDetails)();      
      if(propertyDetailsIsValid){       
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }else{
        console.log(properrtyErrors);
      }
    } else if (activeStep == 2) {
      await handlePropertyValuationsSubmit(onSubmitPropertyValuation)();
      if (propertyValuationIsValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        console.log(propertyValuationErrors);
      }
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepCompleted = (step) => {
    return step < activeStep;
  };
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
      <>
      </>
    );
  });

  const LocationForm = () => {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    });

    return (

      <>
        <form>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField
                  {...registerlocation('locationName',{ required: true }, { shouldRender: !locationerrors.locationName })}
                  placeholder="Location Name"
                  fullWidth
                />
                <span className='errorSpan' >{locationerrors.locationName?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField {...registerlocation('county',{ required: true }, { shouldRender: !locationerrors.county })} placeholder="County" fullWidth /><br />
                <span className='errorSpan' >{locationerrors.county?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField
                  {...registerlocation('neighbourHood',{ required: true }, { shouldRender: !locationerrors.neighbourHood })}
                  placeholder="Neighbourhood"
                  fullWidth
                /><br />
                <span className='errorSpan' >{locationerrors.neighbourHood?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField {...registerlocation('street',{ required: true }, { shouldRender: !locationerrors.neighbourHood })} placeholder="Street" fullWidth /><br />
                <span className='errorSpan' >{locationerrors.street?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} >
            <Grid item xs={12} sm={12} md={12} justifyContent="center" alignItems="center">
              <MapContainer isLoaded={isLoaded} />
            </Grid>
          </Grid>
        </form>
        <div style={styles.buttonContainer}>
        <Button disabled={activeStep === 0} onClick={handleBack} style={styles.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          style={styles.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
      </>
    );
  };
  const PropertyDetailsForm = () => {
    return (
      <>
        <form>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField
                  {...registerproperty('propertyType')}
                  placeholder="Property Type"
                  fullWidth
                />
                <span className='errorSpan' >{properrtyErrors.propertyType?.message}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
                <TextField {...registerproperty('totalBuiltUpArea')} placeholder="Total Built Up Area" fullWidth /><br />
                <span className='errorSpan' >{properrtyErrors.totalBuiltUpArea?.message}</span>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 5 }} >
            <Grid item xs={12} sm={6} md={6} justifyContent="center" alignItems="center">
              <div>
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
                <TextField {...registerproperty('tenure')} placeholder="Tenure" fullWidth /><br />
                <span className='errorSpan' >{properrtyErrors.tenure?.message}</span>
              </div>
            </Grid>
          </Grid>
        </form>
        <div style={styles.buttonContainer}>
        <Button disabled={activeStep === 0} onClick={handleBack} style={styles.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          style={styles.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
      </>
    );
  };
  const PropertyValuationForm = () => {

    return (

      <>
        <Grid container spacing={2} sx={{ mt: 5 }} >
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField
                {...registerpropertyValuation('marketValue')}
                placeholder="Property Type"
                fullWidth
              />
              <span className='errorSpan' >{propertyValuationErrors.marketValue?.message}</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField {...registerpropertyValuation('forcedSaleValue')} placeholder="Total Built Up Area" fullWidth /><br />
              <span className='errorSpan' >{propertyValuationErrors.forcedSaleValue?.message}</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField {...registerpropertyValuation('insurenceValue')} placeholder="Total Built Up Area" fullWidth /><br />
              <span className='errorSpan' >{propertyValuationErrors.insurenceValue?.message}</span>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 5 }} >
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField
                {...registerpropertyValuation('annualGrossRentalIncome')}
                placeholder="Annual Gross REnetal Income"
                fullWidth
              /><br />
              <span className='errorSpan' >{propertyValuationErrors.annualGRossRentalIncome?.message}</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField {...registerpropertyValuation('valuationDate')} placeholder="Date Of Valuation" fullWidth /><br />
              <span className='errorSpan' >{propertyValuationErrors.valuationDate?.message}</span>
            </div>
          </Grid>
          <Grid item xs={12} sm={4} md={4} justifyContent="center" alignItems="center">
            <div>
              <TextField {...registerpropertyValuation('InstructionDate')} placeholder="Instruction Date" fullWidth /><br />
              <span className='errorSpan' >{propertyValuationErrors.InstructionDate?.message}</span>
            </div>
          </Grid>

        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 5 }} >
          <label htmlFor="upload-photo">
                                    <input
                                        style={{ display: 'none' }}
                                        id="upload-photo"
                                        type="file"
                                        {...registerpropertyValuation("file", {
                                            onChange: handleImage
                                        })}
                                    />
                                    <Typography sx={{ ml: 1, mt: 3 }}>Report Document(Only PDF)</Typography>
                                    <BTNMUI variant="outlined" sx={{ mt: 0, textAlign: "left", height: 70, width: "100%" }} color="secondary" component="span" >
                                        <UploadFileOutlined sx={{ fontSize: "55px" }} />
                                    </BTNMUI><br />
                                    {(uploadedFile != "") ? <span sx={{ mt: 3, fontSize: "25px" }} className='successSpan'>{uploadedFile}</span> : ""}
                                </label>
                                <span className='errorSpan' ><br></br>{propertyValuationErrors.file?.message}</span>
          </Grid>

        </Grid>
        <div style={styles.buttonContainer}>
        <Button disabled={activeStep === 0} onClick={handleBack} style={styles.button}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          style={styles.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
      </>
    );
  };

  // Remaining form components and steps...

  return (
    <Paper style={styles.root}>
      <div style={styles.stepper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={isStepCompleted(index)}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div style={styles.content}>
        {/* Render the form content for each step */}
        {activeStep === 0 && <LocationForm />}
        {activeStep === 1 && <PropertyDetailsForm />}
        {activeStep === 2 && <PropertyValuationForm />}

      </div>
  
    </Paper>
  );
};

export default ReportSubmit;
