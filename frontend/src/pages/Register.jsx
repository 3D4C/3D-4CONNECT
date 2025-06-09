import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../js/account.js";

import infoIcon from "../ressources/icons/info_icon.png";

function Register(props) {
  let navigate = useNavigate();

  const [validationMessage, setValidationMessage] = useState("");

  // Navigate to account page when props.firebase.userDate changes
  useEffect(() => {
    if (props.firebase.userData != null) {
      navigate("/home");
    }
  }, [props.firebase.userData]);

  return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        <form
          autoComplete="off"
          onSubmit={async function (event) {
            event.preventDefault();
            setValidationMessage("");

            // Display loading symbol
            let spinner = document.getElementById("spinner");
            spinner.className = "spinner-border ms-auto";

            await signUp(props.firebase.auth, props.firebase.db).then((result) => {
              if (result) {
                setValidationMessage(result);
              }
            });
          }}
        >
          <div className="row text-center my-3">
            <h1>Sign Up</h1>
          </div>

          <div className="row text-center my-3">
            <input type="text" className="form-control" id="signUpUsername" placeholder="Username" required />
          </div>

          <div className="row text-center my-3">
            <input type="email" className="form-control :invalid" id="signUpMail" placeholder="Email" required />
          </div>

          <div className="row text-center my-3">
            <input type="password" className="form-control" id="signUpPassword" placeholder="Password" required />
          </div>

          <div className="row text-center my-3">
            <button className="btn theme-background" type="submit" id="btnSignIn">
              Sign Up
            </button>
          </div>

          {validationMessage && (
            <div className="info-box d-flex align-items-center">
              <div className="col-2 d-flex justify-content-start">
                <img className="info-icon" src={infoIcon} alt="info icon" />
              </div>
              <div className="col-8 text-center">
                <span>{validationMessage}</span>
              </div>
              <div className="col-2 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setValidationMessage("");
                  }}
                ></button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Register;
