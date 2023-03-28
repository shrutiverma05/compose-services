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

function GeneralSettings() {
  const { botProp, user } = useContext(AuthContext);
  const [ui, setUI] = useState<any>([]);
  const [isLink, setLink] = useState<any>("true");
  const [link, setLink2] = useState<any>("true");
  const [error, setError] = useState(false);
  const [snackError, setSnackError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = useState(false);
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
    botName: ui.botName,
    botWelcome: ui.botWelcome,
    botWidth: ui.botWidth,
    botIconType: "link",
    msgIconType: "link",
    msgIcon: ui.botMsgIcon,
    botIcon: ui.botIcon,
    botHeight: ui.botHeight,
    botPlacement: ui.botPlacement,
    botSubHeader: ui.botSubHeader,
    autoPopUp: ui.autoPopUp,
    closeButtonPlacement: ui.closeButtonPlacement,
    viewStyle: ui.viewStyle,
    loadingSpinnerEnabled: ui.loadingSpinnerEnabled,
    file: null,
    file2: null,
  };
  function getBase64(inputMessage: any, name: any) {
    var reader = new FileReader();
    reader.readAsDataURL(inputMessage);
    reader.onload = function () {
      // console.log(reader.result);
      const finalData = reader.result;
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/image`,
          {
            base64: finalData,
            name: name,
          },
          {
            headers: { userid: user },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setError(false);
            setSnackError(false);
          } else {
            setError(true);
            setSnackError(true);
            setOpen(true);
          }
        })
        .catch((err) => console.log(err));
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  // FORM ON SUBMIT AND API
  const onSubmit = (values: any) => {
    setLoad(true);
    ui.botName = values.botName;
    ui.botWelcome = values.botWelcome;
    ui.botWidth = values.botWidth;
    ui.botHeight = values.botHeight;
    ui.botPlacement = values.botPlacement;
    values.autoPopUp === "true"
      ? (ui.autoPopUp = true)
      : (ui.autoPopUp = false);
    ui.closeButtonPlacement = values.closeButtonPlacement;
    values.loadingSpinnerEnabled === "true"
      ? (ui.loadingSpinnerEnabled = true)
      : (ui.loadingSpinnerEnabled = false);
    ui.botSubHeader = values.botSubHeader;

    botProp.generalSettings.ui = ui;
    if (values.file) {
      getBase64(values.file, "botIcon");
      ui.botIcon = "boticon.png";
      setLink("false");
    }
    if (values.file2) {
      getBase64(values.file2, "msgicon");
      ui.botMsgIcon = "msgicon.png";
      setLink2("false");
    }
    console.log(isLink);
    console.log(link);
    if (!error) {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/botProp`,
          {
            botProp: botProp,
            botCss: null,
          },
          {
            headers: { userid: user, link: isLink, link2: link },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setSnackError(false);
            setOpen(true);
            setLoad(false);
          } else {
            setSnackError(true);
            setOpen(true);
            setLoad(false);
          }
        })
        .catch((err) => {
          setLoad(false);
          // console.log(err);
          setSnackError(true);
          setOpen(true);
        });
    } else {
    }
  };
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });
  useEffect(() => {
    if (botProp) {
      setUI(botProp.generalSettings.ui);
    }
  }, [botProp]);
  return (
    <div>
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
      <TDrawer />
      <div className="row">
        <div className="col-lg-9">
          <div
            className="content d-flex flex-column flex-column-fluid"
            id="kt_content"
            style={{ marginTop: "2%" }}
          >
            <div className="container-fluid w-75">
              <div>
                <div className="card">
                  <div className="text-center mt-2">
                    <h1 className="card-title text-center mb-2">
                      <i>UI General Setting</i>
                    </h1>
                  </div>
                  <div className="card-body">
                    <div className="container-fluid w-75">
                      <form
                        className="form mb-15"
                        onSubmit={formik.handleSubmit}
                      >
                        <div className="row mb-5">
                          <div className="col-lg-3 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Bot Name :
                            </label>
                            <input
                              className="form-control form-control-solid"
                              placeholder=""
                              name="botName"
                              type="text"
                              onChange={formik.handleChange}
                              value={formik.values.botName}
                            />
                          </div>
                          <div className="col-lg-9 fv-row">
                            <label className="  fs-5 fw-bold mb-2">
                              Bot Welcome Message :
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-solid"
                              placeholder=""
                              name="botWelcome"
                              onChange={formik.handleChange}
                              value={formik.values.botWelcome}
                            />
                          </div>
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-3 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Bot Height :
                            </label>
                            <input
                              className="form-control form-control-solid"
                              placeholder=""
                              name="botHeight"
                              type="text"
                              onChange={formik.handleChange}
                              value={formik.values.botHeight}
                            />
                          </div>

                          <div className="col-lg-3 fv-row">
                            <label className="  fs-5 fw-bold mb-2">
                              Bot Width :
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-solid"
                              placeholder=""
                              name="botWidth"
                              onChange={formik.handleChange}
                              value={formik.values.botWidth}
                            />
                          </div>
                          <div className="col-lg-3 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Bot Placement :
                            </label>
                            <br />
                            <select
                              name="botPlacement"
                              className="form-control form-control-solid"
                              value={formik.values.botPlacement}
                              onChange={formik.handleChange}
                            >
                              <option value="">Select</option>
                              <option value="bottom-right">Bottom Right</option>
                              <option value="bottom-left">Bottom Left</option>
                              <option value="top-left">Top Left</option>
                              <option value="top-right">Top Right</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-6 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Bot Icon Type :
                            </label>
                            <br />
                            <select
                              name="botIconType"
                              className="form-control form-control-solid"
                              value={formik.values.botIconType}
                              onChange={formik.handleChange}
                            >
                              <option value="link">Link</option>
                              <option value="file">FILE</option>
                            </select>
                          </div>
                          {formik.values.botIconType === "link" ? (
                            <div className="col-lg-6 fv-row">
                              <label className="required fs-5 fw-bold mb-2">
                                Bot icon :
                              </label>
                              <input
                                className="form-control form-control-solid"
                                name="botIcon"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.botIcon}
                              />
                            </div>
                          ) : (
                            <div className="col-lg-6 fv-row">
                              <label className="required fs-5 fw-bold mb-2">
                                Bot icon :
                              </label>
                              <input
                                className="form-control form-control-solid"
                                placeholder=""
                                name="file"
                                type="file"
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "file",
                                    e.currentTarget.files
                                      ? e.currentTarget.files[0]
                                      : null
                                  );
                                }}
                                accept="image/png, image/jpeg,image/svg,image/giff"
                              />
                            </div>
                          )}
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-6 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Message Icon Type :
                            </label>
                            <br />
                            <select
                              name="msgIconType"
                              className="form-control form-control-solid"
                              value={formik.values.msgIconType}
                              onChange={formik.handleChange}
                            >
                              <option value="link">Link</option>
                              <option value="file">FILE</option>
                            </select>
                          </div>
                          {formik.values.msgIconType === "link" ? (
                            <div className="col-lg-6 fv-row">
                              <label className="required fs-5 fw-bold mb-2">
                                Message icon :
                              </label>
                              <input
                                className="form-control form-control-solid"
                                name="msgIcon"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.msgIcon}
                              />
                            </div>
                          ) : (
                            <div className="col-lg-6 fv-row">
                              <label className="required fs-5 fw-bold mb-2">
                                Message icon :
                              </label>
                              <input
                                className="form-control form-control-solid"
                                placeholder=""
                                name="file2"
                                type="file"
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    "file2",
                                    e.currentTarget.files
                                      ? e.currentTarget.files[0]
                                      : null
                                  );
                                }}
                                accept="image/png, image/jpeg,image/svg,image/giff"
                              />
                            </div>
                          )}
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-4 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Bot Sub Header :
                            </label>
                            <br />
                            <select
                              name="botSubHeader"
                              className="form-control form-control-solid"
                              value={formik.values.botSubHeader}
                              onChange={formik.handleChange}
                            >
                              <option value="block">Block</option>
                              <option value="none">None</option>
                            </select>
                          </div>
                          <div className="col-lg-4 fv-row">
                            <label className="  fs-5 fw-bold mb-2">
                              View Style :
                            </label>
                            <br />
                            <select
                              name="viewStyle"
                              className="form-control form-control-solid"
                              value={formik.values.viewStyle}
                              onChange={formik.handleChange}
                            >
                              <option value="desktop">Desktop</option>
                              <option value="mobile">Mobile</option>
                            </select>
                          </div>
                          <div className="col-lg-4 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Close Button Placement :
                            </label>
                            <br />
                            <select
                              name="closeButtonPlacement"
                              className="form-control form-control-solid"
                              value={formik.values.closeButtonPlacement}
                              onChange={formik.handleChange}
                            >
                              <option value="default">
                                Outside Header (default)
                              </option>
                              <option value="inHeader">In Header</option>
                            </select>
                          </div>
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-4 fv-row">
                            <label className="required fs-5 fw-bold mb-2">
                              Auto Pop Up:
                            </label>
                            <br />
                            <select
                              name="autoPopUp"
                              className="form-control form-control-solid"
                              onChange={formik.handleChange}
                              value={formik.values.autoPopUp}
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                          <div className="col-lg-4 fv-row">
                            <label className="  fs-5 fw-bold mb-2">
                              Loading Spinner Widget:
                            </label>
                            <br />
                            <select
                              name="loadingSpinnerEnabled"
                              className="form-control form-control-solid"
                              onChange={formik.handleChange}
                              value={formik.values.loadingSpinnerEnabled}
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
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

export default GeneralSettings;
