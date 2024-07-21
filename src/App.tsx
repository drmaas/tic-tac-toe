import { useState } from 'react';
import './App.css';

type Winner = {
    player: string;
    move: number[];
};
const calculateWinner = (squares: string[]): Winner | undefined => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const i of lines) {
        const [a, b, c] = i;
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return { player: squares[a], move: i };
        }
    }
    return undefined;
};

interface SquareProps {
    value: string;
    onSquareClick: (e: React.MouseEvent<HTMLElement>) => void;
    highlight: boolean;
}

const Square = (props: SquareProps) => {
    return (
        <button
            className={props.highlight ? 'square square-highlight' : 'square'}
            onClick={props.onSquareClick}
        >
            {props.value}
        </button>
    );
};

interface BoardProps {
    xIsNext: boolean;
    squares: string[];
    onPlay: (nextSquares: string[], coords: Coords) => void;
}

const Board = (boardProps: BoardProps) => {
    const [moveCount, setMoveCount] = useState(0);
    const handleClick = (i: number, row: number, column: number) => {
        if (boardProps.squares[i] || calculateWinner(boardProps.squares)) {
            return;
        }
        setMoveCount(moveCount + 1);
        const nextSquares = boardProps.squares.slice();
        if (boardProps.xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        boardProps.onPlay(nextSquares, { row, column });
    };

    const winner = calculateWinner(boardProps.squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner.player;
    } else {
        if (moveCount > 8) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (boardProps.xIsNext ? 'X' : 'O');
        }
    }

    const rows = [];
    for (let i = 0; i < 3; i++) {
        const rowItems = [];
        for (let j = 0; j < 3; j++) {
            const square = i * 3 + j;
            const highlight = winner?.move.includes(square) ?? false;
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

type Coords = {
    row: number;
    column: number;
};

type History = {
    boardState: string[];
    coords: Coords;
};

export default function Game() {
    const initialHistory = [
        { boardState: Array(9).fill(null), coords: { row: -1, column: -1 } },
    ];
    const [history, setHistory] = useState<History[]>(initialHistory);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [sort, setSort] = useState(true); // true=ascending, false=descending
    const sortDescription = sort ? 'Descending' : 'Ascending';

    const handlePlay = (nextSquares: string[], coords: Coords) => {
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

    const moves = history.map((squares, move) => {
        console.log(move);
        let description;
        const coordsString = `${squares.coords.row}, ${squares.coords.column}`;
        if (move > 0) {
            description = `Go to move #${move} (${coordsString})`;
        } else {
            description = 'Go to game start';
        }

        const moveString =
            move > 0
                ? `You are at move #${move} (${coordsString})`
                : `You are at game start`;
        if (move === currentMove) {
            return <li key={move}>{moveString}</li>;
        } else {
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        }
    });
    const sortedMoves = sort ? moves : moves.slice().reverse();

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
                />
            </div>
            <div className="game-info">
                <button onClick={() => handleSort()}>{sortDescription}</button>
                <ul className="no-bullets">{sortedMoves}</ul>
            </div>
        </div>
    );
}
