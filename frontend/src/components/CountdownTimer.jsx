import { useEffect } from "react";

function CountdownTimer(props) {
  const timerValues = props.timerValues;
  const setGameEvent = props.setGameEvent;

  let remainingTime = 300000;

  // Called when mounted and when time changes
  useEffect(() => {
    if (timerValues) {
      remainingTime = timerValues[props.countdownId];

      const timerInterval = setInterval(() => {
        if (props.countdownId === timerValues.turn) {
          if (remainingTime <= 0) {
            console.log("Timed out");
            setGameEvent({
              category: "time",
            });
            clearInterval(timerInterval);
          }

          const totalSeconds = Math.floor(remainingTime / 1000);
          const leftMinutes = Math.floor(totalSeconds / 60);
          const leftSeconds = totalSeconds % 60;

          document.getElementById(props.countdownId).innerText = `${leftMinutes}:${
            leftSeconds < 10 ? `0${leftSeconds}` : leftSeconds
          }`;
          remainingTime -= 1000;
        }
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timerValues]);

  return (
    <div>
      <span id={props.countdownId}>5:00</span>
    </div>
  );
}

export default CountdownTimer;
