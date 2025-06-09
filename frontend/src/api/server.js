const express = require("express");
const bodyParser = require("body-parser");
const { initializeGameboard, placeBall } = require("./path-to-your-gamelogic");

const app = express();
const port = 3001;

app.use(bodyParser.json());

let gameData = {
  // Initial game data
  gamemode: "simulation",
  gameboard: initializeGameboard(),
  gameStatus: "running",
  gameRunning: true,
  playerId: "Player",
  playerName: "Player",
  playerScore: 0,
  opponentId: "Computer",
  opponentName: "Checkmate Charlie",
  opponentScore: 9999,
  turn: "Player",
  player1Id: "Player",
  winner: null,
  moves: [],
  computerStrength: null,
};

app.post("/processMove", (req, res) => {
  const { gameEvent } = req.body;

  console.log("gameEvent");
  console.log(gameEvent)

  // Update game data based on the move
  placeBall(gameEvent.coordinates[0], gameEvent.coordinates[1], gameData);

  res.json(gameData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
