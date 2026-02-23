/**
 * Collection of GLSL fragment shaders for p5.js
 * Each shader receives:
 * - u_resolution: vec2 (canvas width, height)
 * - u_time: float (elapsed time in seconds)
 * - u_mouse: vec2 (mouse x, y position)
 */

// Default vertex shader for p5.js (required for all shaders)
export const defaultVertexShader = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

// Shader collection
export const shaders = {
  none: {
    name: "None",
    description: "No shader background",
    fragmentShader: null
  },

  plasma: {
    name: "Plasma Wave",
    description: "Flowing plasma energy",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float wave1 = sin(uv.x * 10.0 + u_time * 0.5);
  float wave2 = cos(uv.y * 10.0 - u_time * 0.3);
  float wave3 = sin((uv.x + uv.y) * 8.0 + u_time * 0.4);

  float color = (wave1 + wave2 + wave3) * 0.5 + 0.5;

  vec3 col1 = vec3(0.5, 0.2, 0.8);
  vec3 col2 = vec3(0.2, 0.5, 1.0);
  vec3 finalColor = mix(col1, col2, color);

  gl_FragColor = vec4(finalColor, 1.0);
}
    `
  },

  ripples: {
    name: "Ripples",
    description: "Concentric water ripples",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 center = vec2(0.5, 0.5);

  float dist = length(uv - center);
  float ripple = sin(dist * 30.0 - u_time * 2.0) * 0.5 + 0.5;

  vec3 color = vec3(ripple * 0.3, ripple * 0.6, ripple * 0.9);

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  tunnel: {
    name: "Tunnel",
    description: "Infinite tunnel effect",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 center = uv - 0.5;

  float angle = atan(center.y, center.x);
  float radius = length(center);

  float tunnel = mod(1.0 / radius + u_time * 0.5, 1.0);
  float spiral = sin(angle * 8.0 + u_time) * 0.5 + 0.5;

  vec3 color = vec3(tunnel * spiral, tunnel * 0.5, spiral * 0.8);

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  aurora: {
    name: "Aurora",
    description: "Northern lights effect",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

// Simple noise function
float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float wave1 = sin(uv.x * 3.0 + u_time * 0.3) * 0.5;
  float wave2 = cos(uv.x * 5.0 - u_time * 0.2) * 0.3;
  float y = uv.y + wave1 + wave2;

  float glow = 1.0 - abs(y - 0.5) * 2.0;
  glow = pow(glow, 3.0);

  vec3 color1 = vec3(0.0, 1.0, 0.5);
  vec3 color2 = vec3(0.2, 0.5, 1.0);
  vec3 color = mix(color1, color2, sin(uv.x * 2.0 + u_time * 0.5) * 0.5 + 0.5);

  gl_FragColor = vec4(color * glow, 1.0);
}
    `
  },

  matrix: {
    name: "Matrix",
    description: "Digital rain effect",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float columns = 50.0;
  float col = floor(uv.x * columns);
  float row = floor((uv.y + u_time * 0.3) * columns);

  float char = random(vec2(col, row));
  float brightness = random(vec2(col, row + u_time * 0.5));

  vec3 color = vec3(0.0, brightness * char, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  gradient: {
    name: "Gradient Flow",
    description: "Animated gradient waves",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float wave = sin(uv.x * 3.0 + u_time) * 0.5 + 0.5;
  float wave2 = cos(uv.y * 3.0 - u_time * 0.7) * 0.5 + 0.5;

  vec3 color1 = vec3(1.0, 0.3, 0.5);
  vec3 color2 = vec3(0.3, 0.5, 1.0);
  vec3 color3 = vec3(0.5, 1.0, 0.3);

  vec3 color = mix(color1, color2, wave);
  color = mix(color, color3, wave2);

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  voronoi: {
    name: "Voronoi",
    description: "Cellular pattern",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

vec2 random2(vec2 st) {
  st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
  return fract(sin(st) * 43758.5453123);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv *= 5.0;

  vec2 i_st = floor(uv);
  vec2 f_st = fract(uv);

  float minDist = 1.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = random2(i_st + neighbor);
      point = 0.5 + 0.5 * sin(u_time * 0.5 + 6.2831 * point);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      minDist = min(minDist, dist);
    }
  }

  vec3 color = vec3(minDist);
  color = vec3(0.2, 0.5, 1.0) * (1.0 - minDist);

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  kaleidoscope: {
    name: "Kaleidoscope",
    description: "Symmetrical patterns",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265359

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 center = uv - 0.5;

  float angle = atan(center.y, center.x);
  float radius = length(center);

  // Create kaleidoscope effect with 8 segments
  float segments = 8.0;
  angle = mod(angle, PI * 2.0 / segments);
  angle = abs(angle - PI / segments);

  vec2 kaleido = vec2(cos(angle), sin(angle)) * radius;

  float pattern = sin(kaleido.x * 20.0 + u_time) * cos(kaleido.y * 20.0 - u_time);
  pattern = pattern * 0.5 + 0.5;

  vec3 color = vec3(
    pattern,
    sin(pattern * PI + u_time * 0.5) * 0.5 + 0.5,
    cos(pattern * PI - u_time * 0.3) * 0.5 + 0.5
  );

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  fire: {
    name: "Fire",
    description: "Flames and heat",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec2 p = uv;
  p.y -= u_time * 0.3;

  float flames = fbm(p * 3.0 + vec2(0.0, u_time * 0.5));
  flames = pow(flames, 2.0);

  float intensity = 1.0 - uv.y;
  flames *= intensity;

  vec3 color = vec3(
    flames * 2.0,
    flames * flames * 1.5,
    flames * flames * flames * 0.5
  );

  gl_FragColor = vec4(color, 1.0);
}
    `
  },

  waves: {
    name: "Ocean Waves",
    description: "Rolling water waves",
    fragmentShader: `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float wave1 = sin(uv.x * 10.0 + u_time * 2.0) * 0.1;
  float wave2 = sin(uv.x * 7.0 - u_time * 1.5) * 0.08;
  float wave3 = sin(uv.x * 13.0 + u_time * 1.0) * 0.05;

  float y = uv.y + wave1 + wave2 + wave3;

  float water = smoothstep(0.45, 0.55, y);

  vec3 skyColor = vec3(0.5, 0.7, 1.0);
  vec3 waterColor = vec3(0.0, 0.3, 0.6);

  vec3 color = mix(waterColor, skyColor, water);

  gl_FragColor = vec4(color, 1.0);
}
    `
  }
};

// Get list of shader keys for controls
export const getShaderKeys = () => Object.keys(shaders);

// Get shader by key
export const getShader = (key) => shaders[key] || shaders.none;
