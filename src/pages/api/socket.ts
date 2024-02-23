import { createGame } from "@/core/game";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";
import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
  game?: ReturnType<typeof createGame> | undefined;
}

const PORT = 3000;

export default function SocketHandler(
  _req: NextApiRequest,
  res: NextApiResponseWithSocket,
) {
  if (res.socket.server.io) {
    res.status(200).json({
      success: true,
      message: "Socket is already running",
      socket: `:${PORT + 1}`,
    });
    return;
  }

  console.log("Starting Socket.IO server on port:", PORT + 1);

  const io = new Server({
    path: "/api/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  }).listen(PORT + 1);

  console.log(res.game);
  if (!res.game) {
    console.log("hmm");
    res.game = createGame();
    res.game.start();

    res.game.subscribe((command: any) => {
      console.log(`Emitting ${command.type}`);
      io.emit(command.type, command);
    });
  }

  io.on("connection", (socket) => {
    const playerId = socket.id;
    const _socket = socket;
    console.log("Player connected:", socket.id);

    res.game?.addPlayer({ playerId });

    io.emit("setup", res.game?.state);

    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`);

    socket.on("disconnect", async () => {
      res.game?.removePlayer({ playerId });
      console.log("Player disconnect:", playerId);
    });

    socket.on("move-player", (command: any) => {
      command.playerId = playerId;
      command.type = "move-player";
      res.game?.movePlayer(command);
    });
  });

  res.socket.server.io = io;

  res.status(201).json({
    success: true,
    message: "Socket is started",
    socket: `:${PORT + 1}`,
  });
}
