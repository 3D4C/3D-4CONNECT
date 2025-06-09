import logging
from typing import Dict
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from src.entities import (
    SetupDataModel,
    GameResponseModel,
    GameEventModel,
    GameDataModel,
)
from src.gamelogic import Connect4
from src.helper import extract_game_response, flatten_gameboard, nest_gameboard

load_dotenv()

# Webserver
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory dictionary to store game data
# This will act as our "local database"
game_sessions: Dict[str, GameDataModel] = {}

# Logging
log_format = "\n%(asctime)s - %(filename)s - %(levelname)s: %(message)s\n"
logging.basicConfig(level=logging.INFO, format=log_format, datefmt="%H:%M:%S")
logger = logging.getLogger("global_logger")


def check_game_exists_local(session_id: str) -> bool:
    """Checks if a game session exists in the local dictionary."""
    return session_id in game_sessions


def update_game_local(game_data: GameDataModel):
    """Updates game data in the local dictionary."""
    session_id = game_data.sessionId
    game_sessions[session_id] = game_data


def load_game_local(session_id: str) -> GameDataModel:
    """Loads game data from the local dictionary."""
    if session_id not in game_sessions:
        raise Exception(f"Game with session ID '{session_id}' does not exist.")
    return game_sessions[session_id]


@app.post("/setupGame/")
async def setup_game(setup_data_dict: Dict) -> GameResponseModel:
    print(f"Setting up game")
    print(setup_data_dict)

    setup_data = SetupDataModel(**setup_data_dict)
    connect4 = Connect4()

    game_data = connect4.initialize_game_data(setup_data)
    update_game_local(game_data)  # Use local update function

    game_response = extract_game_response(game_data)
    return game_response


@app.post("/makeMove/")
async def make_move(game_event_dict: Dict) -> GameResponseModel:
    print(f"Making move")
    print(game_event_dict)

    game_event = GameEventModel(**game_event_dict)
    connect4 = Connect4()

    session_id = game_event.sessionId

    if not check_game_exists_local(session_id):  # Use local check function
        raise Exception("Game does not exist")

    game_data = load_game_local(session_id)  # Use local load function

    new_game_data = connect4.make_move(game_event, game_data)

    update_game_local(new_game_data)  # Use local update function

    game_response = extract_game_response(new_game_data)

    return game_response