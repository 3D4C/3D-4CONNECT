import React from "react";
import { Link, useLocation } from "react-router-dom";

import { getRank } from "../js/account";

function HeaderNav(
) {
  const location = useLocation().pathname;
  const accountClass = `nav-link fw-bold d-flex align-items-center ${location === "/account" ? " active" : ""}`;

  return (
    <header className="row m-0 px-3 custom-header">
      <div className="col-sm-7 m-0 d-flex justify-content-center justify-content-md-start align-items-center">
        <Link to="/home" className="nav-link fw-bold d-flex">
          <img src={require("../ressources/logos/preliminary_logo_white.png")} alt="logo" className="logo me-3" />
          <h3 className="my-auto unselectable-text">
            Connect 4{/* <span className="responsive-removal"> |</span> */}&nbsp;
            <br className="responsive-break" /> <span className="theme-text">3D Edition</span>
          </h3>
        </Link>
      </div>

      <div className="col-sm-5 m-0 d-flex justify-content-center justify-content-sm-end align-items-center">
        <Link to="/account" className={accountClass}>
          {true ? (
            <>
              <img
                className="header-rank"
                src={require(`../ressources/ranks/Guest.png`)}
                alt="rank"
              />
            </>
          ) : (
            <>
              <span className="my-auto me-3">Account</span>
            </>
          )}
        </Link>
      </div>
    </header>
  );
}

export default HeaderNav;
