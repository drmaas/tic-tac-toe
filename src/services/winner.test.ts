import { describe, test, expect } from 'vitest';
import { calculateWinner, Winner } from './winner';

describe('calculateWinner', () => {
    const testCases: [string, string[], Winner | undefined][] = [
        [
            'should return the winner when the first row is complete',
            ['X', 'X', 'X', '', '', '', '', '', ''],
            { player: 'X', move: [0, 1, 2] },
        ],
        [
            'should return the winner when the second row is complete',
            ['', '', '', 'X', 'X', 'X', '', '', ''],
            { player: 'X', move: [3, 4, 5] },
        ],  
        [
            'should return the winner when the third row is complete',
            ['', '', '', '', '', '', 'X', 'X', 'X'],
            { player: 'X', move: [6, 7, 8] },
        ],                
        [
            'should return the winner when the first column is complete',
            ['O', '', '', 'O', '', '', 'O', '', ''],
            { player: 'O', move: [0, 3, 6] },
        ],
        [
            'should return the winner when the second column is complete',
            ['', 'O', '', '', 'O', '', '', 'O', ''],
            { player: 'O', move: [1, 4, 7] },
        ],        
        [
            'should return the winner when the third column is complete',
            ['', '', 'O', '', '', 'O', '', '', 'O'],
            { player: 'O', move: [2, 5, 8] },
        ],        
        [
            'should return the winner when the diagonal is complete',
            ['X', '', '', '', 'X', '', '', '', 'X'],
            { player: 'X', move: [0, 4, 8] },
        ],
        [
            'should return the winner when the other diagonal is complete',
            ['', '', 'X', '', 'X', '', 'X', '', ''],
            { player: 'X', move: [2, 4, 6] },
        ],        
        [
            'should return undefined when there is no winner',
            ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'],
            undefined,
        ],
    ];

    test.each(testCases)('%s', (_, squares, expected) => {
        const result = calculateWinner(squares);
        expect(result).toEqual(expected);
    });
});
