import json
import click

from tqdm import tqdm
from pathlib import Path

from src.gamelogic import Environment
from src.entities import SetupDataModel, GameEventModel


ROOT = Path(__file__).parent
OUTPUT_DIR = ROOT / "models/mcts"
OUTPUT_DIR.mkdir(exist_ok=True)

SETUP_DATA = SetupDataModel(
    gamemode="singleplayer",
    actorIds=["naive", "mcts"],
    actorNames=["Computer", "MCTS"],
    actorScores=[0, 0],
)


@click.command()
@click.option("-n", "--num_games", default=100, help="Number of games to play.")
@click.option(
    "-i", "--iterations", default=500, help="Number of MCTS iterations per move."
)
@click.option(
    "-p",
    "--path",
    default="mcts_results.json",
    help="Output path for the results JSON file.",
)
def main(num_games: int, iterations: int, path: str) -> None:
    results = []

    for game_index in tqdm(range(num_games), desc="Evaluating MCTS..."):
        env = Environment(SETUP_DATA)
        agents = env.agents

        mcts_index = SETUP_DATA.actorIds.index("mcts")
        agents[mcts_index].iterations = iterations

        gameboard, reward, done, info = env.reset()

        step = 0
        done = False
        while not done:
            turn = info.turn
            agent_id = SETUP_DATA.actorIds[turn]
            move = agents[turn].predict_move(gameboard)
            game_event = GameEventModel(actorId=agent_id, coordinates=[move.x, move.y])

            gameboard, reward, done, info = env.step(game_event)

            if done:
                digit = 1 if turn == 0 else -1
                reward = digit * reward

            step += 1

        print(f"Game {game_index + 1} completed. Reward: {reward}, Steps: {step}")

        results.append(
            {
                "game_index": game_index,
                "reward": reward,
                "steps": step,
            }
        )

    with open(OUTPUT_DIR / path, "w") as f:
        json.dump(
            {
                "num_games": num_games,
                "iterations": iterations,
                "setup": SETUP_DATA.dict(),
                "results": results,
            },
            f,
            indent=4,
        )

    print(f"Results saved to {OUTPUT_DIR / path}")


if __name__ == "__main__":
    main()
