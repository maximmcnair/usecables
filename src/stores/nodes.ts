import { writable } from 'svelte/store';
import type { Node, NodesObj, NodeBox, NodeWave } from '$types';

import colors from '$lib/colors';
import uid from '$lib/uid';

interface NodeStore {
  nodes: Node[];
  nodesObj: NodesObj;
}

const waveSin1Id = uid();

const defaultState: NodeStore = {
  nodes: [
    {
      id: uid(),
      type: 'Box',
      name: 'Box',
      // x: 0,
      x: waveSin1Id,
      y: 10,
      width: 100,
      height: 100,
      color: colors.purple,
      editorX: 464,
      editorY: 197
    },
    {
      id: waveSin1Id,
      type: 'Wave',
      name: 'Wave',
      waveform: 'sin',
      period: 10,
      amplitude: 147,
      frequency: 2,
      offset: 0,
      phase: 0,
      editorX: 109,
      editorY: 168
    }
    // {
    //   id: uid(),
    //   type: 'Wave',
    //   name: 'Wave',
    //   waveform: 'sin',
    //   period: 10,
    //   amplitude: 122,
    //   frequency: 10,
    //   offset: 0,
    //   phase: 0,
    //   editorX: 138,
    //   editorY: 547
    // },
    // {
    //   id: uid(),
    //   type: 'Box',
    //   name: 'box 2',
    //   x: 200,
    //   y: 200,
    //   width: 200,
    //   height: 100,
    //   color: colors.blue,
    //   editorX: 865,
    //   editorY: 464
    // }
  ],
  nodesObj: {}
};

function createNodesObj(nds: Node[]): NodesObj {
  return nds.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {} as NodesObj);
}

defaultState.nodesObj = createNodesObj(defaultState.nodes);

const nodesStore = writable<NodeStore>(defaultState);

export default nodesStore;

export function nodeUpdate(nodeId: string, updatedNode: Partial<Node>) {
  nodesStore.update(({ nodes }) => {
    const updatedNodes: Node[] = nodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          ...(updatedNode as Node)
        };
      }
      return n;
    });

    return {
      nodes: updatedNodes,
      nodesObj: createNodesObj(updatedNodes)
    };
  });
}

export function nodeCreate(node: Omit<NodeBox | NodeWave, 'id'>): void {
  const newNode: Node = {
    ...node,
    id: uid()
  };

  nodesStore.update(({ nodes }) => {
    const updatedNodes = [...nodes, newNode];
    return {
      nodes: updatedNodes,
      nodesObj: createNodesObj(updatedNodes)
    };
  });
}

export function nodeDelete(nodeId: string): void {
  nodesStore.update(({ nodes }) => {
    const updatedNodes = nodes.filter(n => {
      return n.id != nodeId;
    });

    return {
      nodes: updatedNodes,
      nodesObj: createNodesObj(updatedNodes)
    };
  });
}
