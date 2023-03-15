import type { Color } from '$types';

const colors: Record<string, Color> = {
  purple: [105, 48, 195],
  blue: [78, 168, 222],
  red: [229, 56, 59]
};


export function componentToHex(c: number) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export default colors;
