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
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sort, setSort] = useState(true); // true=ascending, false=descending
  const sortDescription = sort ? "Descending" : "Ascending";
  
  const winner = calculateWinner(currentSquares.boardState);
  
  const handlePlay = (nextSquares: (string | null)[], coords: Coords) => {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { boardState: nextSquares, coords },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (move: number) => {
    setCurrentMove(move);
  };

  const newGame = () => {
    setCurrentMove(0);
    setHistory(initialHistory);
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <div className="game">
      <div className="game-board">
        <button onClick={() => newGame()}>New Game</button>
        <Board
          xIsNext={xIsNext}
          squares={currentSquares.boardState}
          onPlay={handlePlay}
          winner={winner}
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
        />
      </div>
    </div>
  );
}
