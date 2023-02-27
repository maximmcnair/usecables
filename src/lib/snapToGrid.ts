const GRID_SIZE = 10;

export function snapToGrid(pos: number): number {
  return Math.round(pos / GRID_SIZE) * GRID_SIZE;
}
