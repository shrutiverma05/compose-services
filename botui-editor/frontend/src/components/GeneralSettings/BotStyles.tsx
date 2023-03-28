import React from "react";
import TDrawer from "../fragments/Header";
import AuthContext from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function BotStyles() {
  const { botProp, user } = useContext(AuthContext);
  const [attGraber, setattGraber] = useState<any>([]);
  const [attGraberCurveConfig, setattGraberCurveConfig] = useState<any>([]);
  const [attGraberMsgConfig, setattGraberMsgConfig] = useState<any>([]);
  const [privacyPolicy, setPP] = useState<any>([]);
  const [load, setLoad] = useState(false);
  const [link, setLink] = useState<any>();
  const [snackError, setSnackError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const pTags = "<p>&</p>";

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const initialValues = {
    showEnabled: attGraber.showEnabled,
    botAttentionGrabberType: attGraber.botAttentionGrabberType,
    title: attGraberCurveConfig.title,
    botPromptMsg: attGraberMsgConfig.botPromptMsg,
    privacyPolicyText: privacyPolicy.privacyPolicyText,
  };
  // FORM ON SUBMIT AND API
  const onSubmit = (values: any) => {
    setLoad(true);
    setLink("true");
    values.showEnabled === "true"
      ? (attGraber.showEnabled = true)
      : (attGraber.showEnabled = false);
    attGraber.botAttentionGrabberType = values.botAttentionGrabberType;
    attGraberCurveConfig.title = values.title;
    attGraberMsgConfig.botPromptMsg = values.botPromptMsg;
    privacyPolicy.privacyPolicyText = values.privacyPolicyText;

    botProp.generalSettings.attentionGrabber = attGraber;
    botProp.generalSettings.botAttentionGrabberCurveConfig =
      attGraberCurveConfig;
    botProp.generalSettings.botAttentionGrabberMsgBoxConfig =
      attGraberMsgConfig;
    botProp.generalSettings.privacyPolicy = privacyPolicy;

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/botProp`,
        {
          botProp: botProp,
          botCss: null,
        },
        {
          headers: { userid: user, link: link },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSnackError(false);
          setLoad(false);
          setOpen(true);
        } else {
          setSnackError(true);
          setLoad(false);
          setOpen(true);
        }
      })
      .catch((err) => {
        // console.log(err);
        setSnackError(true);
        setLoad(false);
        setOpen(true);
      });
  };
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });
  useEffect(() => {
    if (botProp) {
      setattGraber(botProp.generalSettings.attentionGrabber);
      setattGraberCurveConfig(
        botProp.generalSettings.botAttentionGrabberCurveConfig
      );
      setattGraberMsgConfig(
        botProp.generalSettings.botAttentionGrabberMsgBoxConfig
      );
      setPP(botProp.generalSettings.privacyPolicy);
    }
  }, [botProp]);
  // console.log(attGraber);
  return (
    <div>
      <TDrawer />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {snackError ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Something went wrong!!
          </Alert>
        ) : (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Successfully Updated!!
          </Alert>
        )}
      </Snackbar>
      <div className="row">
        <div className="col-lg-9">
          <div
            className="content d-flex flex-column flex-column-fluid"
            id="kt_content"
            style={{ marginTop: "5%" }}
          >
            <div className="container-fluid w-75">
              <div>
                <div className="card">
                  <div className="text-center mt-2">
                    <h1 className="card-title text-center mb-2">
                      <i>Attention Graber Setting</i>
                    </h1>
                  </div>
                  <div className="card-body">
                    <div className="container-fluid w-75">
                      <form
                        className="form mb-15"
                        onSubmit={formik.handleSubmit}
                      >
                        <div className="row mb-5">
                          <div className="col-lg-6 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Attention Graber Visible :
                            </label>
                            <br />
                            <select
                              name="showEnabled"
                              className="form-control form-control-solid"
                              value={formik.values.showEnabled}
                              onChange={formik.handleChange}
                            >
                              <option value="true">Visbible</option>
                              <option value="false">Not Visible</option>
                            </select>
                          </div>
                          {formik.values.showEnabled ? (
                            <div className="col-lg-6 fv-row">
                              <label className="required fs-5 fw-bold mb-2">
                                Attention Graber Type :
                              </label>
                              <br />
                              <select
                                name="botAttentionGrabberType"
                                className="form-control form-control-solid"
                                value={formik.values.botAttentionGrabberType}
                                onChange={formik.handleChange}
                              >
                                <option value="curve">Curve</option>
                                <option value="msgbox">Message Box</option>
                              </select>
                            </div>
                          ) : null}
                        </div>

                        <div className="row mb-5">
                          {formik.values.showEnabled ? (
                            formik.values.botAttentionGrabberType ===
                            "curve" ? (
                              <>
                                <div className="col-lg-6 fv-row">
                                  <label className="required fs-5 fw-bold mb-2">
                                    Curve Title :
                                  </label>
                                  <input
                                    className="form-control form-control-solid"
                                    placeholder=""
                                    name="title"
                                    type="text"
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="col-lg-6 fv-row">
                                <label className="required fs-5 fw-bold mb-2">
                                  Message Box Message :
                                </label>
                                <input
                                  className="form-control form-control-solid"
                                  placeholder=""
                                  name="botPromptMsg"
                                  type="text"
                                  onChange={formik.handleChange}
                                  value={formik.values.botPromptMsg}
                                />
                              </div>
                            )
                          ) : null}
                          <div className="col-lg-6 fv-row">
                            <label className="  fs-5 fw-bold mb-2">
                              Privacy Policy Text :
                            </label>
                            <small className="form-text text-muted">
                              Please don't do anything with {pTags}
                            </small>
                            <textarea
                              name=""
                              className="form-control form-control-solid"
                              rows={12}
                              cols={16}
                              onChange={formik.handleChange}
                              value={formik.values.privacyPolicyText}
                            ></textarea>
                          </div>
                        </div>
                        <div
                          className=" text-center "
                          style={{ marginTop: "2%" }}
                        >
                          <button
                            type="submit"
                            className="btn btn-primary w-50"
                            id="kt_careers_submit_button "
                          >
                            <span className="indicator-label">
                              {load ? "Submiting.." : "Submit"}
                            </span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
        <div className="col-lg-3">
          {load ? (
            <img src="./assets/images/Spinner-1s-200px.svg" alt="loader" />
          ) : (
            <iframe
              src={`${process.env.REACT_APP_API_URL}/static`}
              title="Bot Preview"
              width="100%"
              height="100%"
              className=""
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}

export default BotStyles;
