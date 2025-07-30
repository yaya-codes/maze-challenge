'use client';

import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { mazeGridStyles, CellType, ModeType } from './MazeGrid.styles';

const SIZE = 20;

interface MazeGridProps {
  /**  callback to return to main menu */
  onBackToMenu?: () => void;
}

/**
 * MazeGrid Component
 * 
 * Interactive maze builder and solver that allows users to:
 * - Create walls by clicking grid cells
 * - Set start and goal points
 * - Solve maze using A* algorithm via WebSocket
 * - View real-time pathfinding results
 * - Clear grid or just the solution path
 * 
 * Features:
 * - 20x20 clickable grid
 * - Three modes: Wall, Start, Goal
 * - WebSocket connection for real-time solving
 * - Visual feedback for connection status
 * - Path visualization and statistics
 */
export default function MazeGrid({ onBackToMenu }: MazeGridProps) {
  // ==================== STATE MANAGEMENT ====================
  
  /** 2D array representing the maze grid state */
  const [grid, setGrid] = useState<CellType[][]>(
    Array.from({ length: SIZE }, () => Array(SIZE).fill('empty'))
  );
  
  /** Start position coordinates [row, col] or null if not set */
  const [start, setStart] = useState<[number, number] | null>(null);
  
  /** Goal position coordinates [row, col] or null if not set */
  const [goal, setGoal] = useState<[number, number] | null>(null);
  
  /** Current interaction mode - determines what happens on cell click */
  const [mode, setMode] = useState<ModeType>('wall');
  
  /** WebSocket connection status indicator */
  const [isConnected, setIsConnected] = useState(false);
  
  /** Whether maze is currently being solved */
  const [isSolving, setIsSolving] = useState(false);
  
  /** WebSocket connection reference */
  const ws = useRef<WebSocket | null>(null);

  // ==================== WEBSOCKET CONNECTION ====================
  
  /**
   * Initialize WebSocket connection and event handlers
   * Connects to localhost:8000 for real-time maze solving
   */
  useEffect(() => {
    // Create WebSocket connection
    ws.current = new WebSocket('ws://localhost:8000');
    
    /**
     * Handle successful WebSocket connection
     */
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    
    /**
     * Handle WebSocket disconnection
     */
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    
    /**
     * Handle incoming WebSocket messages
     * Currently handles 'mazeSolved' message type with path data
     */
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'mazeSolved') {
        const { path } = message;
        
        setGrid((prev) => {
          const newGrid = prev.map((row) => [...row]);
          
          // Clear any existing path cells
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              if (newGrid[i][j] === 'path') {
                newGrid[i][j] = 'empty';
              }
            }
          }
          
          // Draw the solution path
          if (path) {
            for (const [r, c] of path) {
              // Only mark as path if cell is not start, goal, or wall
              if (!['start', 'goal', 'wall'].includes(newGrid[r][c])) {
                newGrid[r][c] = 'path';
              }
            }
          }
          
          // Ensure start and goal points remain visible
          if (start) newGrid[start[0]][start[1]] = 'start';
          if (goal) newGrid[goal[0]][goal[1]] = 'goal';
          return newGrid;
        });
        
        setIsSolving(false);
      }
    };
    
    // Cleanup WebSocket connection on component unmount
    return () => ws.current?.close();
  }, [start, goal]); // Re-run when start or goal changes

  // ==================== EVENT HANDLERS ====================
  
  /**
   * Handle grid cell clicks based on current mode
   * @param row - Row index of clicked cell (0-19)
   * @param col - Column index of clicked cell (0-19)
   */
  const handleClick = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      if (mode === 'wall') {
        // Toggle wall: empty ↔ wall
        newGrid[row][col] = newGrid[row][col] === 'wall' ? 'empty' : 'wall';
      } else if (mode === 'start') {
        // Clear previous start position if exists
        if (start) newGrid[start[0]][start[1]] = 'empty';
        // Set new start position
        newGrid[row][col] = 'start';
        setStart([row, col]);
      } else if (mode === 'goal') {
        // Clear previous goal position if exists
        if (goal) newGrid[goal[0]][goal[1]] = 'empty';
        // Set new goal position
        newGrid[row][col] = 'goal';
        setGoal([row, col]);
      }
      return newGrid;
    });
  };

  /**
   * Initiate maze solving via WebSocket
   * Validates prerequisites and sends maze data to solver
   */
  const handleSolve = () => {
    // Validate that both start and goal are set
    if (!start || !goal) {
      alert('Set both start and goal points first.');
      return;
    }
    
    // Validate WebSocket connection
    if (!isConnected) {
      alert('WebSocket not connected. Please try again.');
      return;
    }
    
    setIsSolving(true);
    
    // Convert grid to numeric format for A* algorithm
    // 0 = passable, 1 = wall
    const numericMaze = grid.map((row) =>
      row.map((cell) => (cell === 'wall' ? 1 : 0))
    );
    
    // Send solve request via WebSocket
    ws.current?.send(
      JSON.stringify({
        type: 'solveMaze',
        maze: numericMaze,
        start,
        goal,
      })
    );
  };

  /**
   * Reset entire grid to empty state
   * Clears all walls, start, goal, and path
   */
  const clearGrid = () => {
    setGrid(Array.from({ length: SIZE }, () => Array(SIZE).fill('empty')));
    setStart(null);
    setGoal(null);
  };

  /**
   * Clear only the solution path
   * Keeps walls, start, and goal intact
   */
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

  // ==================== STYLING HELPERS ====================
  
  /**
   * Get CSS classes for grid cells based on cell type
   * @param cell - The cell type (empty, wall, start, goal, path)
   * @returns Combined CSS class string
   */
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

  /**
   * Get CSS classes for mode selection buttons
   * @param m - The mode type (wall, start, goal)
   * @returns Combined CSS class string with active/inactive styling
   */
  const getModeButtonClasses = (m: ModeType) => {
    const { base, active, inactive } = mazeGridStyles.modeButton;
    return mode === m ? `${base} ${active[m]}` : `${base} ${inactive}`;
  };

  // ==================== COMPONENT DATA ====================
  
  /** Configuration for mode selection buttons */
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
              {/* check websocket connection */}
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
            
            {/* Mode Selection Buttons */}
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
              {/* Solve Maze Button */}
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
              
              {/* Clear Path Button */}
              <button onClick={clearPath} className={mazeGridStyles.clearPathButton}>
                Clear Path
              </button>
              
              {/* Clear Grid Button */}
              <button onClick={clearGrid} className={mazeGridStyles.clearGridButton}>
                Clear Grid
              </button>
              
              {/* Back to Menu Button */}
              {onBackToMenu && (
                <button onClick={onBackToMenu} className={mazeGridStyles.backButton}>
                  Back to Menu
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid Section - Interactive Maze Grid */}
        <div className={mazeGridStyles.gridContainer}>
          <div className={mazeGridStyles.gridCenter}>
            <div className={mazeGridStyles.gridWrapper}>
              {/* Main 20x20 Grid */}
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
              {/* Start Position Status */}
              <span className={mazeGridStyles.statusItem}>
                <div className={mazeGridStyles.statusIcon.start}></div>
                Start: {start ? `(${start[0]}, ${start[1]})` : 'Not set'}
              </span>
              
              {/* Goal Position Status */}
              <span className={mazeGridStyles.statusItem}>
                <div className={mazeGridStyles.statusIcon.goal}></div>
                Goal: {goal ? `(${goal[0]}, ${goal[1]})` : 'Not set'}
              </span>
              
              {/* Path Length Status */}
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