import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Bootloader() {
  let navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (loadingProgress < 100) {
      setTimeout(() => {
        setLoadingProgress((prev) => prev + 1);
      }, 25);
    }
  }, [loadingProgress]);

  // Navigate when loadingProgress has finished and all values are initialized
  if (loadingProgress === 100 ) {
    setTimeout(() => {
      navigate("/home");
    }, 500);
  }

  function numberToHex(number) {
    const hex = Math.floor((number / 100) * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  return (
    <div className="expander d-flex justify-content-center align-items-center cover-up">
      <div className="centered-box text-center">
        <h1 style={{ color: "#ffffff" + numberToHex(loadingProgress) }}>Connect 4 | 3D Edition</h1>
        <div className="progress mt-5">
          <div
            id="bootloader-progress"
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: loadingProgress + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Bootloader;
