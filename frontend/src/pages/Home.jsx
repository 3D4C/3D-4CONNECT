import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import infoIcon from "../ressources/icons/info_icon.png";


function Home() {
  let navigate = useNavigate();

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        <div className="row text-center">
          <h1 className="title-text">Connect 4 | 3D Edition</h1>
        </div>

        <div className="row text-center">
          <div className="horizontal-line"></div>
        </div>

        <div className="row text-center">
          This Web-App displays an innovative board game which adds a new dimension to the classic parlor game Connect
          4, allowing 64 pieces to be placed on the board instead of 16. This results in numerous new combination
          possibilities, which greatly increases the strategic depth of the game. As in the original 2D version, the
          first player to place 4 tokens in a row wins.
        </div>

        <div className="row text-center">
          <div className="horizontal-line"></div>
        </div>

        <div className="row text-center">
          <div className="col-md-12 text-center">
            <button
              className="btn mb-3"
              onClick={() => {
                navigate("/singleplayer");
              }}
            >
              Singleplayer
            </button>
          </div>
          {/* <div className="col-md-6 text-center">
            <button
              className="btn theme-background mb-3"
              onClick={() => {
                props.firebase.userData ? navigate("/multiplayer") : setShowInfo(true);
              }}
            >
              Multiplayer
            </button>
          </div> */}
        </div>
        {showInfo && (
          <div className="info-box d-flex align-items-center">
            <div className="col-2 d-flex justify-content-start">
              <img className="info-icon" src={infoIcon} alt="info icon" />
            </div>
            <div className="col-8 text-center">
              <div>You need to be logged in, in order to play online</div>
            </div>
            <div className="col-2 d-flex justify-content-end">
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowInfo(false);
                }}
              ></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
