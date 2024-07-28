import { exit } from "node:process";

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  socket.on("ping", (() => {
    console.log("got ping...");
    console.log("sending pong...");
    socket.emit("pong");
  }));

  socket.on("message", (arg: string) => {
    console.log(`you said: ${arg}`);
  });

  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
  });
});

httpServer
  .listen(3000, () => {
    console.log("server started on http://localhost:3000");
  })
  .on("error", (err) => {
    if (err) {
      console.log("server closing...");
      exit(1);
    }
  });
