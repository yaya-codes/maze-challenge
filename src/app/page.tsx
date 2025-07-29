'use client';

import { useState } from 'react';
import MazeGrid from '../components/MazeGrid';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  if (gameStarted) {
    return <MazeGrid onBackToMenu={handleBackToMenu} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Maze Challenge</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Welcome to the Maze Challenge! Navigate through the maze to reach the
          goal.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Start Game
          </button>
          <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-2 px-6 rounded-lg transition-colors">
            Instructions
          </button>
        </div>
      </main>
    </div>
  );
}
