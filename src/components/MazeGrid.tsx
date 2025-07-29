'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

const SIZE = 20;
type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'path';

export default function MazeGrid() {
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: SIZE }, () => Array(SIZE).fill('empty'))
  );
  const [start, setStart] = useState<[number, number] | null>(null);
  const [goal, setGoal] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<'wall' | 'start' | 'goal'>('wall');

  const handleClick = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      if (mode === 'wall') {
        newGrid[row][col] = newGrid[row][col] === 'wall' ? 'empty' : 'wall';
      } else if (mode === 'start') {
        if (start) newGrid[start[0]][start[1]] = 'empty';
        newGrid[row][col] = 'start';
        setStart([row, col]);
      } else if (mode === 'goal') {
        if (goal) newGrid[goal[0]][goal[1]] = 'empty';
        newGrid[row][col] = 'goal';
        setGoal([row, col]);
      }
      return newGrid;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['wall', 'start', 'goal'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={clsx(
              'px-4 py-2 border rounded text-black',
              mode === m ? 'bg-blue-500 text-white' : 'bg-white'
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-20 gap-px bg-gray-400 w-fit">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              className={clsx(
                'w-6 h-6 cursor-pointer',
                cell === 'empty' && 'bg-white',
                cell === 'wall' && 'bg-black',
                cell === 'start' && 'bg-blue-500',
                cell === 'goal' && 'bg-red-500',
                cell === 'path' && 'bg-yellow-400'
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}