import { io } from "socket.io-client";

// connect
const socket = io('ws://localhost:3000');

socket.on("connect", () => {
  console.log(`connected: ${socket.id}`);
  console.log("sending ping...");
  socket.emit("ping");
});

socket.on("pong", () => {
  console.log("got pong...");
});

socket.on("disconnect", (reason) => {
  if (!socket.active) {
    console.log(reason);
  }
});
