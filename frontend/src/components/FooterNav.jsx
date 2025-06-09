import React from "react";

function FooterNav() {
  return (
    <footer className="flex-md-row d-flex align-items-center justify-content-center custom-footer">
      <div className="col-md-4 legend">
        {/* ↓ or s: south &nbsp;&nbsp;&nbsp; ← or a: west
        <br />
        ↑ or w: north &nbsp;&nbsp;&nbsp; → or d: east
        <br /> */}
      </div>
      <div className="col-md-4 credits d-flex justify-content-center align-items-center unselectable-text">
        <span>Developed by Eric, David, Lasse and Benedikt</span>
      </div>

      <div className="col-md-4 spinner d-flex align-items-center justify-content-end">
        <div id="spinner" className="spinner-border ms-auto hide" role="status" aria-hidden="true"></div>
      </div>
    </footer>
  );
}

export default FooterNav;
