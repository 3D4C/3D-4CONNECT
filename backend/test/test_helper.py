import unittest

from src.helper import state_to_player, flatten_gameboard, nest_gameboard


class TestStateToPlayer(unittest.TestCase):
    def test_state_to_player(self):
        # 0x 1s, 0x -1s --> Player 1's turn
        board = [
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        ]
        self.assertEqual(state_to_player(board), 0, "It should be Player 1's turn")

        # 1x 1s, 0x -1s --> Player 2's turn
        board = [
            [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        ]
        self.assertEqual(state_to_player(board), 1, "It should be Player 2's turn")

        # 1x 1s, 1x -1s --> Player 1's turn
        board = [
            [[1, -1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        ]
        self.assertEqual(state_to_player(board), 0, "It should be Player 1's turn")

        # 9x 1s, 1x -1s --> Player 1's turn
        board = [
            [[1, 1, 1, 1], [-1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        ]
        self.assertEqual(state_to_player(board), 0, "It should be Player 1's turn")

        # 10x 1s, 1x -1s --> Player 2's turn
        board = [
            [[1, 1, 1, 1], [-1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 0]],
        ]
        self.assertEqual(state_to_player(board), 1, "It should be Player 2's turn")


class TestGameboardTransformations(unittest.TestCase):
    def test_end_to_end(self):
        gameboard = [
            [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]],
            [[16, 17, 18, 19], [20, 21, 22, 23], [24, 25, 26, 27], [28, 29, 30, 31]],
            [[32, 33, 34, 35], [36, 37, 38, 39], [40, 41, 42, 43], [44, 45, 46, 47]],
            [[48, 49, 50, 51], [52, 53, 54, 55], [56, 57, 58, 59], [60, 61, 62, 63]],
        ]
        gameboard_flat = flatten_gameboard(gameboard)
        gameboard_nested = nest_gameboard(gameboard_flat)

        self.assertEqual(gameboard_nested, gameboard, "It should be the same gameboard")


if __name__ == "__main__":
    unittest.main()
