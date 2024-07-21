import { History } from "../types/history";
import { Winner } from "../services/winner";

interface MoveProps {
  history: History[];
  sort: boolean;
  currentMove: number;
  winner: Winner | undefined;
  jumpTo: (move: number) => void;
}

export const Moves = (props: MoveProps) => {
  const moveList = props.history.map((squares: History, move) => {
    let description;
    const coordsString = `${squares.coords.row}, ${squares.coords.column}`;
    if (move > 0) {
      description = `Go to move #${move} (${coordsString})`;
    } else {
      description = "Go to game start";
    }

    const winnerString = props.winner
      ? `(Game won by ${props.winner.player}) `
      : "";
    let moveString =
      move > 0
        ? `You are at move #${move} (${coordsString})`
        : `You are at game start`;
    if (move === props.history.length-1) {
        moveString = `${winnerString}${moveString}`;
    }
    if (move === props.currentMove) {
      return <li key={move}>{moveString}</li>;
    } else {
      return (
        <li key={move}>
          <button onClick={() => props.jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <ul className="no-bullets">
      {props.sort ? moveList : moveList.slice().reverse()}
    </ul>
  );
};
