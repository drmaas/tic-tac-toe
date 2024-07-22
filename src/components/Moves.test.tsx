/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Moves } from './Moves';
import { History } from '../types/history';

const sampleHistory: History[] = [
  { boardState: Array(9).fill(null), coords: { row: 0, column: 0 } },
  { boardState: Array(9).fill(null), coords: { row: 1, column: 1 } },
];

let jumpTo: Mock;

beforeEach(() => {
    jumpTo = vi.fn();
});

describe('Moves component', () => {
  it('renders correctly with initial state', () => {
    render(
      <Moves
        history={sampleHistory}
        sort={true}
        currentMove={0}
        winner={undefined}
        jumpTo={jumpTo}
      />
    );
    expect(screen.getByText(/You are at game start/)).toBeInTheDocument();
    expect(screen.getByText(/Go to move #1 \(1, 1\)/)).toBeInTheDocument();
  });

  it('displays the current move correctly', () => {
    render(
      <Moves
        history={sampleHistory}
        sort={true}
        currentMove={1}
        winner={undefined}
        jumpTo={jumpTo}
      />
    );
    expect(screen.getByText(/Go to game start/)).toBeInTheDocument();
    expect(screen.getByText(/You are at move #1 \(1, 1\)/)).toBeInTheDocument();
  });

  it('calls jumpTo with the correct move number', () => {
    render(
      <Moves
        history={sampleHistory}
        sort={true}
        currentMove={0}
        winner={undefined}
        jumpTo={jumpTo}
      />
    );
    fireEvent.click(screen.getByText(/Go to move #1 \(1, 1\)/));
    expect(jumpTo).toHaveBeenCalledWith(1);
  });

  it('renders moves in reverse order when sort is false', () => {
    render(
      <Moves
        history={sampleHistory}
        sort={false}
        currentMove={0}
        winner={undefined}
        jumpTo={jumpTo}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Go to move #1 (1, 1)');
    expect(items[1]).toHaveTextContent('You are at game start');
  });

  it('displays winner message if there is a winner', () => {
    const winner = { player: 'X', move: [0, 1, 2] };
    render(
      <Moves
        history={sampleHistory}
        sort={true}
        currentMove={1}
        winner={winner}
        jumpTo={jumpTo}
      />
    );
    expect(screen.getByText(/Game won by X/)).toBeInTheDocument();
  });
});
