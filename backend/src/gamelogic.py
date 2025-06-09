import logging
from typing import List, Tuple

from src.agency import Agency
from src.helper import extract_game_response
from src.winchecker import WinChecker
from src.entities import (
    GameDataModel,
    GameEventModel,
    SetupDataModel,
    GameResponseModel,
    CheckMoveDataclass,
    CheckRunningDataclass,
    MoveDataclass,
)


logger = logging.getLogger("global_logger")


class Connect4:
    def __init__(self) -> None:
        self.win_checker = WinChecker()

    def make_move(
        self, game_event: GameEventModel, game_data: GameDataModel
    ) -> GameResponseModel:
        actor_id, coordinates = game_event.actorId, game_event.coordinates

        turn = game_data.turn
        gameboard = game_data.gameboard
        moves = game_data.moves
        id_to_move = game_data.actorIds[turn]
        actor_digit = 1 if turn == 0 else -1
        game_running = game_data.gameRunning

        agents = Agency().select(
            actor_ids=game_data.actorIds,
            actor_scores=game_data.actorScores,
        )

        if actor_id != id_to_move:
            logger.warning(
                f"Out of turn! {actor_id} made a move but it is {id_to_move}'s turn"
            )
            game_data.error = "wrong actor"
            return game_data

        # Get computer move, else make player move a MoveDataclass instance
        if coordinates is None:
            agent = agents[turn]
            move = agent.predict_move(gameboard)
        else:
            move = MoveDataclass(coordinates[0], coordinates[1])

        move.z = sum(1 for value in gameboard[move.x][move.y] if value != 0)

        # Check if move is valid
        validation: CheckMoveDataclass = self._check_move(move, game_running)
        if not validation.valid:
            game_data.error = "invalid move"
            logger.warning("Invalid Move, " + validation.reason)
            print("move :", move.x, move.y, move.z)
            print("gameboard :", gameboard)
            return game_data

        # Update game data attributes
        game_data.gameboard[move.x][move.y][move.z] = actor_digit
        game_data.moves.append([move.x, move.y, move.z])

        running_check = self._check_running(gameboard, moves, actor_digit, turn)

        game_data.turn = 0 if turn == 1 else 1
        game_data.gameRunning = running_check.running
        game_data.gameAborted = False  # TODO: Implement for multiplayer
        game_data.winner = running_check.winner
        game_data.lastMove = [move.x, move.y, move.z]
        game_data.error = None

        logger.info(f"{id_to_move}: {game_data.lastMove}")
        return game_data

    def initialize_game_data(self, setup_data) -> GameDataModel:
        game_data = GameDataModel(
            **setup_data.dict(),
            gameboard=self._initialize_gameboard(),
            moves=[],
            turn=0,
            gameRunning=True,
            gameAborted=False,
            winner=None,
            lastMove=None,
            error=None,
        )

        # TODO: Make better
        self.agents = Agency().select(
            actor_ids=game_data.actorIds,
            actor_scores=game_data.actorScores,
        )

        return game_data

    def _initialize_gameboard(self) -> List[List[List[int]]]:
        gameboard = [[[0 for _ in range(4)] for _ in range(4)] for _ in range(4)]
        return gameboard

    def _check_move(self, move: MoveDataclass, game_running) -> CheckMoveDataclass:
        if not game_running:
            return CheckMoveDataclass(False, "Game is already over")

        if move.z > 3:
            return CheckMoveDataclass(False, "Pole already full")

        return CheckMoveDataclass(True)

    def _check_running(
        self, gameboard, moves, actor_digit, turn
    ) -> CheckRunningDataclass:

        if self.win_checker.check_win(gameboard, actor_digit):
            running = False
            winner = turn
        elif len(moves) == 64:
            running = False
            winner = None
        else:
            running = True
            winner = None

        return CheckRunningDataclass(running=running, winner=winner)


class Environment:
    def __init__(self, setup_data):
        self.connect4 = Connect4()
        self.game_data = self.connect4.initialize_game_data(setup_data)
        self.agents = self.connect4.agents

        # self.rewards = {
        #     "valid": -0.1,
        #     "invalid": -5,
        #     "draw": -3.2,
        #     "win": 1.6,
        #     "loose": -1.6,
        # } # must all be different values for qlearning loop to detect reason for termination

        self.rewards = {
            "valid": 0,
            "invalid": 0,
            "draw": 0,
            "win": 1,
            "loose": -1,
        }

        # self.rewards = {
        #     "valid": 0,
        #     "invalid": -1,
        #     "draw": 0,
        #     "win": 0,
        #     "loose": 0,
        # }

    # @property
    # def state(self) -> List[List[List[int]]]:
    #     return self.connect4.game_data.gameboard

    def step(self, game_event: GameEventModel) -> Tuple[GameDataModel, float, bool]:
        self.game_data = self.connect4.make_move(game_event, self.game_data)
        game_response = extract_game_response(self.game_data)
        state = self.game_data.gameboard

        if game_response.lastMove is None:  # Invalid move
            return state, self.rewards["invalid"], True, game_response

        # One can not loose when making a move
        if not game_response.gameRunning:
            if game_response.winner is None:  # Draw
                return state, self.rewards["draw"], True, game_response
            else:  # Win
                return state, self.rewards["win"], True, game_response

        return (
            state,
            self.rewards["valid"],
            False,
            game_response,
        )

    def reset(self, setup_data: SetupDataModel) -> List[List[List[int]]]:
        self.game_data = self.connect4.initialize_game_data(setup_data)
        game_response = extract_game_response(self.game_data)
        state = self.game_data.gameboard

        return state, 0, False, game_response
