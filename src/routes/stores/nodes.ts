import { writable } from 'svelte/store';
import type { Node, NodesObj } from '../types';

interface NodeStore {
  nodes: Node[];
  nodesObj: NodesObj;
}

const defaultState: NodeStore = {
  nodes: [
    { id: 'box-1',
      type: 'Box',
      name: 'Box',
      x: 'wave-1',
      y: 'wave-2',
      width: 100,
      height: 100,
      color: 'red',
      editorX: 464,
      editorY: 197,
    },
    { id: 'wave-1',
      type: 'Wave',
      name: 'Wave',
      waveform: 'sin',
      period: 10,
      amplitude: 147,
      frequency: 100,
      offset: 0,
      phase: 0,
      editorX: 109,
      editorY: 168,
    },
    { id: 'wave-2',
      type: 'Wave',
      name: 'Wave',
      waveform: 'sin',
      period: 10,
      amplitude: 122,
      frequency: 10,
      offset: 0,
      phase: 0,
      editorX: 138,
      editorY: 547,
    },
    // { id: 'box-2',
    //   type: 'Box',
    //   name: 'box 2',
    //   x: 200,
    //   y: 200,
    //   width: 200,
    //   height: 100,
    //   color: 'blue',
    //   editorX: 865,
    //   editorY: 464,
    // },
  ],
  nodesObj: {}
};

function createNodesObj(nds: Node[]): NodesObj {
  return nds.reduce((acc, val) => {
    acc[val.id] = val;
    return acc;
  }, {} as NodesObj)
}

defaultState.nodesObj = createNodesObj(defaultState.nodes);

const nodesStore = writable<NodeStore>(defaultState);

export default nodesStore;

export function nodeUpdate(nodeId: string, updatedNode: Partial<Node>){
  nodesStore.update(({ nodes }) => {
    const updatedNodes: Node[] = nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          ...updatedNode as Node,
        }
      }
      return n;
    });

    return {
      nodes: updatedNodes,
      nodesObj: createNodesObj(updatedNodes),
    }
  });
} 

