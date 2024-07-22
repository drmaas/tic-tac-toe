/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { Square } from './Square';

let onSquareClick: Mock;

beforeEach(() => {
    onSquareClick = vi.fn();
});

describe('Square component', () => {
    it('renders correctly with given value', () => {
        render(<Square value="X" onSquareClick={onSquareClick} highlight={false} />);
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('X');
    });

    it('applies the correct class when highlight is true', () => {
        render(<Square value="X" onSquareClick={onSquareClick} highlight={true} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('square-highlight');
    });

    it('does not apply the highlight class when highlight is false', () => {
        render(<Square value="X" onSquareClick={onSquareClick} highlight={false} />);
        const button = screen.getByRole('button');
        expect(button).not.toHaveClass('square-highlight');
    });

    it('calls onSquareClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Square value="X" onSquareClick={handleClick} highlight={false} />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
