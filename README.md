# Maze Challenge

Interactive maze builder with real-time A* pathfinding visualization.

## Requirements Implementation

**Frontend**
- Single page (App Router)
- Grid editor (20 × 20) – click toggles wall/free space
- Set start & goal points
- "Solve" button triggers async search – live animation of exploration via WebSocket events
- After completion: show path line, path length, visited nodes count

**Backend**
- POST /solve accepts maze array
- Implement shortest path with A* (no external path finding packages)
- Stream progress via WebSocket for live animation to frontend

## Tech Stack

- Next.js 15.4.4 + React 19
- TypeScript
- Tailwind CSS
- WebSocket (ws)
- Jest

## Project Structure

```
src/
├── app/
│   └── api/solve/          # REST API endpoint
├── components/             # React components
├── lib/astar.ts           # A* algorithm
└── server/websocket.ts    # WebSocket server
```

## Quick Start

```bash
npm install

# Websocket
npm run ws-server

# Dev 
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Select Wall, Start, or Goal mode
2. Click grid cells to build maze 
3. Click "Solve Maze" to watch live pathfinding
4. View path, clear Path, length, and visited nodes count

## API

**REST Endpoint**
```bash
POST http://localhost:3000/api/solve
```

**WebSocket Messages**
```json
// Start solving
{ "type": "solvingStarted" }

// Live exploration
{ "type": "nodeVisited", "point": [2,3] }

// Final result
{ "type": "mazeSolved", "path": [...], "pathLength": 15 }
```

## A* Algorithm

Custom implementation with Manhattan distance heuristic. No external pathfinding libraries.

```typescript
astar(grid: number[][], start: Point, goal: Point): Point[] | null
```

## Scripts

```bash
npm run dev        # Next.js development
npm run ws-server  # WebSocket server
npm test           # Run tests
npm run build      # Production build
```

## Testing

Jest tests cover algorithm correctness, pathfinding scenarios, and edge cases.

Built with TypeScript and custom A* pathfinding.
