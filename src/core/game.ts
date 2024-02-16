interface Player {
  x: number;
  y: number;
  score: number;
}

interface Fruit {
  x: number;
  y: number;
}

interface GameState {
  players: { [id: string]: Player };
  fruits: { [id: string]: Fruit };
  screen: {
    width: number;
    height: number;
  };
}

export function createGame() {
  const state: GameState = {
    players: {},
    fruits: {},
    screen: {
      width: 20,
      height: 20,
    },
  };

  function setState(newState: GameState) {
    Object.assign(state, newState);
  }

  function addPlayer(command: {
    playerId: string;
    playerX?: number;
    playerY?: number;
  }) {
    const { playerId } = command;

    const playerX = command.playerX
      ? command.playerX
      : Math.floor(Math.random() * state.screen.width);
    const playerY = command.playerY
      ? command.playerY
      : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      score: 0,
    };
  }

  function removePlayer(command: { playerId: string }) {
    const { playerId } = command;

    delete state.players[playerId];
  }

  function addFruit(command: {
    fruitId: string;
    fruitX: number;
    fruitY: number;
  }) {
    const fruitId = command
      ? command.fruitId
      : Math.floor(Math.random() * 1000000);

    const fruitX = command
      ? command.fruitX
      : Math.floor(Math.random() * state.screen.width);

    const fruitY = command
      ? command.fruitY
      : Math.floor(Math.random() * state.screen.height);

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command: { fruitId: string }) {
    const { fruitId } = command;

    delete state.fruits[fruitId];
  }

  function movePlayer(command: { keyPressed: string; playerId: string }) {
    const acceptedMoves = {
      ArrowUp(player: Player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(player: Player) {
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
      ArrowDown(player: Player) {
        if (player.y + 1 < state.screen.height) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player: Player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
    };

    const { keyPressed, playerId } = command;
    const player = state.players[playerId];
    //@ts-ignore
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  function checkForFruitCollision(playerId: string) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];

      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId });
      }
    }
  }

  return {
    state,
    setState,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
  };
}
