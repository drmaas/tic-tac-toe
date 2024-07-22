interface SquareProps {
    value: string| null;
    onSquareClick: (e: React.MouseEvent<HTMLElement>) => void;
    highlight: boolean;
}

export const Square = (props: SquareProps) => {
    return (
        <button
            className={props.highlight ? 'square square-highlight' : 'square'}
            onClick={props.onSquareClick}
        >
            {props.value}
        </button>
    );
};