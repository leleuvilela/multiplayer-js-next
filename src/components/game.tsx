"use client";
import { createGame } from "@/core/game";
import { useKeyboardListener } from "@/core/keyboard-listener";
import renderScreen from "@/core/render-screen";
import socketClient from "@/core/socket-client";
import { MutableRefObject, useEffect, useRef } from "react";

export interface GameProps {
  gameRef: MutableRefObject<ReturnType<typeof createGame>>;
  socketRef:
    | MutableRefObject<ReturnType<typeof socketClient>>
    | MutableRefObject<null>;
}

export function Game({ gameRef, socketRef }: GameProps) {
  const screenRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const keyboardListener = useKeyboardListener();

  useEffect(() => {
    socketRef.current = socketClient();

    const game = gameRef.current;
    const io = socketRef.current;

    io.on("connect", () => {
      if (screenRef.current) {
        requestRef.current = requestAnimationFrame(() =>
          renderScreen(
            screenRef.current!,
            game,
            io.id!,
            requestAnimationFrame,
            requestRef,
          ),
        );
      }
    });

    io.on("setup", (state) => {
      const playerId = io.id;
      game.setState(state);

      keyboardListener.registerPlayerId(playerId!);
      keyboardListener.subscribe(game.movePlayer);
      keyboardListener.subscribe((command: any) => {
        //TODO: just send if is a valid command/key
        io.emit("move-player", command);
      });
    });

    io.on("add-player", (command: any) => {
      console.log(
        `Receibing add-player command on client: ${command.playerId}`,
      );
      game.addPlayer(command);
    });

    io.on("remove-player", (command) => {
      console.log(
        `Receiving remove-player command on client: ${command.playerId}`,
      );
      game.removePlayer(command);
    });

    io.on("move-player", (command) => {
      // console.log(
      //  `Receiving move-player command on client: ${command.playerId}`,
      // );
      const playerId = io.id;

      if (playerId !== command.playerId) {
        game.movePlayer(command);
      }
    });

    io.on("add-fruit", (command) => {
      console.log(`Receiving add-fruit command on client: ${command.fruitId}`);
      game.addFruit(command);
    });

    io.on("remove-fruit", (command) => {
      console.log(
        `Receiving remove-fruit command on client: ${command.fruitId}`,
      );
      game.removeFruit(command);
    });

    return () => {
      cancelAnimationFrame(requestRef.current);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
