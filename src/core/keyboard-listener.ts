import { useCallback, useEffect, useState } from "react";

export function useKeyboardListener() {
  const [observers, setObservers] = useState<Function[]>([]);
  const [playerId, setPlayerId] = useState<string>();

  function registerPlayerId(playerId: string) {
    setPlayerId(playerId);
  }

  function subscribe(observerFunction: Function) {
    setObservers([...observers, observerFunction]);
  }

  const notifyAll = useCallback(
    (command: any) => {
      for (const observerFunction of observers) {
        observerFunction(command);
      }
    },
    [observers],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const keyPressed = event.key;
      const command = {
        type: "move-player",
        playerId: playerId,
        keyPressed,
      };

      notifyAll(command);
    },
    [notifyAll, playerId],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    subscribe,
    registerPlayerId,
  };
}
