import type {
  Node,
  NodesObj,
  NodeBox,
  NodeWave,
  NodeMap,
  NodeNumber,
  Color,
  NodeColor,
  NodeCircle,
  NodeAbsolute,
  NodeNoise,
  DataType,
} from '../types';

interface CanvasOpts {
  bgColor: [number, number, number];
}

function colorToVec3(color: Color): string {
  return `vec3(rgb(${color[0]}.0, ${color[1]}.0, ${color[2]}.0))`;
}

function numberToFloat(num: number): string {
  return Number.parseFloat(String(num || 0)).toFixed(1);
}

export default function createFragShader(
  canvasOpts: CanvasOpts,
  nodes: Node[],
  nodesObj: NodesObj
): string {
  const fns = {
    // math
    Wave: renderWave,
    Map: renderMap,
    Absolute: renderAbsolute,
    // constants
    Time: () => 'u_time',
    Resolution: () => 'u_resolution',
    Mouse: () => 'u_mouse',
    Number: (node: NodeNumber) => `${node.value}.0`,
    Color: (node: NodeColor) => colorToVec3(node.color)
  };

  function processNode(nodeId: string, fallback: string) {
    const node = nodesObj[nodeId];
    if (!node) return fallback;
    const nodeFn = fns[node.type];
    if (!nodeFn) return fallback;
    return nodeFn(node as Node);
  }

  function nodeOrVal(val: string | number | undefined, type?: 'color') {
    // default
    if (type === 'color') {
      return typeof val === 'string'
        ? processNode(val, '1.0')
        : colorToVec3(val);
    }
    // default to float
    if (!val) return '1.0';
    return typeof val === 'string'
      ? processNode(val, '1.0')
      : numberToFloat(val);
  }

  function renderWave(node: NodeWave): string {
    const n = node as NodeWave;
    return `${numberToFloat(n.amplitude)} * ${n.waveform}(${nodeOrVal(
      n.input
    )} / ${numberToFloat(n.frequency)})`;
  }

  function renderAbsolute(node: Node): string {
    const n = node as NodeAbsolute;
    return `abs(${nodeOrVal(n.input)})`;
  }

  function renderMap(node: NodeMap): string {
    return `map(${nodeOrVal(node.input)}, ${numberToFloat(
      node.min1
    )}, ${numberToFloat(node.max1)}, ${numberToFloat(
      node.min2
    )}, ${numberToFloat(node.max2)})`;
  }

  return `#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 rgb(float r, float g, float b) {
	return vec3(r / 255.0, g / 255.0, b / 255.0);
}

vec4 circle(vec2 uv, vec2 pos, float rad, vec3 color) {
	float d = length(pos - uv) - rad;
	float t = clamp(d, 0.0, 1.0);
	return vec4(color, 1.0 - t);
}

vec4 rectangle(vec2 uv, vec2 pos, float width, float height, vec3 color) {
	float t = 0.0;
	if ((uv.x > pos.x - width / 2.0) && (uv.x < pos.x + width / 2.0)
		&& (uv.y > pos.y - height / 2.0) && (uv.y < pos.y + height / 2.0)) {
		t = 1.0;
	}
	return vec4(color, t);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

const float e = 2.7182818284590452353602874713527;

vec4 noise(vec2 texCoord) {
  float G = e + (u_time * 0.010);
  vec2 r = (G * sin(G * texCoord.xy));
  return vec4(fract(r.x * r.y * (1.0 + texCoord.x)));
}

void main() {
	vec2 uv = gl_FragCoord.xy;
	vec2 center = u_resolution.xy * 0.5;

  // Background layer
	vec4 layerBG = vec4(${colorToVec3(canvasOpts.bgColor)}, 1.0);
	gl_FragColor = layerBG;

  ${nodes
    .map((node) => {
      if (node.type === 'Box') {
        const n = node as NodeBox;
        return `
  // Rectangle
  float ${n.id}Width = ${nodeOrVal(n.width)};
  float ${n.id}Height = ${nodeOrVal(n.height)};
  vec3 ${n.id}Color = ${nodeOrVal(n.color, 'color')};
  vec2 ${n.id}XY = vec2(uv.x, uv.y);
  ${n.id}XY.x += ${nodeOrVal(n.x)};
  ${n.id}XY.y += ${nodeOrVal(n.y)};
  vec4 layer${n.id} = rectangle(${n.id}XY, center, ${n.id}Width, ${
          n.id
        }Height, ${n.id}Color);
  gl_FragColor = mix(gl_FragColor, layer${n.id}, layer${n.id}.a);
`;
      }

      if (node.type === 'Circle') {
        const n = node as NodeCircle;
        return `
  // Circle
  vec3 ${n.id}Color = ${colorToVec3(n.color)};
  float ${n.id}Radius = ${nodeOrVal(n.radius)};
  vec2 ${n.id}XY = vec2(uv.x, uv.y);
  ${n.id}XY.x += ${nodeOrVal(n.x)};
  ${n.id}XY.y += ${nodeOrVal(n.y)};
	vec4 layer${n.id} = circle(${n.id}XY, center, ${n.id}Radius, ${n.id}Color);
  gl_FragColor = mix(gl_FragColor, layer${n.id}, layer${n.id}.a);
`;
      }

      if (node.type === 'Noise') {
        const n = node as NodeNoise;
        return `
          vec4 noiseLayer = noise(uv);
          gl_FragColor = mix(gl_FragColor, noiseLayer, ${numberToFloat(
            node.strength || 0
          )});
        `;
      }

      return '';
    })
    .join('')}

	// vec2 uv = gl_FragCoord.xy;
	// vec2 center = u_resolution.xy * 0.5;

  // vec2 x = vec2(0.5, 0.5);
  // vec2 mouse = (u_mouse.xy / u_resolution.xy);
  // vec2 grad = 2.0 * (mouse-x);
  // vec2 dist = (gl_FragCoord.xy / u_resolution.xy) - x;
  // vec3 col = vec3(dot(grad, dist, mouse) * 2.);
  // gl_FragColor = vec4(col, 1.0);
}

`;
}

/*
HOLDING PEN - 

// TODO
// float radius = 0.25 * u_resolution.y;
float ${n.id}Radius = abs(10.0 * sin(u_time));

*/
