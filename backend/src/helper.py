import time
import numpy as np

from copy import deepcopy
from typing import List, Tuple

from src.entities import GameResponseModel, MoveDataclass


def pydantic_to_string(pydantic_object):
    string = ""
    for key, value in pydantic_object.dict().items():
        if key == "gameboard":
            string += f"{key}: {gameboard_to_string(value)}\n"
        else:
            string += f"{key}: {value}\n"

    return string


def gameboard_to_string(gameboard):
    string = ""
    for row in gameboard:
        string += f"{row}\n"
    string = "[\n" + string + "]"
    return string


def find_possible_actions(gameboard: List[List[List[int]]]) -> List[Tuple[int, int]]:
    possible_moves = []
    for row in range(len(gameboard)):
        for col in range(len(gameboard)):
            for height in range(len(gameboard)):
                if gameboard[row][col][height] == 0:
                    possible_moves.append(
                        MoveDataclass(
                            x=row,
                            y=col,
                            z=height,
                        )
                    )
                    break
    return possible_moves


def get_canonical_board(board: List[List[List[int]]]) -> List[List[List[int]]]:
    np_board = list_to_numpy(board)
    canonical_boards = [
        np_board,
        np.rot90(np_board, k=1, axes=(0, 1)),
        np.rot90(np_board, k=2, axes=(0, 1)),
        np.rot90(np_board, k=3, axes=(0, 1)),
    ]
    canonical_np_board = min(canonical_boards, key=lambda x: x.tobytes())
    return numpy_to_list(canonical_np_board)


def get_canonical_move(move, original_board, canonical_board):
    np_original = list_to_numpy(original_board)
    np_canonical = list_to_numpy(canonical_board)
    for k in range(4):
        if np.array_equal(np.rot90(np_original, k, axes=(0, 1)), np_canonical):
            x, y = move.x, move.y
            for _ in range(k):
                x, y = 3 - y, x
            return MoveDataclass(x=x, y=y)
    raise ValueError("Canonical board not found")


def list_to_numpy(board: List[List[List[int]]]) -> np.ndarray:
    return np.array(board)


def numpy_to_list(board: np.ndarray) -> List[List[List[int]]]:
    return board.tolist()


def state_to_player(board: List[List[List[int]]]) -> int:
    # TODO: Redundant. Chose either state_to_playeror get_actor_digits
    _board = deepcopy(board)
    for row in _board:
        for col in row:
            for height in col:
                col[col.index(height)] = abs(height)

    return sum(sum(sum(row) for row in col) for col in _board) % 2


def colorize_text(text, color):
    colors = {
        "black": "\033[30m",
        "red": "\033[31m",
        "green": "\033[32m",
        "yellow": "\033[33m",
        "blue": "\033[34m",
        "magenta": "\033[35m",
        "cyan": "\033[36m",
        "white": "\033[37m",
        "dim_white": "\033[90m",
        "reset": "\033[0m",
    }

    if color not in colors:
        raise ValueError("Invalid color specified")

    colored_text = f"{colors[color]}{text}{colors['reset']}"
    return colored_text


def get_actor_digits(gameboard):
    # TODO: Redundant. Chose either state_to_playeror get_actor_digits
    gamboard_flat = [digit for row in gameboard for column in row for digit in column]
    delta = gamboard_flat.count(1) - gamboard_flat.count(-1)
    player_digit = 1 if delta == 0 else -1
    opponent_digit = -1 * player_digit
    return player_digit, opponent_digit


def get_digit_to_move(gameboard):
    gamboard_flat = [digit for row in gameboard for column in row for digit in column]
    count_p1 = gamboard_flat.count(1)
    count_m1 = gamboard_flat.count(-1)
    if count_p1 == count_m1:
        return 1
    elif count_p1 > count_m1:
        return -1


def time_execution(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took: {end - start} seconds")
        return result

    return wrapper


def flatten_gameboard(board):
    flattened = []
    for layer in board:
        for row in layer:
            for item in row:
                flattened.append(item)
    return flattened


def nest_gameboard(flattened_board):
    if len(flattened_board) != 64:
        raise ValueError("Flattened board must have exactly 64 elements")

    nested_board = []
    for i in range(4):
        layer = []
        for j in range(4):
            row = []
            for k in range(4):
                index = i * 16 + j * 4 + k
                row.append(flattened_board[index])
            layer.append(row)
        nested_board.append(layer)

    return nested_board


def extract_game_response(game_data) -> GameResponseModel:
    game_data_dict = game_data.dict()
    game_response = {
        key: val
        for key, val in game_data_dict.items()
        if key in GameResponseModel.model_fields.keys()
    }
    return GameResponseModel(**game_response)
