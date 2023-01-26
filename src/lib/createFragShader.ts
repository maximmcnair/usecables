import type { Node, NodesObj, NodeBox, Color } from '../types';

interface CanvasOpts {
  canvasWidth: number;
  canvasHeight: number;
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
    Wave: renderWave
    // Box: renderBox
  };

  function processNode(nodeId: string) {
    const node = nodesObj[nodeId];
    const nodeFn = fns[node.type];
    return nodeFn(node as Node);
  }

  function nodeOrVal(val: string | number) {
    return typeof val === 'string' ? processNode(val) : numberToFloat(val);
  }

  function renderWave(node: Node) {
    return `${numberToFloat(node.amplitude)} * ${node.waveform}(u_time / ${numberToFloat(node.frequency)})`;
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
        return `
  // Rectangle
  float ${node.id}Width = ${node.width}.0;
  float ${node.id}Height = ${node.height}.0;
  vec3 ${node.id}Color = ${colorToVec3(node.color)};
  vec2 ${node.id}XY = vec2(uv.x, uv.y);
  // ${node.id}XY.x += ${node.x}.0;
  ${node.id}XY.x += ${nodeOrVal(node.x)};
  ${node.id}XY.y += ${node.y}.0;
  vec4 layer${node.id} = rectangle(${node.id}XY, center, ${node.id}Width, ${
          node.id
        }Height, ${node.id}Color);
  gl_FragColor = mix(gl_FragColor, layer${node.id}, layer${node.id}.a);
`;
      }

      if (node.type === 'Circle') {
        return `
  // Circle
  vec3 ${node.id}Color = ${colorToVec3(node.color)};
  float ${node.id}Radius = ${node.radius}.0;
	// float radius = 0.25 * u_resolution.y;
  vec2 ${node.id}XY = vec2(uv.x, uv.y);
  ${node.id}XY.x += ${node.x}.0;
  ${node.id}XY.y += ${node.y}.0;
	vec4 layer${node.id} = circle(${node.id}XY, center, ${node.id}Radius, ${
          node.id
        }Color);
  gl_FragColor = mix(gl_FragColor, layer${node.id}, layer${node.id}.a);
`;
      }

      return '';
    })
    .join('')}
}`;
}
