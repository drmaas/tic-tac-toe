import { exit } from "node:process";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Coords } from "./types/history";
import { Board } from "./types/board";
import { Player } from "./types/player";

interface Players {
  X: Socket | null;
  O: Socket | null;
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const initialBoard: Board = Array<string | null>(9).fill(null);
let board: Board = initialBoard.slice();
let player: Player = "X";
const players: Players = { X: null, O: null };

const newgame = () => {
  board = initialBoard.slice();
  player = "X";
};

io.on("connection", (socket) => {
  console.log(`connected: ${socket.id}`);

  // ping pong
  socket.on("ping", () => {
    console.log("got ping, sending pong...");
    socket.emit("pong");
  });

  // track player connections
  if (players.O == null) {
    players.O = socket;
    console.log("O joined");
    socket.emit("you", "O");
  } else if (players.X == null) {
    players.X = socket;
    console.log("X joined");
    socket.emit("you", "X");
    io.emit("turn", "X");
  }

  // new game
  socket.on("newgame", () => {
    console.log("new game");
    newgame();
    io.emit("newgame");
    io.emit("turn", "X");
  });

  // click
  socket.on("play", (square: number, coords: Coords) => {
    console.log(`game play: ${player} moved at row=${coords.row}, column=${coords.column}`);
    // Ignore players clicking when it's not their turn
    if (players[player] !== socket) {
      console.log(
        "click from wrong player: " + player === "X" ? "O" : "X"
      );
      return;
    }

    // Ignore clicks before both players are connected
    if (players.X == null || players.O == null) {
      console.log("click before all players are connected");
      return;
    }

    // update board
    board[square] = player;
    io.emit("board", board, square, coords);

    // update turn
    player = player === "X" ? "O" : "X";
    io.emit("turn", player);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log(`disconnected: ${socket.id}`);
    if (players.X === socket) {
      players.X = null;
    } else if (players.O === socket) {
      players.O = null;
    }
  });
});

// ensure reset
newgame();

// start server
const port = 1337;
httpServer
  .listen(port, () => {
    console.log(`server started on http://localhost:${port}`);
  })
  .on("error", (err) => {
    if (err) {
      console.log("server closing...");
      exit(1);
    }
  });
