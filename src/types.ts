export type NodeTypeBox = 'Box';
export type NodeTypeWave = 'Wave';
export type NodeTypeCircle = 'Circle';
export type NodeTypeMap = 'Map';
export type NodeTypeAbsolute = 'Absolute';
export type NodeType =
  | NodeTypeBox
  | NodeTypeWave
  | NodeTypeCircle
  | NodeTypeMap
  | NodeTypeAbsolute;

export interface NodeRoot {
  id: string;
  type: NodeType;
  name: string;

  editorX: number;
  editorY: number;
}

export type NodeId = string;

export type Color = [number, number, number];

export interface NodeBox extends NodeRoot {
  type: NodeTypeBox;
  x: number | NodeId;
  y: number | NodeId;
  width: number;
  height: number;
  color: Color;
}

export interface NodeCircle extends NodeRoot {
  type: NodeTypeCircle;
  x: number | NodeId;
  y: number | NodeId;
  radius: number;
  color: Color;
}

export interface NodeWave extends NodeRoot {
  type: NodeTypeWave;
  waveform: 'sin' | 'cos' | 'tan';
  period: number;
  amplitude: number;
  frequency: number;
  offset: number;
  phase: number;
}

export interface NodeMap extends NodeRoot {
  type: NodeTypeCircle;
  input: undefined | NodeId;
  min1: number;
  max1: number;
  min2: number;
  max2: number;
}

export interface NodeAbsolute extends NodeRoot {
  type: NodeTypeCircle;
  input: undefined | NodeId;
}

export type Node = NodeBox | NodeWave | NodeCircle | NodeMap | NodeAbsolute;

export type NodesObj = Record<string, Node>;

export interface RenderOpts {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  frame: number;
}

export interface Position {
  x: number;
  y: number;
}
