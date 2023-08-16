import React, { useState, useRef, useEffect, useCallback } from "react";
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
  RSelect,
} from "../../components/Component";
import makeAnimated from "react-select/animated";
import { Controller, useForm } from "react-hook-form";
import { Steps, Step } from "react-step-builder";
import {
  Row,
  Col,
  Button,
  Card,
  UncontrolledDropdown,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import MapWithAutoSearch from "./MapWithAutoSearch";
import UserAvatar from "../user/UserAvatar";
// import {setValuationLocationDetails} from "../../featuers/authSlice";

import {
  setValuationDetails,
  setValuationLocationDetails,
  setValuationPropertyDetails,
  setReportRecipient,
  selectCurrentSignatories,
  setReportSignatories,
  selectCurrentRecipient,
  selectValuationDetails,
  selectLocationDetails,
  selectPropertyDetails,
  selectSelectedRecipient,
  selectSelectedPropertyType,
  settSelectedRecipient,
  setSelectedPropertyType,
  setSelectedRecipient,
} from "../../featuers/authSlice";
import {
  useUploadValuationReportV2Mutation,
  useGetUsersQuery,
  useGetAccesorsListQuery,
  useGetPropertyTypeListQuery,
} from "../../api/commonEndPointsAPI";

import DatePicker from "react-datepicker";
import Select from "react-select";

const LocationForm = (props) => {
  const dispatch = useDispatch();
  const locationDetails = useSelector(selectLocationDetails);

  const locationValidationSchema = Yup.object().shape({
    locationName: Yup.string().required("Location Name is required"),
    town: Yup.string().required("Town is required"),
    street: Yup.string().required("Street is required"),
    county: Yup.string().required("County is required"),
    neighbourHood: Yup.string().required("Neighbourhood is required"),
  });
  const {
    register: registerlocation,
    setValue: setLocationValues,
    handleSubmit: handleLocationSubmit,
    formState: { errors: locationerrors, isValid: locationIsValid },
  } = useForm({
    resolver: yupResolver(locationValidationSchema),
  });
  const onSubmitLocation = async (data) => {
    dispatch(setValuationLocationDetails(data));
    props.next();
  };
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
            <label className="form-label" htmlFor="county">
              County
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="county"
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
            <label className="form-label" htmlFor="town">
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
              {locationerrors.email === "required" && <span className="invalid">{locationerrors.town?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="street">
              Street
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="street"
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
            <label className="form-label" htmlFor="neighbourhood">
              Neighbourhood
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="neighbourhood"
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
  const [propertyTypes, setPropertyTypes] = useState([]);
  const propertdetails = useSelector(selectPropertyDetails);
  const selectedptype = useSelector(selectSelectedPropertyType);

  const dispatch = useDispatch();
  const propertyDetailsSchema = Yup.object().shape({
    PropertyLR: Yup.string().required("The proprty Lr is required"),
    PropertyType: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string(),
          label: Yup.string(),
        })
      )
      .min(1, "Property tYPE required")
      .max(1, "Only one Property Type is required."),
    totalBuiltUpArea: Yup.number().required("Total Builtup area is required"),
    tenure: Yup.string().required("Tenure is required"),
    landSize: Yup.number().required("Land size is required"),
  });
  const {
    register: registerproperty,
    control,
    setValue: setPropertyDetailsValues,
    handleSubmit: handlePropertyDetailsSubmit,
    formState: { errors: properrtyErrors, isValid: propertyDetailsIsValid },
  } = useForm({
    resolver: yupResolver(propertyDetailsSchema),
  });
  const onSubmitPropertyDetails = async (data) => {
    // console.log("propertdetails");
    // console.log(propertdetails);
    // console.log("Submitted data");

    if (!("PropertyType" in data)) {
      data["PropertyType"] = propertdetails.PropertyType;
    }
    // console.log(data);
    dispatch(setValuationPropertyDetails(data));
    props.next();
  };

  const { data: propertytypesapi, isLOading } = useGetPropertyTypeListQuery();

  useEffect(() => {
    if (propertytypesapi != undefined) {
      const restructuredpropertytypes = propertytypesapi.map(({ id, type_name }) => ({
        value: id,
        label: type_name,
        name: type_name,
      }));
      setPropertyTypes(restructuredpropertytypes);
    }
  }, [propertytypesapi]);

  return (
    <form onSubmit={handlePropertyDetailsSubmit(onSubmitPropertyDetails)}>
      <Row className="gy-4">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="propertylr">
              Property LR
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="propertylr"
                className="form-control"
                {...registerproperty("PropertyLR", { required: true })}
                defaultValue={propertdetails?.PropertyLR}
              />
              {properrtyErrors.PropertyLR && <span className="invalid">{properrtyErrors.PropertyLR?.message}</span>}
            </div>
          </div>
        </Col>
        <Col md="6">
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <div className="form-control-wrap">
              <Controller
                name="PropertyType"
                control={control}
                render={({ field }) => (
                  <Select
                    className="react-select-container "
                    classNamePrefix="react-select"
                    options={propertyTypes}
                    defaultValue={propertdetails?.PropertyType != null ? propertdetails?.PropertyType[0] : ""}
                    {...field}
                    isMulti
                    placeholder="Select Property Type"
                  />
                )}
              />
              {properrtyErrors?.PropertyType && (
                <span className="invalid">{properrtyErrors.PropertyType?.message}</span>
              )}
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
                  required: "This field is required",
                })}
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
                  required: "This field is required",
                })}
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
                  required: "This field is required",
                })}
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
  const [recipientUsernames, setRecipientUsernames] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [recipientPhone, setRecipientPhone] = useState([]);
  const propertyValuationValidationSchema = Yup.object().shape({
    marketValue: Yup.string()
      .required("This field is required")
      .test("valid-number", "Invalid number", (value) => {
        if (!value) return true;
        const rawValue = value.replace(/,/g, "");
        return !isNaN(rawValue);
      }),
    forcedSaleValue: Yup.string()
      .required("Forced Sale value is required")
      .test("valid-number", "Invalid number", (value) => {
        if (!value) return true;
        const rawValue = value.replace(/,/g, "");
        return !isNaN(rawValue);
      }),
    insurenceValue: Yup.string()
      .required("Insurence Value is required")
      .test("valid-number", "Invalid Insurence Value", (value) => {
        if (!value) return true;
        const rawValue = value.replace(/,/g, "");
        return !isNaN(rawValue);
      }),
    annualGRossRentalIncome: Yup.string()
      .required("Annual Gross Rental Income is required")
      .test("valid-number", "Invalid Annual Gross Rental Income", (value) => {
        if (!value) return true;
        const rawValue = value.replace(/,/g, "");
        return !isNaN(rawValue);
      }),
    PropertyDescription: Yup.string(),
    recipient: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string(),
          label: Yup.string(),
        })
      )
      .min(1, "Recipient required")
      .max(1, "Only one recipient is required."),
    file: Yup.mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only PDF files are allowed", (value) => {
        if (value[0]) {
          return ["application/pdf", "pdf"].includes(value[0].type);
        }
        return true;
      }),
  });
  const {
    register: registerpropertyValuation,
    control,
    setValue: setPropertValuationValues,
    handleSubmit: handlePropertyValuationsSubmit,
    formState: { errors: propertyValuationErrors, isValid: propertyValuationIsValid },
  } = useForm({
    resolver: yupResolver(propertyValuationValidationSchema),
  });

  const [reportUsersFields, setReportUsersFields] = useState([]);
  const addReportUser = (nameVal = "", phoneVal = "", emailVal = "") => {
    setReportUsersFields([
      ...reportUsersFields,
      {
        formFieldName: "report_user_name",
        fieldEmail: "report_user_email",
        fieldPhoneNumber: "report_user_phone",
        formFildNameValue: nameVal,
        fieldEmailValue: emailVal,
        fieldPhoneNumberValue: phoneVal,
        formFieldNamePlace: "Recipient Name",
        fieldEmailPlace: "Recipient Email",
        fieldPhoneNumberPlace: "Recipient Phone",
      },
    ]);
  };
  const valauationdetails = useSelector(selectValuationDetails);
  // console.log(valauationdetails);
  const selectedrecipient = useSelector(selectSelectedRecipient);
  // console.log("selectedrecipient");
  // console.log(selectedrecipient);

  const recipientdetails = useSelector(selectCurrentRecipient);
  const [existingAccessors, setExistingAccessors] = useState();
  useEffect(() => {
    if (valauationdetails != null) {
      console.log(valauationdetails);
      setRecipientUsernames(valauationdetails?.report_user_name);
      setRecipientEmails(valauationdetails?.report_user_email);
      setRecipientPhone(valauationdetails?.report_user_phone);
      console.log("count " + Object.keys(valauationdetails?.report_user_name).length);
      console.log("count " + Object.keys(recipientUsernames).length);

      const available_usernames = valauationdetails?.report_user_name;
      const available_useremails = valauationdetails?.report_user_email;
      const available_userphones = valauationdetails?.report_user_phone;

      console.log("count ss " + available_usernames.length);

      if (Object.keys(available_usernames).length > 0) {
        const updatedFields = available_usernames.map((orgrecipient, key) => ({
          formFieldName: "report_user_name",
          fieldEmail: "report_user_email",
          fieldPhoneNumber: "report_user_phone",
          formFildNameValue: orgrecipient,
          fieldEmailValue: available_useremails[key],
          fieldPhoneNumberValue: available_userphones[key],
          formFieldNamePlace: "Recipient Name",
          fieldEmailPlace: "Recipient Email",
          fieldPhoneNumberPlace: "Recipient Phone",
        }));
        setReportUsersFields((reportUsersFields) => [...reportUsersFields, ...updatedFields]);
      }
    } else {
      setReportUsersFields([
        ...reportUsersFields,
        {
          formFieldName: "report_user_name",
          fieldEmail: "report_user_email",
          fieldPhoneNumber: "report_user_phone",
          formFildNameValue: "",
          fieldEmailValue: "",
          fieldPhoneNumberValue: "",
          formFieldNamePlace: "Recipient Name",
          fieldEmailPlace: "Recipient Email",
          fieldPhoneNumberPlace: "Recipient Phone",
        },
      ]);
    }
  }, []);

  const {
    data: accesorslist,
    isLoading: loadingAccesors,
    isSuccess: accesorsLoaded,
    isError: errorLodingAccesors,
    error: loadingAccesorError,
  } = useGetAccesorsListQuery();
  useEffect(() => {
    if (accesorslist != undefined) {
      const restructuredrecipients = accesorslist.map(({ id, organization_name }) => ({
        value: id,
        label: organization_name,
        name: organization_name,
      }));
      setExistingAccessors(restructuredrecipients);
    }
  }, [accesorslist]);

  const handleRemoveReprtUser = (index) => {
    const values = [...reportUsersFields];
    values.splice(index, 1);
    setReportUsersFields(values);
  };
  const handleRemoveAddedOrgRecipient = (index) => {
    const values = [...recipientUsernames];
    values.splice(index, 1);
    setRecipientUsernames(values);
  };

  const onSubmitPropertyValuation = async (data) => {
    console.log("stored");

    if (data.valuationDate === undefined) {
      data["valuationDate"] = new Date(valauationdetails?.valuationDate);
    }
    if (data.InstructionDate === undefined) {
      data["InstructionDate"] = new Date(valauationdetails?.InstructionDate);
    }
    console.log(data);

    //
    const valuation_year = data.valuationDate.getFullYear();
    const valuation_month = data.valuationDate.getMonth() + 1;
    const valuation_day = data.valuationDate.getDate();

    const instruction_year = data.InstructionDate.getFullYear();
    const instruction_month = data.InstructionDate.getMonth() + 1;
    const instruction_day = data.InstructionDate.getDate();

    //
    delete data.file;
    delete data.valuationDate;
    delete data.instructionDate;
    if (!("recipient" in data)) {
      data["recipient"] = valauationdetails.recipient;
    }
    data["valuationDate"] = valuation_month + "/" + valuation_day + "/" + valuation_year;
    data["InstructionDate"] = instruction_month + "/" + instruction_day + "/" + instruction_year;

    dispatch(setValuationDetails(data));
    dispatch(setReportRecipient(data.recipient));
    dispatch(setSelectedRecipient(data.recipient));
    if (existingAccessors.length > 0) {
      props.next();
    } else {
    }
    // console.log("submitted");
    // console.log(data);

    // console.log("stored after update");
    // console.log(valauationdetails);
  };
  const [valuationDT, setValuationDT] = useState("");
  const [instructionDT, setInstructionDT] = useState("");
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
  };
  const formatNumberWithCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const onNumberInputChange = (e, fieldlabel) => {
    // Remove commas from the user input and convert back to a number
    const rawValue = e.target.value.replace(/,/g, "");
    const numberValue = parseFloat(rawValue);
    // Format the number with commas
    const formattedValue = isNaN(numberValue) ? "" : formatNumberWithCommas(numberValue);
    // Set the formatted value in the form state using setValue
    setPropertValuationValues(fieldlabel, formattedValue, { shouldValidate: true });
  };
  const onRecipientChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <form onSubmit={handlePropertyValuationsSubmit(onSubmitPropertyValuation)}>
      <Row className="gy-3">
        <Col md="6">
          <div className="form-group">
            <label className="form-label" htmlFor="fw-token-address">
              Recipient
            </label>
            <div className="form-control-wrap">
              {(existingAccessors != undefined) > 0 && (
                <Controller
                  name="recipient"
                  control={control}
                  render={({ field }) => (
                    <Select
                      className="react-select-container "
                      classNamePrefix="react-select"
                      options={existingAccessors}
                      defaultValue={selectedrecipient != null ? selectedrecipient : ""}
                      {...field}
                      isMulti
                      placeholder="Select organization"
                    />
                  )}
                />
              )}
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
                <input
                  required
                  className="form-control"
                  type="file"
                  multiple
                  id="customMultipleFiles"
                  {...registerpropertyValuation("file", { required: true })}
                />
                {propertyValuationErrors.recipient && (
                  <span className="invalid">{propertyValuationErrors.file?.message}</span>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5 mb-5">
        <Col className="12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">
                  {" "}
                  <Button
                    className="btn-round btn-icon pull-right"
                    color="primary"
                    size="lg"
                    onClick={() => addReportUser()}
                  >
                    <Icon name="plus" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {reportUsersFields.length > 0 &&
                reportUsersFields.map((field, index) => {
                  if (field.formFieldName != undefined) {
                    return (
                      <tr key={index}>
                        <th scope="row">
                          <input
                            type="text"
                            className="form-control"
                            {...registerpropertyValuation(`${field.formFieldName}[${index}]`)}
                            autoComplete="off"
                            required
                            placeholder=""
                            defaultValue={`${field.formFildNameValue}`}
                          />
                        </th>
                        <td>
                          <input
                            type="email"
                            className="form-control"
                            {...registerpropertyValuation(`${field.fieldEmail}[${index}]`)}
                            autoComplete="off"
                            required
                            placeholder=""
                            defaultValue={`${field.fieldEmailValue}`}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            {...registerpropertyValuation(`${field.fieldPhoneNumber}[${index}]`)}
                            autoComplete="off"
                            required
                            placeholder=""
                            defaultValue={`${field.fieldPhoneNumberValue}`}
                          />
                        </td>
                        <td>
                          <Button
                            className="btn-round btn-icon"
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveReprtUser(index)}
                          >
                            <Icon name="cross" />
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="marketvalue">
              Market Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="marketvalue"
                className="form-control"
                {...registerpropertyValuation("marketValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
                onChange={(e) => onNumberInputChange(e, "marketValue")}
              />
              {propertyValuationErrors.marketValue && (
                <span className="invalid">{propertyValuationErrors.marketValue?.message}</span>
              )}
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="forced_sale-value">
              Forced Sale Value
            </label>
            <div className="form-control-wrap">
              <input
                type="text"
                id="forced_sale-value"
                className="form-control"
                {...registerpropertyValuation("forcedSaleValue", { required: true })}
                defaultValue={valauationdetails?.marketValue}
                onChange={(e) => onNumberInputChange(e, "forcedSaleValue")}
              />
              {propertyValuationErrors.forcedSaleValue && (
                <span className="invalid">{propertyValuationErrors.forcedSaleValue?.message}</span>
              )}
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
                onChange={(e) => onNumberInputChange(e, "insurenceValue")}
              />
              {propertyValuationErrors.insurenceValue && (
                <span className="invalid">{propertyValuationErrors.insurenceValue?.message}</span>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md="4">
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
                onChange={(e) => onNumberInputChange(e, "annualGRossRentalIncome")}
              />
              {propertyValuationErrors.annualGRossRentalIncome && (
                <span className="invalid">{propertyValuationErrors.annualGRossRentalIncome?.message}</span>
              )}
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Valuation Date
            </label>
            <div className="form-control-wrap">
              <Controller
                required
                control={control}
                name="valuationDate"
                render={({ field }) => (
                  <DatePicker
                    className="form-control date-picker"
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={
                      valauationdetails.valuationDate != undefined && field.value == null
                        ? new Date(valauationdetails.valuationDate)
                        : field.value
                    }
                  />
                )}
              />
              {propertyValuationErrors.valuationDate && (
                <span className="invalid">{propertyValuationErrors.valuationDate?.message}</span>
              )}
            </div>
            <div className="form-note">
              Date Format <code>yyyy</code>
            </div>
          </div>
        </Col>
        <Col md="4">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Instruction Date
            </label>
            <div className="form-control-wrap">
              <Controller
                required
                control={control}
                name="InstructionDate"
                render={({ field }) => (
                  <DatePicker
                    className="form-control date-picker"
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={
                      valauationdetails.InstructionDate != undefined && field.value == null
                        ? new Date(valauationdetails.InstructionDate)
                        : field.value
                    }
                  />
                )}
              />
              {propertyValuationErrors.InstructionDate && (
                <span className="invalid">{propertyValuationErrors.InstructionDate?.message}</span>
              )}
            </div>
            <div className="form-note">
              Date Format <code>yyyy</code>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="12">
          <div className="form-group">
            <label className="form-label" htmlFor="first-name">
              Property Description
            </label>
            <div className="form-control-wrap">
              <textarea
                className="form-control"
                {...registerpropertyValuation("PropertyDescription", { required: true })}
                defaultValue={valauationdetails?.PropertyDescription}
              ></textarea>
              {propertyValuationErrors.PropertyDescription && (
                <span className="invalid">{propertyValuationErrors.PropertyDescription?.message}</span>
              )}
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
  const dispatch = useDispatch();
  const {
    data: loadedusers,
    isFetching,
    isLoading,
    refetch: refetchUsers,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();
  console.log("loadedusers");

  console.log(loadedusers);
  const [existingUsers, setExistingUsers] = useState();
  useEffect(() => {
    if (loadedusers != undefined) {
      const restructuredrecipients = loadedusers.map(({ id, full_name, email }) => ({
        value: id,
        label: full_name,
        name: full_name,
        email: email,
      }));
      setExistingUsers(restructuredrecipients);
    }
  }, [loadedusers]);

  const reportignatories = useSelector(selectCurrentSignatories);
  console.log("reportignatories");
  console.log(reportignatories);
  const signeesvalidationschema = Yup.object().shape({});
  const {
    register: registerSignees,
    control,
    setValue: setSigneesValues,
    handleSubmit: handleSigneeSubmit,
    formState: { errors: signeeErrors, isValid: signeesAreValid },
  } = useForm({
    resolver: yupResolver(signeesvalidationschema),
  });
  useEffect(() => {
    if (signeesAreValid != null) {
    }
  }, [signeesAreValid]);
  const [signatories, setSignatories] = useState([]);
  const onSubmitSignee = async (data) => {
    if (data.signees != undefined) {
      dispatch(setReportSignatories(data));
      setSignatories(data.signees);
    }
    if (reportignatories != undefined) {
      if (Object.keys(reportignatories).length > 0) {
        props.next();
      } else {
        alert("Please select the signatories");
      }
    } else {
      alert("Please select the signatories");
    }
  };

  return (
    <>
      <p>Valuation signatures</p>
      <form onSubmit={handleSigneeSubmit(onSubmitSignee)}>
        <div className="form-group">
          <label className="form-label" htmlFor="fw-token-address">
            Recipient
          </label>
          <div className="form-control-wrap">
            {(existingUsers != undefined) > 0 && (
              <Controller
                name="signees"
                control={control}
                render={({ field }) => (
                  <Select
                    className="react-select-container "
                    classNamePrefix="react-select"
                    options={existingUsers}
                    defaultValue={reportignatories != null ? reportignatories : ""}
                    {...field}
                    isMulti
                    placeholder="Select organization"
                  />
                )}
              />
            )}
            {signeeErrors.recipient && <span className="invalid">{signeeErrors.signees?.message}</span>}
          </div>
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
        </div>
      </form>
    </>
  );
};
const ValuationSummary = (props) => {
  const locationDetails = useSelector(selectLocationDetails);
  const propertdetails = useSelector(selectPropertyDetails);
  const valauationdetails = useSelector(selectValuationDetails);
  const reportignatories = useSelector(selectCurrentSignatories);
  const recipientdetails = useSelector(selectCurrentRecipient);
  

  const [recipientUsernames, setRecipientUsernames] = useState([]);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [recipientPhone, setRecipientPhone] = useState([]);
  useEffect(() => {
    if (valauationdetails != null) {
      setRecipientUsernames(valauationdetails?.report_user_name);
      setRecipientEmails(valauationdetails?.report_user_email);
      setRecipientPhone(valauationdetails?.report_user_phone);
    }
  });

  return (
    <>
      <Block size="lg">
        <BlockHead>
          <BlockHeadContent>
            <BlockTitle tag="h5"></BlockTitle>
            <BlockDes>
              <p>These are the Details You are about to submit .</p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>
        <PreviewCard>
          <Row>
            <Col lg="6">
              <Card className="card-bordered card-full">
                <div className="card-inner-group">
                  <div className="card-inner card-inner-md">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">Location Details</h6>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Location Name</div>
                        <p>
                          {""}
                          {locationDetails?.locationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Row>
                    <Col className="6">
                      {" "}
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="cc-alt-fill"></Icon>
                            <div className="title">County</div>
                            <p>
                              {""}
                              {locationDetails?.county}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col className="6">
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="cc-alt-fill"></Icon>
                            <div className="title">Town</div>
                            <p>
                              {""}
                              {locationDetails?.town}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Street</div>
                        <p>
                          {""}
                          {locationDetails?.street}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Neighbourhood</div>
                        <p>
                          {""}
                          {locationDetails?.neighbourHood}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Mapped</div>
                        <p>{""}</p>
                        <p>{""}</p>
                        <p>{""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="card-bordered card-full">
                <div className="card-inner-group">
                  <div className="card-inner card-inner-md">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">Property Details</h6>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Property LR</div>
                        <p>
                          {""}
                          {propertdetails?.PropertyLR}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="help-fill"></Icon>
                        <div className="title">Property Type</div>
                        <p></p>
                        {propertdetails?.PropertyType[0].label}
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Total Built up Area</div>
                        <p></p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Land Size</div>
                        <p></p>
                        {propertdetails?.landSize}
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Tenure</div>
                        <p></p>
                        {propertdetails?.tenure}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg="6">
              <Card className="card-bordered card-full">
                <div className="card-inner-group">
                  <div className="card-inner card-inner-md">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">Valuation Details</h6>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Recipient</div>
                        <p>
                          {""}
                          {valauationdetails.recipient[0].label}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="help-fill"></Icon>
                        <div className="title">Recipients Within recipient Organization</div>
                        <div className="table-responsive">
                        <ul className="nk-activity">
                            {recipientUsernames.length > 0 &&
                              recipientUsernames.map((field, index) => {
                                return (
                                  <li className="nk-activity-item" key={index}>
                                    {/* <UserAvatar
                                      className="nk-activity-media"
                                      theme={recipientUsernames[index]}
                                      text={recipientUsernames[index]}
                                    ></UserAvatar> */}
                                    <div className="nk-activity-data">
                                      <div className="label">{recipientUsernames[index]}</div>
                                      <span className="time">{recipientEmails[index]}</span>
                                      <span className="time">{recipientPhone[index]}</span>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Row>
                    <Col className="6">
                      {" "}
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="wallet-fill"></Icon>
                            <div className="title">Market Value</div>
                            <p>
                              {""}
                              {valauationdetails?.marketValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col className="6">
                      {" "}
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="wallet-fill"></Icon>
                            <div className="title">FSV</div>
                            <p>
                              {""}
                              {valauationdetails?.forcedSaleValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <hr />

                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Insurence Value</div>
                        <p>
                          {""}
                          {valauationdetails?.insurenceValue}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Annual Gross Income</div>
                        <p>
                          {""}
                          {valauationdetails?.annualGRossRentalIncome}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Row>
                    <Col className="6">
                      {" "}
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="wallet-fill"></Icon>
                            <div className="title">Valuation Date</div>
                            <p>
                              {""}
                              {valauationdetails?.valuationDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col className="6">
                      <div className="card-inner">
                        <div className="nk-wg-action">
                          <div className="nk-wg-action-content">
                            <Icon name="wallet-fill"></Icon>
                            <div className="title">Instruction Date</div>
                            <p>
                              {""}
                              {valauationdetails?.InstructionDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="card-bordered card-full">
                <div className="card-inner-group">
                  <div className="card-inner card-inner-md">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">Signatories and Property Description</h6>
                      </CardTitle>
                    </div>
                  </div>
                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="cc-alt-fill"></Icon>
                        <div className="title">Signatories</div>
                        <div className="table-responsive">
                          <ul className="nk-activity">
                            {reportignatories.length > 0 &&
                              reportignatories.map((field, index) => {
                                return (
                                  <li className="nk-activity-item" key={index}>
                                    {/* <UserAvatar
                                      className="nk-activity-media"
                                      initial="SM"
                                      theme="primary"
                                      text={field.label}
                                    ></UserAvatar> */}
                                    <div className="nk-activity-data">
                                      <div className="label">{field.label}</div>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-inner">
                    <div className="nk-wg-action">
                      <div className="nk-wg-action-content">
                        <Icon name="wallet-fill"></Icon>
                        <div className="title">Property Description</div>
                        <p>
                          {""}
                          {valauationdetails?.PropertyDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </PreviewCard>
      </Block>
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
    </>
  );
};

const Header = (props) => {
  return (
    <div className="steps clearfix">
      <ul>
        <li className={props.current >= 1 ? "first done" : "first"}>
          <a href="#wizard-01-h-0" onClick={(ev) => ev.preventDefault()}>
            <span className="number"> Step 1</span>
            <h5>Property Location </h5>
          </a>
        </li>
        <li className={props.current >= 2 ? "done" : ""}>
          <a href="#wizard-01-h-1" onClick={(ev) => ev.preventDefault()}>
            <span className="number">Step 02</span> <h5>Property Details</h5>
          </a>
        </li>
        <li className={props.current >= 3 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">Step 03: </span>
            <span className="number">03</span> <h5>Valuation Data</h5>
          </a>
        </li>
        <li className={props.current >= 4 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">Step 04: </span>
            <span className="number">04</span> <h5>Signatories</h5>
          </a>
        </li>
        <li className={props.current >= 5 ? "done" : ""}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">Step 05: </span>
            <span className="number">05</span> <h5>Summary</h5>
          </a>
        </li>
        <li className={props.current === 6 ? "last done" : "last"}>
          <a href="#wizard-01-h-2" onClick={(ev) => ev.preventDefault()}>
            <span className="current-info audible">Step 06: </span>
            <span className="number">06</span> <h5>Successful</h5>
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
