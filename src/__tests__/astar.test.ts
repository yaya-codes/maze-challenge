import { astar } from '../lib/astar';

describe('A* Pathfinding', () => {
  it('finds shortest path in simple maze', () => {
    const maze = [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    const start ={ x: 0, y: 0 }; 
    const goal = { x: 2, y: 2 };

const result = astar(maze, [start.x, start.y], [goal.x, goal.y]);    
    
    expect(result).not.toBeNull();
    if(result) {
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual([start.x, start.y]);
      expect(result[result.length - 1]).toEqual([goal.x, goal.y]);
    }
  });

  it('finds path in a 20x20 empty maze', () => {
    const size = 20;
    const maze = Array.from({ length: size }, () => Array(size).fill(0));
    const start = { x: 0, y: 0 };
    const goal = { x: 19, y: 19 };

    const result = astar(maze, [start.x, start.y], [goal.x, goal.y]);

    expect(result).not.toBeNull();
    if (result) {
      expect(result[0]).toEqual([start.x, start.y]);
      expect(result[result.length - 1]).toEqual([goal.x, goal.y]);
      expect(result.length).toBeGreaterThan(0);
    }
  });
});