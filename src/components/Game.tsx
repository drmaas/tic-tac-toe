import { useEffect, useState } from "react";
import "./Game.css";
import { Board } from "./Board";
import { Moves } from "./Moves";
import { History, Coords } from "../types/history";
import { Board as BoardType } from "../types/board";
import { calculateWinner } from "../services/winner";
import { io } from "socket.io-client";
import { Player } from "../types/player";

const port = 1337;
const socket = io(`http://localhost:${port}`);

export default function Game() {
  const initialHistory = () => [
    { boardState: Array(9).fill(null), coords: { row: -1, column: -1 } },
  ];
  const [history, setHistory] = useState<History[]>(initialHistory);
  const [currentMove, setCurrentMove] = useState(0);
  const [you, setYou] = useState<Player>("X");
  const [turn, setTurn] = useState<Player>("X");
  const [moveCount, setMoveCount] = useState(0);
  const [sort, setSort] = useState(true); // true=ascending, false=descending

  const currentSquares = history[currentMove];
  const sortDescription = sort ? "Descending" : "Ascending";
  const winner = calculateWinner(currentSquares.boardState);

  const jumpTo = (move: number) => {
    setCurrentMove(move);
  };

  const newGameClick = () => {
    socket.emit("newgame");
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const inHistory = currentMove < moveCount;

  const gameOver = moveCount > 8;

  // user click
  const handleClick = (i: number, coords: Coords) => {
    // return if winner
    if (currentSquares.boardState[i] ?? winner) {
      return;
    }

    // can't alter game state when going through history
    if (inHistory) {
      return;
    }

    // only if it's your turn
    if (you === turn) {
      socket.emit("play", i, coords);
    }
  };

  // io updates - newgame, you, turn, board
  useEffect(() => {
    // new game
    socket.on("newgame", () => {
      setCurrentMove(0);
      setMoveCount(0);
      setHistory(initialHistory);
    });

    // assign player symbol to you
    socket.on("you", (symbol: Player) => {
      setYou(symbol);
    });

    // your turn
    socket.on("turn", (player: Player) => {
      setTurn(player);
    });

    // board update
    socket.on("board", (board: BoardType, square: number, coords: Coords) => {
      console.log(`updating board with move to square ${square}`);
      const nextHistory = [
        ...history.slice(0, currentMove + 1),
        { boardState: board, coords },
      ];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
      setMoveCount(moveCount + 1);
    });
  }, [currentMove, history, moveCount]);

  return (
    <div className="game">
      <div className="game-board">
        <button onClick={() => newGameClick()}>New Game</button>
        <div>You are {you}</div>
        <Board
          nextPlayer={turn}
          squares={currentSquares.boardState}
          onPlay={handleClick}
          winner={winner}
          gameOver={gameOver}
        />
      </div>
      <div className="game-info">
        <button onClick={() => handleSort()}>{sortDescription}</button>
        <Moves
          history={history}
          sort={sort}
          currentMove={currentMove}
          jumpTo={jumpTo}
          winner={winner}
          gameOver={gameOver}
        />
      </div>
    </div>
  );
}
