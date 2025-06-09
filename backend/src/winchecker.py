from typing import List


class WinChecker:
    def check_win(self, grid: List[List[List[int]]], player: int) -> bool:
        return (
            self._check_vertical(grid, player)
            or self._check_rows(grid, player)
            or self._check_columns(grid, player)
            or self._check_diagonal(grid, player)
            or self._check_3d_diagonal(grid, player)
        )

    def _check_vertical(self, grid: List[List[List[int]]], player: int) -> bool:
        for row in grid:
            for column in row:
                if sum(column) * player == 4:
                    return True
        return False

    def _check_rows(self, grid: List[List[List[int]]], player: int) -> bool:
        for row in grid:
            for height in range(4):
                if sum(column[height] for column in row) * player == 4:
                    return True
        return False

    def _check_columns(self, grid: List[List[List[int]]], player: int) -> bool:
        for height in range(4):
            for column in range(4):
                if sum(row[column][height] for row in grid) * player == 4:
                    return True
        return False

    def _check_diagonal(self, grid: List[List[List[int]]], player: int) -> bool:
        for row in range(4):
            if (
                sum(grid[row][index][index] for index in range(4)) * player == 4
                or sum(grid[3 - row][index][3 - index] for index in range(4)) * player
                == 4
            ):
                return True

        for column in range(4):
            if (
                sum(grid[index][column][index] for index in range(4)) * player == 4
                or sum(grid[index][column][3 - index] for index in range(4)) * player
                == 4
            ):
                return True

        for height in range(4):
            if (
                sum(grid[index][index][height] for index in range(4)) * player == 4
                or sum(grid[3 - index][index][height] for index in range(4)) * player
                == 4
            ):
                return True
        return False

    def _check_3d_diagonal(self, grid: List[List[List[int]]], player: int) -> bool:
        return (
            sum(grid[index][index][index] for index in range(4)) * player == 4
            or sum(grid[index][index][3 - index] for index in range(4)) * player == 4
            or sum(grid[index][3 - index][index] for index in range(4)) * player == 4
            or sum(grid[index][3 - index][3 - index] for index in range(4)) * player
            == 4
        )
