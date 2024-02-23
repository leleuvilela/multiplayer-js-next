import { io } from "socket.io-client";

const PORT = 3000;

export default function socketClient() {
  const socket = io(`http://localhost:${PORT + 1}`, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });

  socket.on("connect_error", async (error) => {
    console.log(`connect_error due to ${error.message}`);
  });

  return socket;
}
