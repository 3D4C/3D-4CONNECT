import math
import random

from pathlib import Path
from copy import deepcopy
from typing import List, Union
from abc import ABC, abstractmethod
from src.winchecker import WinChecker

from src.helper import *
from src.entities import MoveDataclass

ROOT = Path(__file__).parent.parent


class AgentInterface(ABC):
    name = "default"

    @abstractmethod
    def __init__(self, strength):
        pass

    @abstractmethod
    def predict_move(
        self,
        gameboard: Union[
            List[List[List[int]]], None
        ],  # TODO: Class Environment but circular import
    ) -> MoveDataclass:
        pass


class Node:
    def __init__(self, parent, digit, gameboard, building_action: MoveDataclass):
        self.parent: Node = parent
        self.digit = digit
        self.gameboard = gameboard
        self.building_action: MoveDataclass = building_action

        self.n: int = 0
        self.w: float = 0

        self.terminal = False
        self.reward = None

        self.untried_actions = find_possible_actions(gameboard)
        self.children: List[Node] = []

    def recommended_action(self):
        child = max(self.children, key=lambda child: child.n)
        return child.building_action

    def max_ucb1(self, c: float):
        weights = [
            (child.w / child.n) + c * math.sqrt(2 * math.log(self.n) / child.n)
            for child in self.children
        ]
        return self.children[weights.index(max(weights))]


class MCTSAgent(AgentInterface):
    name = "mcts"

    def __init__(self, strength, verbose: bool = False):
        min_iterations = 200
        max_iterations = 2000
        self.iterations = int(
            (max_iterations - min_iterations) * strength + min_iterations
        )
        self.verbose = verbose

        print("MCTS AGENT INITIALIZED")
        print(f"ITERATIONS: {self.iterations}")
        print(f"strength: {strength}")

        self.c = math.sqrt(2)

        self.protago_digit, self.antago_digit = None, None
        self.win_checker = WinChecker()
        self.mcts_rewards = {
            "win": 1,
            "draw": 0,
            "valid_move": 0,
        }

    def predict_move(self, gameboard):
        if self.protago_digit is None:
            self.protago_digit, self.antago_digit = get_actor_digits(gameboard)

        root = Node(
            parent=None,
            digit=self.antago_digit,
            gameboard=gameboard,
            building_action=None,
        )

        if self.verbose:
            from tqdm import tqdm
        else:

            def tqdm(iterable, *args, **kwargs):
                return iterable

        for _ in tqdm(range(self.iterations), desc="Looking for best move"):
            reward, done, node = self.select(root)
            if not done:
                reward = self.simulate(node)
            self.backpropagate(node, reward)

        return root.recommended_action()

    def select(self, node: Node) -> Node:
        while not node.untried_actions and not node.terminal:
            node = node.max_ucb1(self.c)

        if node.untried_actions and not node.terminal:
            reward, done, child = self.expand(node)
            return reward, done, child

        return node.reward, node.terminal, node

    def expand(self, parent: Node) -> Node:
        action = parent.untried_actions.pop()
        reward, done, gameboard, digit = self._simulate_step(
            parent.digit, parent.gameboard, action
        )

        child = Node(
            parent=parent,
            digit=digit,
            gameboard=gameboard,
            building_action=action,
        )

        if done:
            child.terminal = True
            child.reward = reward

        parent.children.append(child)

        return reward, done, child

    def _simulate_step(self, parent_digit, parent_gameboard, action: MoveDataclass):
        gameboard = deepcopy(parent_gameboard)
        digit = 1 if parent_digit == -1 else -1

        action.z = sum(1 for value in gameboard[action.x][action.y] if value != 0)
        gameboard[action.x][action.y][action.z] = digit

        if self.win_checker.check_win(gameboard, digit):
            reward = self.mcts_rewards["win"]
            if digit == self.antago_digit:
                reward *= -1
            return reward, True, gameboard, digit

        if not any(
            height == 0 for column in gameboard for row in column for height in row
        ):
            return self.mcts_rewards["draw"], True, gameboard, digit

        return self.mcts_rewards["valid_move"], False, gameboard, digit

    def simulate(self, node: Node) -> float:
        gameboard = node.gameboard
        digit = node.digit

        done = False
        while not done:
            action = random.choice(find_possible_actions(gameboard))
            reward, done, gameboard, digit = self._simulate_step(
                digit, gameboard, action
            )

        return reward

    def backpropagate(self, node: Node, reward: float) -> None:
        if node.digit == self.antago_digit:
            reward *= -1

        while node is not None:
            node.n += 1
            node.w += reward
            node = node.parent
            reward *= -1

class Agency:
    def __init__(self):
        self.agent_dict = {
            "mcts": MCTSAgent,                   
        }

    def select(
        self,
        actor_ids: str,
        actor_scores: int,
    ):
        agents = []
        for actor_id, actor_score in zip(actor_ids, actor_scores):
            agent = self.agent_dict.get(actor_id)
            if agent:
                agent = agent(actor_score)
            agents.append(agent)

        return agents
