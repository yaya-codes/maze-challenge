import { NextResponse } from 'next/server';
import { astar, Point } from '../../../lib/astar';

export async function POST(req: Request) {
  try {
    const body = await req.json() as unknown;
    const { maze, start, goal } = body as { maze: number[][]; start: Point; goal: Point };

    // Validate input here (optional but recommended)

    const visitedNodes: Point[] = [];
    const onVisit = (point: Point) => {
      visitedNodes.push(point);
    };

    const path = astar(maze, start, goal, onVisit);

    return NextResponse.json({
      path, // array of points or null
      pathLength: path ? path.length : 0,
      visitedNodesCount: visitedNodes.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}