# Maze Challenge

Next.js application that finds and visualises the shortest path through
a maze.

## Features

- Build custom mazes with walls, start, and goal points
- A* algorithm finds optimal paths
- Real-time solving via WebSocket
- Clean, responsive UI
- TypeScript for type safety

## Project Structure

```
src/
├── __tests__/              # Tests
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # A* algorithm
└── server/                 # WebSocket server
```

## Tech Stack

- Next.js 15.4.4 + React 19
- TypeScript
- Tailwind CSS
- Jest
- WebSocket (ws)

## Quick Start

```bash
# Install
npm install

# Start WebSocket server
npm run ws-server

# Start app (in new terminal)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. Select mode: Wall, Start, or Goal
2. Click grid cells to build maze
3. Click "Solve Maze" for optimal path
4. Use "Clear" buttons to reset

## A* Algorithm

- **Input**: 2D grid, start point, goal point
- **Output**: Optimal path or null
- **Heuristic**: Manhattan distance
- **Movement**: Orthogonal only (no diagonals)

```typescript
astar(grid: number[][], start: Point, goal: Point): Point[] | null
```

## WebSocket API

**Client → Server:**
```json
{
  "type": "solveMaze",
  "maze": [[0,1,0], [0,0,0]],
  "start": [0,0],
  "goal": [1,2]
}
```

**Server → Client:**
```json
{
  "type": "mazeSolved", 
  "path": [[0,0], [1,0], [1,1], [1,2]],
  "pathLength": 4
}
```

## Scripts

```bash
npm run dev        # Development server
npm run ws-server  # WebSocket server  
npm test           # Run tests
npm run build      # Production build
```

## Testing

Jest with TypeScript support. Tests cover:
- A* algorithm correctness
- Path finding scenarios
- Edge cases

```bash
npm test
```

Built with Next.js, TypeScript, and A* pathfinding.
