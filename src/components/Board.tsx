import { Winner } from "../services/winner";
import { Square } from "./Square";
import { Coords } from "../types/history";

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  winner: Winner | undefined;
  inHistory: boolean;
  draw: boolean;
  onPlay: (nextSquares: (string | null)[], coords: Coords) => void;
}

export const Board = (boardProps: BoardProps) => {
  const handleClick = (i: number, row: number, column: number) => {
    if (boardProps.squares[i] ?? boardProps.winner) {
      return;
    }
    // can't alter game state when going through history
    if (boardProps.inHistory) {
      return;
    }
    const nextSquares = boardProps.squares.slice();
    if (boardProps.xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    boardProps.onPlay(nextSquares, { row, column });
  };

  let status;
  if (boardProps.winner) {
    status = "Winner: " + boardProps.winner.player;
  } else {
    if (boardProps.draw) {
      status = "Draw";
    } else {
      status = "Next player: " + (boardProps.xIsNext ? "X" : "O");
    }
  }

  const rows = [];
  rows.push(
    <div className="board-row" key={1000}>
      <span style={{ display: 'inline-block', width: '20px' }}></span>
      <span style={{ display: 'inline-block', width: '34px' }}>0</span>
      <span style={{ display: 'inline-block', width: '34px' }}>1</span>
      <span style={{ display: 'inline-block', width: '34px' }}>2</span>
    </div>
  );
  for (let i = 0; i < 3; i++) {
    const rowItems = [];
    rowItems.push(<span key={i+50} style={{ float: "left" }}>{i}</span>);
    for (let j = 0; j < 3; j++) {
      const square = i * 3 + j;
      const highlight = boardProps.winner?.move.includes(square) ?? false;
      rowItems.push(
        <Square
          value={boardProps.squares[square]}
          onSquareClick={() => handleClick(square, i, j)}
          key={square}
          highlight={highlight}
        />
      );
    }
    rows.push(
      <div className="board-row" key={i + 100}>
        {rowItems}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
};
