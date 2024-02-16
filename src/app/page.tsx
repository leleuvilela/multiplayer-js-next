"use client";
import { Game } from "@/components/game";
import { createGame } from "@/core/game";
import { useRef } from "react";

export default function Home() {
  const gameRef = useRef(createGame());

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Game gameRef={gameRef} />
    </main>
  );
}
