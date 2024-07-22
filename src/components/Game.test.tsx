/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';
import { calculateWinner } from '../services/winner'; 

vi.mock('../services/winner', () => ({
  calculateWinner: vi.fn(),
}));

describe('Game component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly with initial state', () => {
    render(<Game />);
    expect(screen.getByText(/Next player: X/)).toBeInTheDocument();
    expect(screen.getByText(/New Game/)).toBeInTheDocument();
    expect(screen.getByText(/Descending/)).toBeInTheDocument();
  });

  it('updates the board state when a square is clicked', () => {
    render(<Game />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Click the first square
    expect(screen.getByText(/Next player: O/)).toBeInTheDocument();
    expect(buttons[2]).toHaveTextContent('X');
  });

  it('checks the winner status', () => {
    (calculateWinner as Mock).mockReturnValue({ player: 'X', move: [0, 1, 2] });
    render(<Game />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Click the first square
    fireEvent.click(buttons[3]); // Click the second square
    fireEvent.click(buttons[4]); // Click the third square
    fireEvent.click(buttons[5]); // Click the fourth square
    fireEvent.click(buttons[6]); // Click the fifth square
    expect(screen.getByText(/Winner: X/)).toBeInTheDocument();
  });

  it('starts a new game', () => {
    render(<Game />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Click the first square
    fireEvent.click(buttons[0]); // Click "New Game" button
    expect(screen.getByText(/Next player: X/)).toBeInTheDocument();
    expect(buttons[2]).not.toHaveTextContent('X');
  });

  it('sorts the moves', () => {
    render(<Game />);
    fireEvent.click(screen.getByText(/Descending/));
    expect(screen.getByText(/Ascending/)).toBeInTheDocument();
  });

  it('jumps to a specific move', () => {
    render(<Game />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]); // Click the first square
    fireEvent.click(buttons[3]); // Click the second square
    fireEvent.click(screen.getByText(/Go to move #1/));
    expect(screen.getByText(/Next player: O/)).toBeInTheDocument();
    expect(buttons[2]).toHaveTextContent('X');
    expect(buttons[3]).not.toHaveTextContent('O');
  });
});
