"use client";
import { Game } from "@/components/game";
import { createGame } from "@/core/game";
import socketClient from "@/core/socket-client";
import { useEffect, useRef } from "react";

export default function Home() {
  const gameRef = useRef(createGame());
  const socketRef = useRef(socketClient());

  useEffect(() => {
    socketRef.current.emit("teste", { a: "bc" });
  }, [socketRef]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Game gameRef={gameRef} socketRef={socketRef} />
    </main>
  );
}
