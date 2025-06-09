import { React, useEffect } from "react";

import CountdownTimer from "./CountdownTimer";
import OverlayResult from "./OverlayResult";

import { getRank } from "../js/account";

export default function GameOverlay(props) {
  const setClippingBoxSize = (element, prefix) => {
    const height = element.offsetHeight;
    const width = element.offsetWidth;
    const adjustedWidth = width + 20;
    const adjustedHeight = height + 20;

    const doc = document.documentElement.style;
    doc.setProperty(`--rect-size-${prefix}-1`, `0px, ${adjustedWidth}px, 3px, 0px`);
    doc.setProperty(`--rect-size-${prefix}-2`, `0px, 3px, ${adjustedHeight}px, 0px`);
    doc.setProperty(`--rect-size-${prefix}-3`, `${adjustedHeight - 3}px, ${adjustedWidth}px, ${adjustedHeight}px, 0px`);
    doc.setProperty(`--rect-size-${prefix}-4`, `0px, ${adjustedWidth}px, ${adjustedHeight}px, ${adjustedWidth - 3}px`);
  };

  // Initial Setup
  useEffect(() => {
    setTimeout(async () => {
      // Get size of name boxes. Determined by name length.
      const overlayP0 = document.getElementById("p0-box");
      const overlayP1 = document.getElementById("p1-box");

      setClippingBoxSize(overlayP0, "p0");
      setClippingBoxSize(overlayP1, "p1");

      // Start turn-animation
      document.getElementById(`p0-box`).classList.add(`p0-turn`);
    }, 3000);
  }, []);

  // Safely accessing gameRunning and default to true if gameResponse is undefined
  const gameRunning = props.gameResponse?.gameRunning ?? true;

  return (
    <div className="fill-space justify-content-center align-items-center">
      {/* ==== Component showing the results when game is over ==== */}
      {gameRunning === false && (
        <OverlayResult
          firebase={props.firebase}
          setupData={props.setupData}
          gameResponse={props.gameResponse}
          localId={props.localId}
        />
      )}

      {/* ==== Player HUD ==== */}
      <div id="p0-box" className="canvas-overlay overlay-p0">
        {
          // Player Name & Score
          <>
            <img
              className="overlay-rank pe-3"
              src={require(`../ressources/ranks/${getRank(
                props.setupData.actorScores[0],
                props.setupData.actorNames[0]
              )}.png`)}
              alt="rank icon"
            />
            {props.setupData.actorNames[0]}
          </>
        }
      </div>
      {
        // Player Time
        props.setupData.gamemode === "multiplayer" ? (
          <div className="canvas-overlay overlay-p0 overlay-p0-timer">
            <CountdownTimer
              countdownId="playerTimer"
              timerValues={props.timerValues}
              setGameEvent={props.setGameEvent}
            />
          </div>
        ) : null
      }

      {/* ==== Opponent HUD ==== */}
      <div id="p1-box" className="canvas-overlay overlay-p1">
        {
          // Player Name & Score
          <>
            {props.setupData.actorNames[1]}
            <img
              className="overlay-rank ps-3"
              src={require(`../ressources/ranks/${getRank(
                props.setupData.actorScores[1],
                props.setupData.actorNames[1]
              )}.png`)}
              alt="rank icon"
            />
          </>
        }
      </div>
      {
        // Opponent Time
        props.setupData.gamemode === "multiplayer" ? (
          <div className="canvas-overlay overlay-p1 overlay-p1-timer">
            <CountdownTimer
              countdownId="opponentTimer"
              timerValues={props.timerValues}
              setGameEvent={props.setGameEvent}
            />
          </div>
        ) : null
      }
    </div>
  );
}
