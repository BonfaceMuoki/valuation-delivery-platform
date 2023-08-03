import React, { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import Head from "../../layout/head/Head";
import Content from "../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  Icon,
  RSelect
} from "../../components/Component";
import makeAnimated from 'react-select/animated';
import { useForm } from "react-hook-form";
import { Steps, Step } from "react-step-builder";
import { Row, Col, Button } from "reactstrap";

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector,useDispatch } from "react-redux";

import { GoogleMapsProvider, useGoogleMap } from "@ubilabs/google-maps-react-hooks";
import MapWithAutoSearch from "./MapWithAutoSearch";
import {setValuationLocationDetails} from "../../featuers/authSlice";

import { selectLocationDetails,
  selectPropertyDetails,
  setValuationPropertyDetails,
  selectValuationDetails,selectCurrentRecipient } from "../../featuers/authSlice";
import {
    useUploadValuationReportV2Mutation,
    useGetUsersQuery,
    useGetAccesorsListQuery,
    useGetPropertyTypeListQuery,
  } from "../../api/commonEndPointsAPI";
import Dropzone from "react-dropzone";
const LocationForm = (props) => {
  const dispatch = useDispatch();
  const locationDetails = useSelector(selectLocationDetails);

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
  const onSubmitLocation = async (data) => {

    dispatch(setValuationLocationDetails(data));
    props.next();
  }
  // useEffect(() => {
  //   if (locationDetails != null) {
  //     setLocationValues("locationName", locationDetails?.locationName);
  //     setLocationValues("county", locationDetails?.county);
  //     setLocationValues("neighbourHood", locationDetails?.neighbourHood);
  //     setLocationValues("street", locationDetails?.street);
  //     setLocationValues("town", locationDetails?.town);
      
  //   }
  // }, [locationDetails])
  return (
    <form onSubmit={handleLocationSubmit(onSubmitLocation)}>
      <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Location Name
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerlocation("locationName", { required: true })}
                defaultValue={locationDetails?.locationName}
               
              />
              {locationerrors.locationName && <span className="invalid">{locationerrors.locationName?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="last-name">
            County
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="last-name"
                className="form-control"
                {...registerlocation("county", { required: true })}
                defaultValue={locationDetails?.county}
              />
              {locationerrors.county && <span className="invalid">{locationerrors.county?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
            Town
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="email"
                className="form-control"
                {...registerlocation("town", {
                  required: true,                 
                })}
                defaultValue={locationDetails?.town}
              />
              {locationerrors.email=== "required" && <span className="invalid">{locationerrors.town?.message}</span> }
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="phone-no">
              Street
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="phone-no"
                className="form-control"
                {...registerlocation("street", { required: true })}
                defaultValue={locationDetails?.street}
              />
              {locationerrors.street && <span className="invalid">{locationerrors.neighbourHood?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="city">
            Neighbourhood
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="city"
                className="form-control"
                {...registerlocation("neighbourHood", { required: true })}
                defaultValue={locationDetails?.neighbourHood}
              />
              {locationerrors.neighbourHood && <span className="invalid">{locationerrors.neighbourHood?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
      <Col md="12">
          <div className="form-group">
            <MapWithAutoSearch />
          </div>
        </Col>
      </Row>

      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};

const PropertyDetailsForm = (props) => {
  const propertdetails = useSelector(selectPropertyDetails);
  const dispatch = useDispatch();
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
  const onSubmitPropertyDetails = async (data) => {
    console.log(data);   
    dispatch(setValuationPropertyDetails(data));
    props.next();
  }
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const animatedComponents = makeAnimated();

  return (
    <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)} >
    <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Property LR
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="username"
                className="form-control"
                {...registerproperty("PropertyLR", { required: true })}
                defaultValue={propertdetails?.username}
              />
              {properrtyErrors.PropertyLR && <span className="invalid">{properrtyErrors.PropertyLR?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Property Type
            </label>
            <div className="form-control-wrap">
            <RSelect 
            isMulti 
            components={animatedComponents}
            options={options}
            {...registerproperty("PropertyType", {
              required: "This field is required"                 
            })}

            />
              {properrtyErrors?.PropertyType && <span className="invalid">{properrtyErrors.PropertyType?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Total Built Up Area
            </label>
            <div className="form-control-wrap">
              <input
                type="totalBuiltUpArea"
                id="totalBuiltUpArea"
                className="form-control"
                {...registerproperty("totalBuiltUpArea", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
   
      </Row>
      <Row>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Land Size
            </label>
            <div className="form-control-wrap">
              <input
                type="landSize"
                id="landSize"
                className="form-control"
                {...registerproperty("landSize", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Tenure
            </label>
            <div className="form-control-wrap">
              <input
                type="tenure"
                id="tenure"
                className="form-control"
                {...registerproperty("tenure", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.tenure}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
     
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};

const PropertyValuationForm = (props) => {
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
  const valauationdetails = useSelector(selectValuationDetails); 
  const recipientdetails = useSelector(selectCurrentRecipient);
  const [existingAccessors, setExistingAccessors] = useState();
  useEffect(() => {
    if (valauationdetails != null) {
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
  console.log("Accesors List");
  console.log(accesorslist);
  useEffect(() => {
    if(accesorslist!=undefined){
      const restructuredData = accesorslist.map(({ id, organization_name }) => ({
        value: id,
        label: organization_name,
        name:  organization_name
      }));
      setExistingAccessors(restructuredData);
    }
 
  }, [accesorslist]);
  console.log("existingAccessors List appended");

  console.log(existingAccessors);


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

  const onSubmitPropertyValuation = async (data) => {
    delete data.file;
    dispatch(setValuationDetails(data));
    dispatch(setReportRecipient(data.recipient));
    if(existingAccessors.length > 0){
      props.next();
    } else{

    }
  }
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


  return (
    <form onSubmit={handlePropertyValuationsSubmit(onSubmitPropertyValuation)}>
      <Row className="gy-3">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="fw-token-address">
              Recipient
            </label>
            <div className="form-control-wrap">
              {
                ((existingAccessors!=undefined) >0)&& <RSelect
                value={[1]}
                isMulti
                {...registerpropertyValuation("recipient", { required: true })}
                options={existingAccessors}
              />
             
              }
               {propertyValuationErrors.recipient && (
                <span className="invalid">{propertyValuationErrors.recipient?.message}</span>
              )}
         
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label">Report Document(Only PDF)</label>
            <div className="form-control-wrap">
              <div className="form-file">
                <input className="form-control" type="file" multiple id="customMultipleFiles" />
                {propertyValuationErrors.recipient && (
                <span className="invalid">{propertyValuationErrors.file?.message}</span>
              )}
              </div>
            </div>
          </div>
        </Col>
        
      </Row>
      <Row>
      <Col md="4">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Market Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("marketValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
               
              />
              {propertyValuationErrors.marketValue && <span className="invalid">{propertyValuationErrors.marketValue?.message}</span>}
            </div>
          </div>
      </Col>
      <Col md="4">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Forced Sale Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("forcedSaleValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
               
              />
              {propertyValuationErrors.forcedSaleValue && <span className="invalid">{propertyValuationErrors.forcedSaleValue?.message}</span>}
            </div>
          </div>
      </Col>
      <Col md="4">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Insurence Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("insurenceValue", { required: true })}
                defaultValue={valauationdetails?.insurenceValue}
               
              />
              {propertyValuationErrors.insurenceValue && <span className="invalid">{propertyValuationErrors.insurenceValue?.message}</span>}
            </div>
          </div>
      </Col>
      </Row>
      <Row>
      <Col md="6">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Annual Grooss Income
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("annualGRossRentalIncome", { required: true })}
                defaultValue={valauationdetails?.annualGRossRentalIncome}
               
              />
              {propertyValuationErrors.annualGRossRentalIncome && <span className="invalid">{propertyValuationErrors.annualGRossRentalIncome?.message}</span>}
            </div>
          </div>
      </Col>
      <Col md="6">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Forced Sale Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("forcedSaleValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
               
              />
              {propertyValuationErrors.forcedSaleValue && <span className="invalid">{propertyValuationErrors.forcedSaleValue?.message}</span>}
            </div>
          </div>
      </Col>
      </Row>
      <Row>
      <Col md="6">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Valuation Date
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("valuationDate", { required: true })}
                defaultValue={valauationdetails?.valuationDate}
               
              />
              {propertyValuationErrors.valuationDate && <span className="invalid">{propertyValuationErrors.valuationDate?.message}</span>}
            </div>
          </div>
      </Col>
      <Col md="6">
      <div className="form-group">
            <label className="form-label" htmlFor="first-name">
            Instruction Date
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="first-name"
                className="form-control"
                {...registerpropertyValuation("InstructionDate", { required: true })}
                defaultValue={valauationdetails?.InstructionDate}
               
              />
              {propertyValuationErrors.InstructionDate && <span className="invalid">{propertyValuationErrors.InstructionDate?.message}</span>}
            </div>
          </div>
      </Col>
      </Row>
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};

const ValuationSignatures = (props) => {
  const propertdetails = useSelector(selectPropertyDetails);
  const dispatch = useDispatch();
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
  const onSubmitPropertyDetails = async (data) => {
    console.log(data);   
    dispatch(setValuationPropertyDetails(data));
    props.next();
  }
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const animatedComponents = makeAnimated();

  return (
    <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)} >
    <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Property LR
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="username"
                className="form-control"
                {...registerproperty("PropertyLR", { required: true })}
                defaultValue={propertdetails?.username}
              />
              {properrtyErrors.PropertyLR && <span className="invalid">{properrtyErrors.PropertyLR?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Property Type
            </label>
            <div className="form-control-wrap">
            <RSelect 
            isMulti 
            components={animatedComponents}
            options={options}
            {...registerproperty("PropertyType", {
              required: "This field is required"                 
            })}

            />
              {properrtyErrors?.PropertyType && <span className="invalid">{properrtyErrors.PropertyType?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Total Built Up Area
            </label>
            <div className="form-control-wrap">
              <input
                type="totalBuiltUpArea"
                id="totalBuiltUpArea"
                className="form-control"
                {...registerproperty("totalBuiltUpArea", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
   
      </Row>
      <Row>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Land Size
            </label>
            <div className="form-control-wrap">
              <input
                type="landSize"
                id="landSize"
                className="form-control"
                {...registerproperty("landSize", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Tenure
            </label>
            <div className="form-control-wrap">
              <input
                type="tenure"
                id="tenure"
                className="form-control"
                {...registerproperty("tenure", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.tenure}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
     
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};
const ValuationSummary = (props) => {
  const propertdetails = useSelector(selectPropertyDetails);
  const dispatch = useDispatch();
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
  const onSubmitPropertyDetails = async (data) => {
    console.log(data);   
    dispatch(setValuationPropertyDetails(data));
    props.next();
  }
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  const animatedComponents = makeAnimated();

  return (
    <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)} >
    <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Property LR
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="username"
                className="form-control"
                {...registerproperty("PropertyLR", { required: true })}
                defaultValue={propertdetails?.username}
              />
              {properrtyErrors.PropertyLR && <span className="invalid">{properrtyErrors.PropertyLR?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Property Type
            </label>
            <div className="form-control-wrap">
            <RSelect 
            isMulti 
            components={animatedComponents}
            options={options}
            {...registerproperty("PropertyType", {
              required: "This field is required"                 
            })}

            />
              {properrtyErrors?.PropertyType && <span className="invalid">{properrtyErrors.PropertyType?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="12">
          <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Total Built Up Area
            </label>
            <div className="form-control-wrap">
              <input
                type="totalBuiltUpArea"
                id="totalBuiltUpArea"
                className="form-control"
                {...registerproperty("totalBuiltUpArea", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
   
      </Row>
      <Row>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Land Size
            </label>
            <div className="form-control-wrap">
              <input
                type="landSize"
                id="landSize"
                className="form-control"
                {...registerproperty("landSize", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.landSize}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
        <div className="form-group">
            <label className="form-label" htmlFor="rePassword">
            Tenure
            </label>
            <div className="form-control-wrap">
              <input
                type="tenure"
                id="tenure"
                className="form-control"
                {...registerproperty("tenure", {
                  required: "This field is required"})}
                defaultValue={propertdetails?.tenure}
              />
              {properrtyErrors.landSize && <span className="invalid">{properrtyErrors.landSize?.message}</span>}
            </div>
          </div>
        </Col>
      </Row>
     
      <div className="actions clearfix">
        <ul>
          <li>
            <Button color="primary" type="submit">
              Next
            </Button>
          </li>
          <li>
            <Button color="primary" onClick={props.prev}>
              Previous
            </Button>
          </li>
        </ul>
      </div>
    </form>
  );
};


const Header = (props) => {
  return (
    <div className="steps clearfix">
      <ul>
        <li className={props.current >= 1 ? "first done" : "first"}>
          <a href="#wizard-01-h-0" onClick={(ev) => ev.preventDefault()}>
            <span className="number">  Step 1</span><h5>Property Location  </h5>
          </a>
        </li>
        <li className={props.current >= 2 ? "done" : ""}>
          <a href="#wizard-01-h-1" onClick={(ev) => ev.preventDefault()}>
            <span className="number">Step 02</span> <h5>Property Details</h5>
          </a>
        </li>
        <li className={props.current >= 3 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <span className="number">03</span> <h5>Step 3</h5>
          </a>
        </li>
        <li className={props.current >= 4 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <span className="number">04</span> <h5>Step 4</h5>
          </a>
        </li>
        <li className={props.current >= 5 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <span className="number">05</span> <h5>Step 5</h5>
          </a>
        </li>
        <li className={props.current === 6 ? "last done" : "last"}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">current step: </span>
            <span className="number">06</span> <h5>Step 6</h5>
          </a>
        </li>
      </ul>
    </div>
  );
};

const Success = (props) => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <BlockTitle tag="h6" className="text-center">
        Thank you for submitting form
      </BlockTitle>
    </div>
  );
};

const config = {
  before: Header,
};

const ReportSubmit = () => {
  return (
    <React.Fragment>
      <Head title="New Report Upload" />
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">
              Upload New Report
            </BlockTitle>
          </BlockHeadContent>
        </BlockHead>

        <Block size="lg">
          <PreviewCard>
            <div className="nk-wizard nk-wizard-simple is-alter wizard clearfix">
              <Steps config={config}>
                <Step component={LocationForm} />
                <Step component={PropertyDetailsForm} />
                <Step component={PropertyValuationForm} />
                <Step component={ValuationSignatures} />
                <Step component={ValuationSummary} />
                <Step component={Success} />
              </Steps>
            </div>
          </PreviewCard>
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default ReportSubmit;
