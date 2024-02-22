import { MutableRefObject } from "react";
import { createGame } from "./game";

export default function renderScreen(
  screen: HTMLCanvasElement,
  game: ReturnType<typeof createGame>,
  currentPlayerId: string,
  requestAnimationFrame: typeof window.requestAnimationFrame,
  requestAnimationRef: MutableRefObject<number>,
) {
  const context = screen.getContext("2d")!;
  context.fillStyle = "white";
  context.clearRect(0, 0, 20, 20);

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId];

    context.fillStyle = "black";
    context.fillRect(player.x, player.y, 1, 1);
  }

  for (const fruitId in game.state.fruits) {
    const fruit = game.state.fruits[fruitId];
    context.fillStyle = "green";
    context.fillRect(fruit.x, fruit.y, 1, 1);
  }

  const currentPlayer = game.state.players[currentPlayerId];

  if (currentPlayer) {
    context.fillStyle = "#F0DB4F";
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
  }

  requestAnimationRef.current = requestAnimationFrame(() => {
    renderScreen(
      screen,
      game,
      currentPlayerId,
      requestAnimationFrame,
      requestAnimationRef,
    );
  });
}
