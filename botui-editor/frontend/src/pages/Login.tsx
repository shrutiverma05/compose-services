import React from "react";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function Login() {
  let { loginUser, loading, error } = useContext(AuthContext);
  const [load, setLoad] = useState(false);
  const [err, setError] = useState(false);
  useEffect(() => {
    setLoad(loading);
    setError(error);
  }, [loading, error]);

  return (
    <>
      <div className="container w-100" style={{ marginTop: "10%" }}>
        <div className="card">
          <div className="text-center mt-5">
            <h1 className="card-title text-center mb-2">
              <i>Nova Connect</i>
            </h1>
            {err ? (
              <h4 className="text text-danger">Invalid Credentials!!!</h4>
            ) : null}
          </div>
          <div className="card-body">
            <div className="container w-75">
              <form
                className="form w-85"
                id="kt_sign_in_form"
                onSubmit={loginUser}
              >
                <div className="fv-row mb-10">
                  <label className="form-label fs-6 fw-bolder text-dark">
                    <h5 className="text">User ID</h5>
                  </label>
                  <input
                    className="form-control form-control-lg form-control-solid"
                    type="text"
                    name="userEmail"
                  />
                </div>
                <div className="fv-row mb-10" style={{ marginTop: "2%" }}>
                  <div className="d-flex flex-stack mb-2">
                    <label className="form-label fw-bolder text-dark fs-6 mb-0">
                      <h5 className="text">Password</h5>
                    </label>
                  </div>
                  <input
                    className="form-control form-control-lg form-control-solid"
                    type="password"
                    name="userPassword"
                  />
                </div>
                <div className="text-center" style={{ marginTop: "5%" }}>
                  <button
                    className="btn btn-lg btn-primary w-50 mb-5"
                    type="submit"
                  >
                    {load ? (
                      <span className="indicator-label">Verifying...</span>
                    ) : (
                      <span className="indicator-label">Sign In</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
