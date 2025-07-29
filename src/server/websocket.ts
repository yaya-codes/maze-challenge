import { WebSocketServer } from 'ws';
import { astar, Point } from '../lib/astar';

interface MazeSolveMessage {
  type: 'solveMaze';
  maze: number[][];
  start: Point;
  goal: Point;
}

const wss = new WebSocketServer({ port: 8000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString()) as MazeSolveMessage;
      if (data.type === 'solveMaze') {
        const { maze, start, goal } = data;
        const visitedNodes: Point[] = [];
        const path = astar(maze, start, goal, (p) => visitedNodes.push(p));
        ws.send(JSON.stringify({
          type: 'mazeSolved',
          path,
          pathLength: path ? path.length : 0,
          visitedNodesCount: visitedNodes.length,
        }));
      }
    } catch (err) {
      console.error('Error solving maze:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8000');