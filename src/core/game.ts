"use client";
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

  const observers: Function[] = [];

  function subscribe(observerFunction: Function) {
    observers.push(observerFunction);
  }

  function notifyAll(command: Object) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function start() {
    const frequency = 10000;
    setInterval(addFruit, frequency);
  }

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

    notifyAll({
      type: "add-player",
      playerId,
      playerX,
      playerY,
    });
  }

  function removePlayer(command: { playerId: string }) {
    const { playerId } = command;

    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId,
    });
  }

  function addFruit(command?: {
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

    notifyAll({
      type: "add-fruit",
      fruitId,
      fruitX,
      fruitY,
    });
  }

  function removeFruit(command: { fruitId: string }) {
    const { fruitId } = command;

    delete state.fruits[fruitId];

    notifyAll({
      type: "remove-fruit",
      fruitId,
    });
  }

  function movePlayer(command: { keyPressed: string; playerId: string }) {
    notifyAll(command);

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
    movePlayer,
    start,
    subscribe,
    notifyAll,
  };
}
