export type NodeTypeBox = 'Box';
export type NodeTypeWave = 'Wave';
export type NodeType = NodeTypeBox | NodeTypeWave;

export interface NodeRoot {
  id: string;
  type: NodeType;
  name: string;

  editorX: number;
  editorY: number;
}

export type NodeId = string;

export interface NodeBox extends NodeRoot {
  type: NodeTypeBox;
  x: number | NodeId;
  y: number | NodeId;
  width: number;
  height: number;
  // rotation: number;
  color: string;
  // image: string;
}

export interface NodeWave extends NodeRoot {
  waveform: 'sin' | 'cos' | 'tan';
  period: number;
  amplitude: number;
  frequency: number;
  offset: number;
  phase: number;
}

export type Node = NodeBox | NodeWave;

export type NodesObj = Record<string, Node>;
