# Backend Guide

### Standalone usage
The Connect4-3D environment can be used similarly to a gymnasium environment.

```python
from src.gamelogic import Environment


env = Environment()

done = False
while not done:
    game_object, reward, done = \
        env.step("player", env.game_object)

env.reset()
```

It accepts two different types as actors, `player` and `computer`. If `computer` is chosen, the passed actor class is automatically used to make predictions. Thus, every new actor class needs to inherit from `ComputerInterface` and implement the method `predict_move`. 

You can run the following command to execute the environment. Change the actors in [gameloop.py](gameloop.py) for different player compositions.

```bash
python -m gameloop
```