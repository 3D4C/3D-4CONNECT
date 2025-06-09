from src.gamelogic import Environment
from src.entities import SetupDataModel, GameEventModel
from src.helper import colorize_text, gameboard_to_string

from datetime import datetime
import torch
import json
import statistics
from pathlib import Path
from collections import deque
from copy import deepcopy

EPISODES = 10_000
STARTING_PARAMS_PATH = "2407021408_random_1000"

SHARED_MEMORY = False
MEMORY_SIZE = 5_000
WIN_SAMPLE_MULTIPLIER = 7
ANTAGO = "naive_attacker_horizontal"


def main():

    base_path = Path(__file__).parent / "models/qlearning"

    header = f"{'==='*20}\n{ANTAGO.capitalize()} vs Qlearning\n{'==='*20}"
    print(colorize_text(header, "green"))

    timestamp = datetime.now().strftime("%y%m%d%H%M")
    run = f"{timestamp}_{ANTAGO}_{EPISODES}"

    gamemode = "singleplayer"
    actor_ids = [ANTAGO, "qlearning"]
    actor_names = [ANTAGO.capitalize(), "Qlearning"]
    actor_scores = [0, 0]

    actor_digits = [1, -1]
    actor_buffers = [deque(maxlen=1) for _ in range(2)]
    actor_memories = [deque(maxlen=MEMORY_SIZE) for _ in range(2)]

    setup_data = SetupDataModel(
        gamemode=gamemode,
        actorIds=actor_ids,
        actorNames=actor_names,
        actorScores=actor_scores,
    )

    env = Environment(setup_data)
    agents = env.agents

    agents[1].setup_training()
    if STARTING_PARAMS_PATH:
        agents[1].load_model_params(base_path / STARTING_PARAMS_PATH / "Qlearning.pth")
    agents[1].protago_digit = torch.tensor([-1])

    total_rewards_history = []
    win_tracker_history = []

    # ------------ Loop over Episodes ------------
    for episode in range(EPISODES):
        gameboard, reward, done, info = env.reset()
        total_rewards = [0, 0]
        win_tracker = [0, 0]
        step = 0

        # ------------ Loop over Steps ------------
        while not done:
            step += 1
            turn = info.turn
            old_gameboard = deepcopy(gameboard)

            move = agents[turn].predict_move(old_gameboard)
            game_event = GameEventModel(
                actorId=actor_ids[turn], coordinates=[move.x, move.y]
            )

            gameboard, reward, done, info = env.step(game_event)
            total_rewards[turn] += reward

            # == Add to agents memory ==
            if len(actor_buffers[turn]) > 0:
                actor_memories[turn].append(
                    (
                        *actor_buffers[turn][0],
                        torch.tensor(old_gameboard, dtype=torch.float),  # new_gameboard
                    )
                )

            actor_buffers[turn].append(
                (
                    torch.tensor(old_gameboard, dtype=torch.float),  # old_gameboard
                    torch.tensor([move.x * 4 + move.y], dtype=torch.int64),  # action
                    torch.tensor([reward], dtype=torch.float32),  # reward
                    torch.tensor([done], dtype=torch.int8),  # terminal
                    torch.tensor([actor_digits[turn]], dtype=torch.int8),  # actor_digit
                )
            )

            if done:
                for _ in range(WIN_SAMPLE_MULTIPLIER):
                    actor_memories[turn].append(
                        (
                            *actor_buffers[turn][0],
                            torch.tensor(gameboard, dtype=torch.float),  # new_gameboard
                        )
                    )

            # == Q-Learning ==
            if actor_ids[turn] == "qlearning":
                memory = (
                    actor_memories[0] + actor_memories[1]
                    if SHARED_MEMORY
                    else actor_memories[turn]
                )
                if len(memory) > agents[turn].batch_size:
                    agents[turn].replay(memory)

            # print(f"{step} - {actor_names[turn]}: {info.lastMove} -> {reward}")

            if done:
                # Update Target model
                qlearning_indices = [
                    i for i, actor_id in enumerate(actor_ids) if actor_id == "qlearning"
                ]
                for i in qlearning_indices:
                    agents[i].update_target_model()

                # == Correct Reward of previous agents move, if it led to defeat or draw ==
                reason = [key for key, value in env.rewards.items() if value == reward][
                    0
                ]
                if reason == "win":
                    corrected_reward = env.rewards["loose"]
                elif reason == "draw":
                    corrected_reward = env.rewards["draw"]
                elif reason == "invalid":
                    corrected_reward = env.rewards["valid"]

                other_agent_idx = 1 if turn == 0 else 0
                actor_memories[other_agent_idx].pop()
                for _ in range(WIN_SAMPLE_MULTIPLIER):
                    actor_memories[other_agent_idx].append(
                        (
                            actor_buffers[other_agent_idx][0][0],
                            actor_buffers[other_agent_idx][0][1],
                            torch.tensor([corrected_reward], dtype=torch.float32),
                            actor_buffers[other_agent_idx][0][3],
                            actor_buffers[other_agent_idx][0][4],
                            torch.tensor(gameboard, dtype=torch.float),
                        )
                    )

                total_rewards[other_agent_idx] += (
                    corrected_reward - env.rewards["valid"]
                )

                # == Print and log Episode Results ==
                epsilons = [agents[i].epsilon for i in qlearning_indices]

                first_line = (
                    f"\nEpisode {episode+1}/{EPISODES}, Total Rewards: {total_rewards}"
                )
                second_line = f"{actor_names[turn]} - {reason} - on step {step}"
                third_line = (
                    f"QLearning Epsilons: {epsilons}\n" if len(epsilons) > 0 else ""
                )

                print(
                    colorize_text(first_line, "blue"),
                    colorize_text(second_line, "dim_white"),
                    colorize_text(third_line, "dim_white"),
                    # gameboard_to_string(gameboard),
                    sep="\n",
                )

                win_tracker[turn if reason != "invalid" else other_agent_idx] = 1
                win_tracker_history.append(win_tracker)
                total_rewards_history.append(total_rewards)

    # == Log Final Results ==
    metadata = {
        "episodes": EPISODES,
        "setup_data": setup_data.dict(),
        "shared_memory": SHARED_MEMORY,
        "win_counts": [
            sum([win_tracker[i] for win_tracker in win_tracker_history])
            for i in range(2)
        ],
        "avg_rewards": [
            statistics.mean([rewards[i] for rewards in total_rewards_history])
            for i in range(2)
        ],
        "win_tracker_history": win_tracker_history,
        "total_reward_history": total_rewards_history,
        "reward_function": env.rewards,
    }

    path = base_path / run
    path.mkdir(parents=True, exist_ok=True)

    for i, agent in enumerate(agents):
        if hasattr(agent, "hyperparameters"):
            metadata["hyperparameters"] = agent.hyperparameters

        if hasattr(agent, "description"):
            metadata["description"] = agent.description

        if hasattr(agent, "save_model"):
            file_path = path / f"{actor_names[i]}.pth"
            agent.save_model(file_path)

    file_path = path / "metadata.json"
    with open(file_path, "w") as f:
        json.dump(metadata, f, indent=4)


if __name__ == "__main__":
    main()
