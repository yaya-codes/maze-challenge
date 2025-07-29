/**
 * Represents a coordinate point in the grid as [x, y]
 */
export type Point = [number, number];

/**
 * Internal node representation for A* algorithm
 */
interface Node {
  point: Point;        // Grid coordinates
  g: number;          // Cost from start to this node
  h: number;          // Heuristic estimate from this node to goal
  f: number;          // Total cost (g + h)
  parent?: Node;      // Parent node for path reconstruction
}

/**
 * Calculates Manhattan distance between two points
 * Manhattan distance = |x1 - x2| + |y1 - y2|
 * This heuristic is admissible (never overestimates) and works well for grid-based pathfinding
 * 
 * @param a - First point
 * @param b - Second point
 * @returns Manhattan distance between the points
 */
function heuristic(a: Point, b: Point): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

/**
 * Finds valid neighboring cells (up, down, left, right) that are passable
 * Only considers orthogonal movement (no diagonals)
 * 
 * @param point - Current position
 * @param grid - 2D grid where 0 = passable, 1 = wall
 * @returns Array of valid neighboring points
 */
function neighbors(point: Point, grid: number[][]): Point[] {
  const [x, y] = point;
  const results: Point[] = [];
  
  // Check all 4 orthogonal directions
  if (x > 0 && grid[x - 1][y] === 0) results.push([x - 1, y]);         // Up
  if (x < grid.length - 1 && grid[x + 1][y] === 0) results.push([x + 1, y]); // Down
  if (y > 0 && grid[x][y - 1] === 0) results.push([x, y - 1]);         // Left
  if (y < grid[0].length - 1 && grid[x][y + 1] === 0) results.push([x, y + 1]); // Right
  
  return results;
}

/**
 * A* Pathfinding Algorithm Implementation
 * 
 * A* is an informed search algorithm that finds the optimal path from start to goal.
 * It uses a heuristic function to guide the search towards the goal efficiently.
 * 
 * Algorithm Process:
 * 1. Initialize open set with start node
 * 2. While open set is not empty:
 *    a. Select node with lowest f-score from open set
 *    b. Move it to closed set
 *    c. If it's the goal, reconstruct and return path
 *    d. For each neighbor:
 *       - Skip if in closed set
 *       - Calculate tentative g-score
 *       - Add to open set or update if better path found
 * 3. Return null if no path exists
 * 
 * @param grid - 2D array where 0 = passable, 1 = wall
 * @param start - Starting coordinates [x, y]
 * @param goal - Goal coordinates [x, y]
 * @param onVisit - Optional callback for visualizing search progress
 * @returns Array of points representing the path, or null if no path exists
 */
export function astar(
  grid: number[][],
  start: Point,
  goal: Point,
  onVisit?: (point: Point) => void
): Point[] | null {
  // Open set: nodes to be evaluated
  const openSet: Node[] = [];
  
  // Closed set: nodes already evaluated (using string keys for O(1) lookup)
  const closedSet = new Set<string>();

  /**
   * Creates a unique string key for a point for efficient set operations
   * @param p - Point to create key for
   * @returns String representation "x,y"
   */
  function nodeKey(p: Point): string {
    return p[0] + ',' + p[1];
  }

  // Initialize with start node
  const startNode: Node = {
    point: start,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal) // f = g + h, where g = 0 initially
  };
  openSet.push(startNode);

  // Main A* loop
  while (openSet.length > 0) {
    // Sort by f-score and select the most promising node
    // TODO: Consider using a priority queue for better performance
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    
    // Mark current node as evaluated
    closedSet.add(nodeKey(current.point));

    // Optional visualization callback
    if (onVisit) onVisit(current.point);

    // Check if we've reached the goal
    if (current.point[0] === goal[0] && current.point[1] === goal[1]) {
      // Reconstruct path by following parent pointers
      const path: Point[] = [];
      let curr: Node | undefined = current;
      while (curr) {
        path.push(curr.point);
        curr = curr.parent;
      }
      return path.reverse(); // Return path from start to goal
    }

    // Evaluate all neighbors of current node
    const nbrs = neighbors(current.point, grid);
    for (const nbr of nbrs) {
      const nbrKey = nodeKey(nbr);
      
      // Skip if already evaluated
      if (closedSet.has(nbrKey)) continue;
      
      // Calculate tentative g-score (cost from start to neighbor through current)
      const gScore = current.g + 1; // Movement cost is 1 for orthogonal moves

      // Check if neighbor is already in open set
      let openNode = openSet.find((n) => nodeKey(n.point) === nbrKey);
      
      if (!openNode) {
        // Neighbor not in open set, add it
        const hScore = heuristic(nbr, goal);
        openNode = {
          point: nbr,
          g: gScore,
          h: hScore,
          f: gScore + hScore,
          parent: current,
        };
        openSet.push(openNode);
      } else if (gScore < openNode.g) {
        // Found a better path to this neighbor, update it
        openNode.g = gScore;
        openNode.f = gScore + openNode.h;
        openNode.parent = current;
      }
    }
  }

  // No path found - goal is unreachable
  return null;
}

/**
 * Usage Example:
 * 
 * const maze = [
 *   [0, 0, 1, 0],
 *   [0, 1, 0, 0],
 *   [0, 0, 0, 1],
 *   [1, 0, 0, 0]
 * ];
 * 
 * const path = astar(maze, [0, 0], [3, 3]);
 * if (path) {
 *   console.log('Path found:', path);
 * } else {
 *   console.log('No path available');
 * }
 * 
 * // With visualization
 * const pathWithViz = astar(maze, [0, 0], [3, 3], (point) => {
 *   console.log('Visiting:', point);
 * });
 */