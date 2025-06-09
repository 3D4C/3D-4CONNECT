from pydantic import BaseModel
from typing import List, Optional, Any
from dataclasses import dataclass, field


@dataclass
class CheckMoveDataclass:
    valid: bool
    reason: Optional[str] = None


@dataclass
class CheckRunningDataclass:
    running: bool
    winner: int


@dataclass
class MoveDataclass:
    x: int  # row
    y: int  # column
    z: Optional[int] = field(
        default=None
    )  # height, optional because it is infered from the gameboard at a later stage


class SetupDataModel(BaseModel):
    gamemode: str  # singleplayer, multiplayer
    actorIds: List[str]  # First entry is local player, second is opponent
    actorNames: List[str]
    actorScores: List[float]  # if computer is playing, the score is its strength
    sessionId: str


class GameEventModel(BaseModel):
    actorId: str
    coordinates: Optional[
        List[int]
    ]  # Optional is used whenever the field is needs to be None at some point
    sessionId: str


class GameResponseModel(BaseModel):
    turn: int
    gameRunning: bool
    gameAborted: (
        bool  # TODO: Currently not in use. Needs to be implemented for Multiplayer
    )
    winner: Optional[int]
    lastMove: Optional[
        List[int]
    ]  # 3 ints for x, y and z. Needs to be passed to get computer move.
    error: Optional[str]  # invalid move, wrong actor


class GameDataModel(SetupDataModel, GameResponseModel):
    # Has all the attributes of SetupDataModel and GameResponseModel
    gameboard: List[List[List[int]]]
    moves: List[Any]  # List of moves, each move is a list of 3 ints for x, y and z
