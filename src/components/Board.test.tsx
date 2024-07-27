/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Board } from './Board'; // Update with the actual path to your file

const renderBoard = (props: Partial<React.ComponentProps<typeof Board>>) => {
  const defaultProps = {
    xIsNext: true,
    squares: Array(9).fill(null),
    winner: undefined,
    gameOver: false,
    onPlay: vi.fn(),
  };
  const all = { ...defaultProps, ...props };
  return render(<Board {...all} />);
};

describe('Board component', () => {
  let onPlayMock: Mock;

  beforeEach(() => {
    onPlayMock = vi.fn();
  });

  it('renders correctly with initial state', () => {
    renderBoard({ onPlay: onPlayMock });
    expect(screen.getByText(/Next player: X/)).toBeInTheDocument();
  });

  it('displays the correct status based on the game state', () => {
    renderBoard({ xIsNext: false, onPlay: onPlayMock });
    expect(screen.getByText(/Next player: O/)).toBeInTheDocument();
  });

  it('calls onPlay with the correct arguments when a square is clicked', () => {
    renderBoard({ onPlay: onPlayMock });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onPlayMock).toHaveBeenCalledWith(expect.any(Array), { row: 0, column: 0 });
  });

  it('renders the correct winner status when there is a winner', () => {
    const winner = { player: 'X', move: [0, 1, 2] };
    renderBoard({ winner, onPlay: onPlayMock });
    expect(screen.getByText(/Winner: X/)).toBeInTheDocument();
  });

  it('renders draw status when all squares are filled without a winner', () => {
    renderBoard({ onPlay: onPlayMock, gameOver: true });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[5]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[6]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[7]);
    fireEvent.click(buttons[8]);
    expect(screen.getByText(/Draw/)).toBeInTheDocument();
  });

  it('updates the board when a square is clicked', () => {
    renderBoard({ onPlay: onPlayMock });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onPlayMock).toHaveBeenCalledWith(['X', null, null, null, null, null, null, null, null], { row: 0, column: 0 });
  });

  it('does not call onPlay when clicking a filled square or when there is a winner', () => {
    const squares = ['X', null, null, null, null, null, null, null, null];
    const winner = { player: 'X', move: [0, 1, 2] };
    renderBoard({ squares, onPlay: onPlayMock });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onPlayMock).not.toHaveBeenCalled();
    cleanup();
    renderBoard({ squares, winner, onPlay: onPlayMock });
    fireEvent.click(buttons[1]);
    expect(onPlayMock).not.toHaveBeenCalled();
  });
});
