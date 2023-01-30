export const nodesWithOutputs = [
  'Wave',
  'Map',
  'Absolute',
  'Resolution',
  'Time',
  'Number'
];

// NOTE: make sure this is also in possibleNodeConnectors below
export const nodesWithInputs = ['Wave', 'Map', 'Absolute'];

export const possibleNodeConnectors = {
  Box: ['height', 'width', 'x', 'y'],
  Circle: ['radius', 'x', 'y'],
  // Math
  Wave: ['input'],
  Map: ['input'],
  Absolute: ['input'],
  // constants
  Resolution: [],
  Time: [],
  Number: []
};
