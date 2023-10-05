import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import { useRequestUploaderAccessMutation } from "../api/auth/inviteValuerApiSlice";
import { Row, Col } from "reactstrap";
import { useState } from "react";


import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, Icon, PreviewCard } from "../components/Component";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";


const Signin = () => {
  const [backendValErrors, setBackendValErrors] = useState({});
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    full_names: yup.string().required("Directors name is required"),
    login_email: yup.string().required("Login Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
    directors_isk_numer: yup.string().required("Directors ISK number is required"),
    directors_vrb_numer: yup.string().required("Directors VRB number is required"),
    company_name: yup.string().required("Company Name is required"),
  });
  const {
    register: registerValuerRequestForm,
    isLoading: isSubmittingForm,
    reset: resetRequestForm,
    handleSubmit: handleSubmitRequestValuerAccess,
    formState: { errors: requestvalueraccesserrors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [requestValuerAccess, { isLOading: isSubmitting }] = useRequestUploaderAccessMutation();
  const sendRequestForm = async (data) => {
    const token = captchaRef.current.getValue();
    const formData = new FormData();
    formData.append("full_names", data.full_names);
    formData.append("company_name", data.company_name);
    formData.append("recaptcha_token", token);
    formData.append("login_email", data.login_email);
    formData.append("phone_number", data.phone_number);
    formData.append("directors_isk_numer", data.directors_isk_numer);
    formData.append("directors_vrb_numer", data.directors_vrb_numer);
    const result = await requestValuerAccess(formData);
    if ('error' in result) {
      if ('backendvalerrors' in result.error.data) {
        setBackendValErrors(result.error.data.backendvalerrors);
      }
    } else {
      resetRequestForm();
    }

  };

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4"> Set Your Account Password</BlockTitle>
            </BlockContent>
          </BlockHead>
        </div>
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Valuer Access Request</BlockTitle>
            </BlockContent>
          </BlockHead>

          <form onSubmit={handleSubmitRequestValuerAccess(sendRequestForm)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Director of Valuation Full Names
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerValuerRequestForm("full_names", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your Full Names"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.full_names?.message && (
                  <span className="invalid">{requestvalueraccesserrors.full_names?.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Account Login Email
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerValuerRequestForm("login_email", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.login_email?.message && (
                  <span className="invalid">{requestvalueraccesserrors.login_email?.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Company Name
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerValuerRequestForm("company_name", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your Company Name"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.company_name?.message && (
                  <span className="invalid">{requestvalueraccesserrors.company_name?.message}</span>
                )}
              </div>
            </div>


            <Row>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Directors VRB Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("directors_vrb_numer", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter Directors VRB number"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.directors_vrb_numer?.message && (
                      <span className="invalid">{requestvalueraccesserrors.directors_vrb_numer?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col>
                {" "}
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Directors ISK Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      {...registerValuerRequestForm("directors_isk_numer", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.directors_isk_numer?.message && (
                      <span className="invalid">{requestvalueraccesserrors.directors_isk_numer?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Contact Phone Number
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...registerValuerRequestForm("phone_number", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {requestvalueraccesserrors.phone_number?.message && (
                  <span className="invalid">{requestvalueraccesserrors.phone_number?.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              {" "}
              <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                Submit
              </Button>
            </div>
          </form>
          <div className="form-note-s2 text-center pt-1">
            <Link to="/request-accesor-access"> Request Accesosor Access</Link>
          </div>
          <div className="form-note-s2 text-center pt-3">Have an Account?</div>

          <div className="form-note-s2 text-center pt-4">
            <Link to="/login"> Login</Link>
          </div>
          <div className="text-center pt-1 pb-1">
            <h6 className="overline-title overline-title-sap">
              <span>OR</span>
            </h6>
          </div>

        </PreviewCard>

      </Block>
      <AuthFooter />
    </>
  );
};

export default Signin;
