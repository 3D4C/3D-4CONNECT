import { React } from "react";

function Errors() {
  return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        <div className="row text-center">
          <h1>404 Error - Page not found!</h1>
        </div>

        <div className="row text-center">
          <div className="horizontal-line"></div>
        </div>

        <div className="row text-center">
          Oooops! We can't find you page. We apologize for the inconvenience. The subdomain you have attempted to access is currently not active. We
          recommend returning to the homepage and navigating to the desired content from there. If you continue to experience issues, please don't
          hesitate to contact our customer support team for further assistance. Thank you for your understanding.
        </div>

        <div className="row text-center">
          <div className="horizontal-line"></div>
        </div>
      </div>
    </div>
  );
}

export default Errors;
