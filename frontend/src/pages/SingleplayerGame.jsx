import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { callMakeMove, callSetupGame } from "../api/calls";
import { SceneComponent, createBallMesh } from "../components/SceneComponent";

import GameOverlay from "../components/GameOverlay";

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders";

export default function SingleplayerGame(props) {
  // Fetch Singleplayer Settings
  const { state } = useLocation();
  const { firstTurn, strength, agent } = state;
  const secondTurn = firstTurn === 0 ? 1 : 0;
  const [sessionId] = useState(uuidv4()); // must be a state so it does not get reset on re-render

  const humanId = "player";
  const agentId = agent;
  const actorIds = [humanId, agentId];

  const humanName = "Player";
  const agentName = "Agent";
  const actorNames = [humanName, agentName];

  const humanScore =  0;
  const agentScore = strength / 100;
  const actorScores = [humanScore, agentScore];

  const setupData = {
    gamemode: "singleplayer",
    actorIds: [actorIds[firstTurn], actorIds[secondTurn]],
    actorNames: [actorNames[firstTurn], actorNames[secondTurn]],
    actorScores: [actorScores[firstTurn], actorScores[secondTurn]],
    sessionId: sessionId,
  };

  const [scene, setScene] = useState(null);
  const [gameEvent, setGameEvent] = useState(null);
  const [gameResponse, setGameResponse] = useState(null);

  // On Mount: Send Basic Setup to Backend
  useEffect(() => {
    const SetupGame = async () => {
      const response = await callSetupGame(setupData);
      setGameResponse(response);
    };
    SetupGame();
  }, []);

  // On Move: Main Logic
  useEffect(() => {
    if (gameEvent === null) return;

    const startMoveSequence = async () => {
      const response = await callMakeMove(gameEvent);
      setGameResponse((prevState) => response);
    }; //functional state update to avoid batched updates (i.e. otherwise a gameReponse with lastMove == null might override a valid gameResponse)

    startMoveSequence();
  }, [gameEvent]);

  useEffect(() => {
    if (gameResponse === null) return;
    if (gameResponse.lastMove === null) return;
    if (gameResponse?.error !== null) return;

    const turn = gameResponse.turn === 1 ? 0 : 1;
    const next_turn = gameResponse.turn;

    createBallMesh(gameResponse.lastMove, turn, scene);

    // Update Turn indicator
    document.getElementById(`p${turn}-box`).classList.remove(`p${turn}-turn`);
    document.getElementById(`p${next_turn}-box`).classList.add(`p${next_turn}-turn`);
  }, [gameResponse]);

  useEffect(() => {
    if (gameResponse === null || !gameResponse?.gameRunning || gameResponse?.error !== null) return;

    const isAgentTurn = (gameResponse.turn === 1 && firstTurn === 0) || (gameResponse.turn === 0 && firstTurn === 1);
    if (isAgentTurn) {
      // const delay = 1000 + Math.random() * 1500;

      // setTimeout(() => {
      setGameEvent({
        actorId: agentId,
        coordinates: null,
        sessionId: sessionId,
      });
      // }, delay);
    }
  }, [gameResponse]);

  return (
    <div className="expander-game d-flex justify-content-center align-items-center">
      <SceneComponent setGameEvent={setGameEvent} setScene={setScene} localId={humanId} sessionId={sessionId} />
      <GameOverlay firebase={props.firebase} setupData={setupData} gameResponse={gameResponse} localId={humanId} />
    </div>
  );
}
