import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

function Singleplayer() {
  const navigate = useNavigate();

  const [strengthVal, setStrengthVal] = useState(50);
  const [firstTurn, setFirstTurn] = useState(0);
  const [agent, setAgent] = useState("mcts");

    return (
    <div className="expander d-flex justify-content-center align-items-center">
      <div className="centered-box">
        <div className="row text-center my-3">
          <h4>Computer Strength</h4>
        </div>
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className="row switch my-3">
            <div
              id="easy-switch"
              className="col switch-button text-center active"
              onClick={() => {
                setStrengthVal(10);
                document.getElementById("easy-switch").className = "col switch-button text-center active";
                document.getElementById("advanced-switch").className = "col switch-button text-center";
                document.getElementById("impossible-switch").className = "col switch-button text-center";
              }}
            >
              <strong>Easy</strong>
            </div>
            <div
              id="advanced-switch"
              className="col switch-button text-center"
              onClick={() => {
                setStrengthVal(50)
                document.getElementById("easy-switch").className = "col switch-button text-center";
                document.getElementById("advanced-switch").className = "col switch-button text-center active";
                document.getElementById("impossible-switch").className = "col switch-button text-center";
              }}
            >
              <strong>Advanced</strong>
            </div>
            <div
              id="impossible-switch"
              className="col switch-button text-center"
              onClick={() => {
                setStrengthVal(100);
                document.getElementById("easy-switch").className = "col switch-button text-center";
                document.getElementById("advanced-switch").className = "col switch-button text-center";
                document.getElementById("impossible-switch").className = "col switch-button text-center active";
              }}
            >
              <strong>Impossible</strong>
            </div>
          </div>
        </div>

        <div className="row text-center pt-4">
          <h4>First Move</h4>
        </div>
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className="row switch my-3">
            <div
              id="left-switch"
              className="col switch-button text-center active"
              onClick={() => {
                setFirstTurn(0);
                document.getElementById("right-switch").className = "col switch-button text-center";
                document.getElementById("left-switch").className = "col switch-button text-center active";
              }}
            >
              <strong>Player</strong>
            </div>
            <div
              id="right-switch"
              className="col switch-button text-center"
              onClick={() => {
                setFirstTurn(1);
                document.getElementById("right-switch").className = "col switch-button text-center active";
                document.getElementById("left-switch").className = "col switch-button text-center";
              }}
            >
              <strong>Agent</strong>
            </div>
          </div>
        </div>
        <div className="row text-center my-3">
          <button
            type="button"
            className="btn theme-background mt-3"
            onClick={() => {
              setAgent("mcts");
              navigate("/singleplayerGame", { state: { firstTurn: firstTurn, strength: strengthVal, agent: agent } });
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default Singleplayer;
