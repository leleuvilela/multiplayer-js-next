"use client";
import { createGame } from "@/core/game";
import { useKeyboardListener } from "@/core/keyboard-listener";
import renderScreen from "@/core/render-screen";
import { MutableRefObject, useEffect, useRef } from "react";

export interface GameProps {
  gameRef: MutableRefObject<ReturnType<typeof createGame>>;
}

export function Game({ gameRef }: GameProps) {
  const screenRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const keyboardListener = useKeyboardListener();

  useEffect(() => {
    const game = gameRef.current;

    game.addPlayer({ playerId: "x", playerY: 3, playerX: 3 });

    if (screenRef.current) {
      requestRef.current = requestAnimationFrame(() =>
        renderScreen(
          screenRef.current!,
          game,
          "currentPlayerId",
          requestAnimationFrame,
          requestRef,
        ),
      );

      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [gameRef]);

  useEffect(() => {
    keyboardListener.registerPlayerId("x");
    keyboardListener.subscribe(gameRef.current.movePlayer);

    gameRef.current.start();
  }, []);

  return (
    <canvas
      ref={screenRef}
      width={20}
      height={20}
      className="border-4 border-zinc-100 w-[400px] h-[400px] rendering-pixalated rendering-crisp-edges"
    ></canvas>
  );
}
