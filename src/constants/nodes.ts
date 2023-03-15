export const nodesWithOutputs = [
  'Wave',
  'Map',
  'Absolute',
  // constants
  'Mouse',
  'Resolution',
  'Time',
  'Number',
  'Color'
];

// NOTE: make sure this is also in possibleNodeConnectors below
export const nodesWithInputs = ['Wave', 'Map', 'Absolute'];

export const possibleNodeConnectors = {
  Box: ['height', 'width', 'color', 'x', 'y'],
  Circle: ['radius', 'color', 'x', 'y'],
  // Math
  Wave: ['input'],
  Map: ['input'],
  Absolute: ['input'],
  // constants
  Mouse: [],
  Resolution: [],
  Time: [],
  Number: [],
  Color: [],
  // effects
  Noise: [],
};
