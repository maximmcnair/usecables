export type NodeTypeBox = 'Box';
export type NodeTypeWave = 'Wave';
export type NodeTypeCircle = 'Circle';
export type NodeType = NodeTypeBox | NodeTypeWave | NodeTypeCircle;

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
  waveform: 'sin' | 'cos' | 'tan';
  period: number;
  amplitude: number;
  frequency: number;
  offset: number;
  phase: number;
}

export type Node = NodeBox | NodeWave | NodeCircle;

export type NodesObj = Record<string, Node>;

export interface RenderOpts {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  frame: number;
}

