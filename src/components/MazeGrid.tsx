'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { mazeGridStyles, CellType, ModeType } from './MazeGrid.styles';

const SIZE = 20;

interface MazeGridProps {
  onBackToMenu?: () => void;
}

export default function MazeGrid({ onBackToMenu }: MazeGridProps) {
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: SIZE }, () => Array(SIZE).fill('empty'))
  );
  const [start, setStart] = useState<[number, number] | null>(null);
  const [goal, setGoal] = useState<[number, number] | null>(null);
  const [mode, setMode] = useState<ModeType>('wall');
  const [isConnected, setIsConnected] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000');
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'mazeSolved') {
        const { path } = message;
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          
          // Clear previous path
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              if (newGrid[i][j] === 'path') {
                newGrid[i][j] = 'empty';
              }
            }
          }
          
          // Add new path
          if (path) {
            for (const [r, c] of path) {
              if (!['start', 'goal', 'wall'].includes(newGrid[r][c])) {
                newGrid[r][c] = 'path';
              }
            }
          }
          
          // Ensure start and goal remain visible
          if (start) newGrid[start[0]][start[1]] = 'start';
          if (goal) newGrid[goal[0]][goal[1]] = 'goal';
          return newGrid;
        });
        setIsSolving(false);
      }
    };
    
    return () => ws.current?.close();
  }, [start, goal]);

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

  const handleSolve = () => {
    if (!start || !goal) {
      alert('Set both start and goal points first.');
      return;
    }
    if (!isConnected) {
      alert('WebSocket not connected. Please try again.');
      return;
    }
    
    setIsSolving(true);
    const numericMaze = grid.map((row) =>
      row.map((cell) => (cell === 'wall' ? 1 : 0))
    );
    
    ws.current?.send(
      JSON.stringify({
        type: 'solveMaze',
        maze: numericMaze,
        start,
        goal,
      })
    );
  };

  const clearGrid = () => {
    setGrid(Array.from({ length: SIZE }, () => Array(SIZE).fill('empty')));
    setStart(null);
    setGoal(null);
  };

  const clearPath = () => {
    setGrid((prev) => {
      const newGrid = prev.map((row) => [...row]);
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          if (newGrid[i][j] === 'path') {
            newGrid[i][j] = 'empty';
          }
        }
      }
      return newGrid;
    });
  };

  const getCellClasses = (cell: CellType) => {
    const { base, empty, wall, start, goal, path } = mazeGridStyles.cell;
    switch (cell) {
      case 'empty': return `${base} ${empty}`;
      case 'wall': return `${base} ${wall}`;
      case 'start': return `${base} ${start}`;
      case 'goal': return `${base} ${goal}`;
      case 'path': return `${base} ${path}`;
      default: return base;
    }
  };

  const getModeButtonClasses = (m: ModeType) => {
    const { base, active, inactive } = mazeGridStyles.modeButton;
    return mode === m ? `${base} ${active[m]}` : `${base} ${inactive}`;
  };

  const modeOptions = [
    { mode: 'wall' as ModeType, label: 'Wall', icon: '🧱' },
    { mode: 'start' as ModeType, label: 'Start', icon: '🚀' },
    { mode: 'goal' as ModeType, label: 'Goal', icon: '🎯' }
  ];

  return (
    <div className={mazeGridStyles.container}>
      <div className={mazeGridStyles.maxWidth}>
        
        {/* Header */}
        <div className={mazeGridStyles.header}>
          <h1 className={mazeGridStyles.title}>Maze Challenge</h1>
          <div className={mazeGridStyles.statusContainer}>
            <span className={clsx(
              mazeGridStyles.connectionStatus.base,
              isConnected 
                ? mazeGridStyles.connectionStatus.connected
                : mazeGridStyles.connectionStatus.disconnected
            )}>
              <div className={clsx(
                mazeGridStyles.connectionStatus.indicator.base,
                isConnected 
                  ? mazeGridStyles.connectionStatus.indicator.connected
                  : mazeGridStyles.connectionStatus.indicator.disconnected
              )}></div>
              {isConnected ? 'WebSocket connected' : 'WebSocket Disconnected'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className={mazeGridStyles.controlsContainer}>
          <div className={mazeGridStyles.controlsLayout}>
            <div className={mazeGridStyles.modeSection}>
                <h3 className={mazeGridStyles.modeLabel}>Select :</h3>
              {modeOptions.map(({ mode: m, label, icon }) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={getModeButtonClasses(m)}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
            
            <div className={mazeGridStyles.buttonGroup}>
              <button
                onClick={handleSolve}
                disabled={!start || !goal || !isConnected || isSolving}
                className={clsx(
                  mazeGridStyles.solveButton.base,
                  (!start || !goal || !isConnected || isSolving)
                    ? mazeGridStyles.solveButton.disabled
                    : mazeGridStyles.solveButton.enabled
                )}
              >
                {isSolving ? (
                  <>
                    <div className={mazeGridStyles.spinner}></div>
                    Solving...
                  </>
                ) : (
                  <>
                    <span>🧠</span>
                    Solve Maze
                  </>
                )}
              </button>
              <button onClick={clearPath} className={mazeGridStyles.clearPathButton}>
                Clear Path
              </button>
              <button onClick={clearGrid} className={mazeGridStyles.clearGridButton}>
                Clear Grid
              </button>
              {onBackToMenu && (
                <button onClick={onBackToMenu} className={mazeGridStyles.backButton}>
                  Back to Menu
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid Container */}
        <div className={mazeGridStyles.gridContainer}>
          <div className={mazeGridStyles.gridCenter}>
            <div className={mazeGridStyles.gridWrapper}>
              <div 
                className={mazeGridStyles.grid}
                style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleClick(rowIndex, colIndex)}
                      className={getCellClasses(cell)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className={mazeGridStyles.statusSection}>
            <div className={mazeGridStyles.statusLayout}>
              <span className={mazeGridStyles.statusItem}>
                <div className={mazeGridStyles.statusIcon.start}></div>
                Start: {start ? `(${start[0]}, ${start[1]})` : 'Not set'}
              </span>
              <span className={mazeGridStyles.statusItem}>
                <div className={mazeGridStyles.statusIcon.goal}></div>
                Goal: {goal ? `(${goal[0]}, ${goal[1]})` : 'Not set'}
              </span>
              <span className={mazeGridStyles.statusItem}>
                <div className={mazeGridStyles.statusIcon.path}></div>
                Path: {grid.flat().filter(cell => cell === 'path').length} cells
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}