import { useState } from "react";
import "./Game.css";
import { Board } from "./Board";
import { Moves } from "./Moves";
import { History, Coords } from "../types/history";
import { calculateWinner } from "../services/winner";

export default function Game() {
  const initialHistory = [
    { boardState: Array(9).fill(null), coords: { row: -1, column: -1 } },
  ];
  const [history, setHistory] = useState<History[]>(initialHistory);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [sort, setSort] = useState(true); // true=ascending, false=descending

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const sortDescription = sort ? "Descending" : "Ascending";
  const winner = calculateWinner(currentSquares.boardState);
  
  const handlePlay = (i: number, coords: Coords) => {
    const squares = currentSquares.boardState;

    // return if winner
    if (squares[i] ?? winner) {
      return;
    }
    // can't alter game state when going through history
    if (inHistory) {
      return;
    }

    // update board
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { boardState: nextSquares, coords },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMoveCount(moveCount + 1);
  };

  const jumpTo = (move: number) => {
    setCurrentMove(move);
  };

  const newGame = () => {
    setCurrentMove(0);
    setMoveCount(0);
    setHistory(initialHistory);
  };

  const handleSort = () => {
    setSort(!sort);
  };
  
  const inHistory = currentMove < moveCount;

  const gameOver = moveCount > 8;

  return (
    <div className="game">
      <div className="game-board">
        <button onClick={() => newGame()}>New Game</button>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares.boardState}
          onPlay={handlePlay}
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
