import type { Position } from '$types';

export function createCurvedLinePath(start: Position, end: Position): string {
  const curveAmount = 30;

  const p1: Position = {
    x: start.x,
    y: start.y
  };
  const p2: Position = {
    x: start.x + curveAmount,
    y: start.y
  };
  const p3: Position = {
    x: end.x - curveAmount,
    y: end.y
  };
  const p4: Position = {
    x: end.x,
    y: end.y
  };

  return `
M ${p1.x}, ${p1.y}
C ${p2.x}, ${p2.y}
  ${p3.x}, ${p3.y}
  ${p4.x}, ${p4.y}
`;
  // NOTE this is a straight line
  // return `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
}
