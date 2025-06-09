import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Howl } from "howler";

import Confetti from "./Confetti.jsx";
import { getRank, getProgress } from "../js/account.js";
import { makeDragable } from "../js/overlayresult.js";

import winnerSoundEffect from "../ressources/sounds/Mountain Audio - Winning Trumpet.mp3";

var winnerSound = new Howl({
  src: [winnerSoundEffect],
  // volume: 0.3,
}); // TODO: Use Sound-Effect

export default function OverlayResult(props) {
  const navigate = useNavigate();

  const [scoreAnimation, setScoreAnimation] = useState();
  const [overlaySettings, setOverlaySettings] = useState();
  const winner = props.gameResponse.winner;
  const localIdx = props.setupData.actorIds[0] === props.localId ? 0 : 1
  const localWon = winner == localIdx

  useEffect(() => {
    // Stop Turn Indicator Animations
    document.getElementById("p0-box").classList.remove("p0-turn");
    document.getElementById("p1-box").classList.remove("p1-turn");

    // Calculate a bunch of stuff to get the new score and deduce overlaySettings
    let result;
    let sValue;

    if (localWon) {
      result = "You won!";
      const prefix = props.gameResponse.gameAborted ? "Your opponent left the game.<br>" : ""
      result = prefix + result;
      sValue = 1;
    }
    else if (winner === null) {
      result = "It's a draw!";
      sValue = 0.5;
    }
    else {
      result = "You lost.";
      sValue = 0;
    }

    const isSingleplayer = props.setupData.gamemode === "singleplayer";

    const oldScore = props.setupData.actorScores[0];
    const currentProgress = getProgress(oldScore);
    const scoreOpponent = props.setupData.actorScores[1];
    const newScore = isSingleplayer
      ? oldScore
      : Math.round(oldScore + 60 * (sValue - oldScore / (oldScore + scoreOpponent)));
    const newProgress = getProgress(newScore);

    setScoreAnimation({
      currentProgress: currentProgress,
      newProgress: newProgress,
    });

    let earnedScore = newScore - oldScore;
    earnedScore = isSingleplayer
      ? earnedScore >= 0
        ? "You can't earn score in singleplayer"
        : "You can't loose score in singleplayer"
      : earnedScore >= 0
      ? "+" + earnedScore
      : earnedScore.toString();

    let earnedScoreColor = isSingleplayer ? "#666666" : earnedScore >= 0 ? "#428c6a" : "#810a0a";

    let progressColor = isSingleplayer ? "#777777" : earnedScore >= 0 ? "#264f3c" : "#a10a0a";

    setOverlaySettings({
      result: result,
      earnedScore: earnedScore,
      earnedScoreColor: earnedScoreColor,
      progressColor: progressColor,
    });

    console.log(scoreAnimation);
  }, []);

  // Animate rank progress,triggered by calculation of new score
  useEffect(() => {
    if (scoreAnimation && scoreAnimation.currentProgress != scoreAnimation.newProgress) {
      let operation = (x, y) => {
        return scoreAnimation.currentProgress < scoreAnimation.newProgress ? x + y : x - y;
      };

      setTimeout(() => {
        // console.log(scoreAnimation.currentProgress);
        setScoreAnimation((prev) => ({
          ...prev,
          // Die 0.02 bestimmt die Geschwindigkeit der Animation
          currentProgress: parseFloat(operation(prev.currentProgress, 0.02).toFixed(2)),
        }));
      }, 10);
    }

    if (scoreAnimation !== undefined) {
      // Make Pop-Up dragable
      makeDragable("overlay-finished");
    }
  }, [scoreAnimation]);

  return (
    <>
      {scoreAnimation === undefined ? null : (
        <>
          {localWon ? <Confetti /> : null}

          <button
            type="button"
            className="canvas-overlay overlay-button-restart"
            onClick={() => {
              props.setupData.gamemode === "multiplayer" ? navigate("/multiplayer") : navigate("/singleplayer");
            }}
          >
            <img
              className="overlay-button-icon"
              src={require("../ressources/icons/restart_icon.png")}
              alt="restart icon"
            />
          </button>

          <div id="overlay-finished">
            <div className="row m-0 px-3 py-2" id="overlay-finished-header">
              <div className="col-9 p-0">
                <span className="overlay-finished-title unselectable-text">Game Over</span>
              </div>
              <div className="col-3 p-0 x-col align-items-center justify-content-end">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("overlay-finished").style.visibility = "hidden";
                  }}
                ></button>
              </div>
            </div>
            <div className="row m-0 p-5 pb-2">
              <span className="overlay-finished-result unselectable-text">{overlaySettings.result} </span>
            </div>
            <div className="row m-0 p-3">
              <span
                className="overlay-finished-earnedScore unselectable-text"
                style={{ color: overlaySettings.earnedScoreColor }}
              >
                {overlaySettings.earnedScore}
              </span>
            </div>
            <div className="row m-0 p-3 px-5 justify-content-center rank-div">
              <div className="user-rank">
                <img
                  className="rank-image"
                  src={require(`../ressources/ranks/${getRank(props.setupData.actorScores[localIdx], props.setupData.actorNames[localIdx])}.png`)}
                  alt="rank"
                />

                <div
                  id="rank-progress"
                  style={{
                    height: scoreAnimation.currentProgress + "%",
                    backgroundColor: overlaySettings.progressColor,
                    // backgroundColor statt background-color, weil:
                    // In JavaScript, CSS property names with multiple words are written in camelCase rather than using hyphens.
                  }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
