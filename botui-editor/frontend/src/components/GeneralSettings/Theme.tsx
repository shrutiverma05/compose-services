import React from "react";
import TDrawer from "../fragments/Header";
import AuthContext from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { HexColorPicker } from "react-colorful";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Theme() {
  const { botCss, botProp, user } = useContext(AuthContext);
  const [primary, setPT] = useState<any>();
  const [secondary, setST] = useState<any>();
  const [teritiary, setTT] = useState<any>();
  const [userTextColor, setUTC] = useState<any>();
  const [botTextColor, setBTC] = useState<any>();
  const [snackError, setSnackError] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = useState(false);
  const [link, setLink] = useState<any>("true");
  const [link2, setLink2] = useState<any>("true");

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
    themePrimary: "",
    themeSecondary: "",
    themeTertiary: "",
    bubbleFromUserTextColor: "",
    bubbleTextColor: "",
  };
  console.log("/*button normal state*/\\r\\n --btn-brand-color");
  // FORM ON SUBMIT AND API
  const onSubmit = (values: any) => {
    setLink("true");
    setLink2("true");
    setLoad(true);
    botCss.children[":root"].attributes[
      "/*button normal state*/--btn-brand-color"
    ] = primary;
    botProp.theme.themePrimary = primary;
    botProp.theme.themeDarkAlt = primary;
    botProp.theme.themeSecondary = secondary;
    botProp.theme.themeTertiary = teritiary;
    botProp.styleOptions.bubbleFromUserTextColor = userTextColor;
    botProp.styleOptions.bubbleTextColor = botTextColor;
    botProp.styleOptions.bubbleBackground = primary;
    botProp.styleOptions.bubbleBorderColor = primary;
    botProp.styleOptions.sendBoxButtonColor = primary;
    botProp.styleOptions.suggestedActionBackgroundColor = primary;
    botProp.styleOptions.bubbleFromUserBackground = secondary;
    botProp.styleOptions.bubbleFromUserBorderColor = secondary;
    botProp.styleOptions.cardEmphasisBackgroundColor = primary;
    botProp.adaptiveCardsHostConfig.containerStyles.default.foregroundColors.default.default =
      primary;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/botProp`,
        {
          botProp: botProp,
          botCss: botCss,
        },
        {
          headers: { userid: user, link: link, link2: link2 },
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
        console.log(err);
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
      setPT(botProp.theme.themePrimary);
      setST(botProp.theme.themeSecondary);
      setTT(botProp.theme.themeTertiary);
      setUTC(botProp.styleOptions.bubbleFromUserTextColor);
      setBTC(botProp.styleOptions.bubbleTextColor);
    }
  }, [botProp]);
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
            <div className="container-fluid">
              <div>
                <div className="card">
                  <div className="text-center mt-2">
                    <h1 className="card-title text-center mb-2">
                      <i>Theme Settings</i>
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
                            <h3 className="text fs-5 fw-bold mb-2">
                              Primary theme
                            </h3>
                          </div>
                          <div className="col-lg-3 fv-row mb-5">
                            <HexColorPicker color={primary} onChange={setPT} />
                          </div>
                          <div className="col-lg-3 fv-row">
                            <h3 className="text fs-5 fw-bold mb-2">
                              User Message Text Color
                            </h3>
                          </div>
                          <div className="col-lg-3 fv-row">
                            <HexColorPicker
                              color={userTextColor}
                              onChange={setUTC}
                            />
                          </div>
                        </div>
                        <div className="row mb-5 mb-5">
                          <div className="col-lg-3 fv-row">
                            <h3 className="text fs-5 fw-bold mb-2">
                              Secondary theme
                            </h3>
                          </div>
                          <div className="col-lg-3 fv-row mb-5">
                            <HexColorPicker
                              color={secondary}
                              onChange={setST}
                            />
                          </div>
                          <div className="col-lg-3 fv-row">
                            <h3 className="text fs-5 fw-bold mb-2">
                              Bot Message Text Color
                            </h3>
                          </div>
                          <div className="col-lg-3 fv-row">
                            <HexColorPicker
                              color={botTextColor}
                              onChange={setBTC}
                            />
                          </div>
                        </div>
                        <div className="row mb-5">
                          <div className="col-lg-3 fv-row">
                            <h3 className="text fs-5 fw-bold mb-2">
                              Teritiary theme
                            </h3>
                          </div>
                          <div className="col-lg-9 fv-row mb-5">
                            <HexColorPicker
                              color={teritiary}
                              onChange={setTT}
                            />
                          </div>
                        </div>
                        <div className="row mb-5"></div>
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

export default Theme;
