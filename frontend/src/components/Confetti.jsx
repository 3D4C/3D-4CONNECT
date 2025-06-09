import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";

export default function Confetti() {
  const [windowDimension, setWindowDimension] = useState({ width: document.body.clientWidth, height: document.body.clientHeight });

  function updateWidthAndHeight() {
    setWindowDimension({ width: document.body.clientWidth, height: document.body.clientHeight });
    console.log(`width: ${document.body.clientWidth}, height: ${document.body.clientHeight}`);
  }

  React.useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });

  return (
    <div>
      <ReactConfetti
        id="winner-confetti"
        className="confetti"
        width={windowDimension.width}
        height={windowDimension.height * 0.8}
        tweenDuration={10000}
      ></ReactConfetti>
    </div>
  );
}
