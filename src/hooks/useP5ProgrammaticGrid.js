import { useCallback, useRef, useMemo } from 'react';
import ColorThemes from '../components/ColorThemes';
import { drawStyledGridTile } from './useP5GridTesselation';

/**
 * Programmatic Grid Generators
 * Each generator is a function that takes (i, j, width, height, options) and returns tile_components
 */

// Simple Perlin-like noise implementation (deterministic)
const noise2D = (x, y) => {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const hash = ((X * 374761393) + (Y * 668265263)) & 0x7fffffff;
  return (hash % 10000) / 10000;
};

const smoothNoise = (x, y) => {
  const fracX = x - Math.floor(x);
  const fracY = y - Math.floor(y);

  const n00 = noise2D(Math.floor(x), Math.floor(y));
  const n10 = noise2D(Math.floor(x) + 1, Math.floor(y));
  const n01 = noise2D(Math.floor(x), Math.floor(y) + 1);
  const n11 = noise2D(Math.floor(x) + 1, Math.floor(y) + 1);

  const nx0 = n00 * (1 - fracX) + n10 * fracX;
  const nx1 = n01 * (1 - fracX) + n11 * fracX;

  return nx0 * (1 - fracY) + nx1 * fracY;
};

export const PROGRAMMATIC_GENERATORS = {
  // 1. NOISE-BASED GENERATORS

  'perlinColors': {
    name: 'Perlin Noise Colors',
    description: 'Smooth color transitions using Perlin noise',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.1;
      const noiseVal = smoothNoise(i * scale, j * scale);

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor(noiseVal * colorKeys.length);
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'perlinTriangles': {
    name: 'Perlin Noise Triangles',
    description: 'Each triangle colored by noise at its position',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.15;
      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      return [0, 1, 2, 3].map(triangleIdx => {
        const offsetX = triangleIdx === 1 ? 0.5 : triangleIdx === 3 ? -0.5 : 0;
        const offsetY = triangleIdx === 0 ? -0.5 : triangleIdx === 2 ? 0.5 : 0;

        const noiseVal = smoothNoise((i + offsetX) * scale, (j + offsetY) * scale);
        const colorIdx = Math.floor(noiseVal * colorKeys.length);
        return { c: colorKeys[colorIdx] };
      });
    }
  },

  'turbulence': {
    name: 'Turbulence',
    description: 'Layered noise for turbulent patterns',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.1;
      const octaves = 3;
      let noiseVal = 0;
      let amplitude = 1;
      let frequency = scale;

      for (let o = 0; o < octaves; o++) {
        noiseVal += smoothNoise(i * frequency, j * frequency) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      noiseVal = noiseVal / 1.875; // Normalize

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor(noiseVal * colorKeys.length);
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  // 2. WAVE-BASED GENERATORS

  'sineWaves': {
    name: 'Sine Waves',
    description: 'Horizontal sine wave patterns',
    generate: (i, j, width, height, options = {}) => {
      const frequency = options.frequency || 0.5;
      const amplitude = options.amplitude || 2;

      const waveValue = Math.sin((j + i * 0.1) * frequency) * amplitude + amplitude;
      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor(waveValue) % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'concentricCircles': {
    name: 'Concentric Circles',
    description: 'Circular waves from center',
    generate: (i, j, width, height, options = {}) => {
      const centerX = options.centerX || 15;
      const centerY = options.centerY || 15;
      const frequency = options.frequency || 1;

      const dist = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor(dist * frequency) % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'interference': {
    name: 'Wave Interference',
    description: 'Two wave sources creating interference patterns',
    generate: (i, j, width, height, options = {}) => {
      const center1X = options.center1X || 10;
      const center1Y = options.center1Y || 10;
      const center2X = options.center2X || 20;
      const center2Y = options.center2Y || 20;
      const frequency = options.frequency || 0.5;

      const dist1 = Math.sqrt((i - center1X) ** 2 + (j - center1Y) ** 2);
      const dist2 = Math.sqrt((i - center2X) ** 2 + (j - center2Y) ** 2);

      const wave1 = Math.sin(dist1 * frequency);
      const wave2 = Math.sin(dist2 * frequency);
      const combined = (wave1 + wave2) / 2;

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor((combined + 1) * 2) % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  // 3. RULE-BASED GENERATORS

  'distanceGradient': {
    name: 'Distance Gradient',
    description: 'Color based on distance from center',
    generate: (i, j, width, height, options = {}) => {
      const centerX = options.centerX || 15;
      const centerY = options.centerY || 15;
      const maxDist = options.maxDist || 20;

      const dist = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      const normalized = Math.min(dist / maxDist, 1);

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor(normalized * (colorKeys.length - 1));
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'quadrants': {
    name: 'Quadrants',
    description: 'Different colors per quadrant',
    generate: (i, j, width, height, options = {}) => {
      const centerX = options.centerX || 15;
      const centerY = options.centerY || 15;

      const isRight = i >= centerX;
      const isBottom = j >= centerY;

      let color;
      if (!isRight && !isBottom) color = 'light';
      else if (isRight && !isBottom) color = 'medium';
      else if (!isRight && isBottom) color = 'dark';
      else color = 'accent';

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'diagonal': {
    name: 'Diagonal Stripes',
    description: 'Diagonal stripes based on i+j',
    generate: (i, j, width, height, options = {}) => {
      const stripeWidth = options.stripeWidth || 3;
      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = Math.floor((i + j) / stripeWidth) % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'modulo': {
    name: 'Modulo Pattern',
    description: 'Grid pattern based on modulo arithmetic',
    generate: (i, j, width, height, options = {}) => {
      const modX = options.modX || 4;
      const modY = options.modY || 4;

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const colorIdx = ((i % modX) + (j % modY)) % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'triangleRules': {
    name: 'Triangle Rules',
    description: 'Each triangle follows different rules',
    generate: (i, j, width, height, options = {}) => {
      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      return [
        { c: colorKeys[(i + j) % colorKeys.length] },           // Top: diagonal
        { c: colorKeys[i % colorKeys.length] },                  // Right: vertical
        { c: colorKeys[j % colorKeys.length] },                  // Bottom: horizontal
        { c: colorKeys[(i * j) % colorKeys.length] }             // Left: product
      ];
    }
  },

  // 4. CELLULAR AUTOMATA / GENERATIVE

  'gameOfLife': {
    name: 'Game of Life Pattern',
    description: 'Conway\'s Game of Life inspired static pattern',
    generate: (i, j, width, height, options = {}) => {
      // Use position hash to determine if cell is "alive"
      const hash = ((i * 73) ^ (j * 79)) & 0x7fffffff;
      const isAlive = (hash % 100) < 30; // 30% alive

      // Count "neighbors" using hash
      let neighbors = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const nhash = (((i + di) * 73) ^ ((j + dj) * 79)) & 0x7fffffff;
          if ((nhash % 100) < 30) neighbors++;
        }
      }

      let color;
      if (isAlive) {
        color = neighbors < 2 ? 'dark' : neighbors <= 3 ? 'medium' : 'light';
      } else {
        color = neighbors === 3 ? 'accent' : 'light';
      }

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'voronoi': {
    name: 'Voronoi Cells',
    description: 'Voronoi diagram with random seed points',
    generate: (i, j, width, height, options = {}) => {
      const numSeeds = options.numSeeds || 10;
      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      // Generate deterministic seed points
      const seeds = [];
      for (let s = 0; s < numSeeds; s++) {
        const hash1 = (s * 374761393) & 0x7fffffff;
        const hash2 = (s * 668265263) & 0x7fffffff;
        seeds.push({
          x: (hash1 % 30),
          y: (hash2 % 30),
          color: colorKeys[s % colorKeys.length]
        });
      }

      // Find closest seed
      let minDist = Infinity;
      let closestColor = 'light';

      for (const seed of seeds) {
        const dist = (i - seed.x) ** 2 + (j - seed.y) ** 2;
        if (dist < minDist) {
          minDist = dist;
          closestColor = seed.color;
        }
      }

      return [
        { c: closestColor },
        { c: closestColor },
        { c: closestColor },
        { c: closestColor }
      ];
    }
  },

  'random': {
    name: 'Random (Seeded)',
    description: 'Deterministic random colors per tile',
    generate: (i, j, width, height, options = {}) => {
      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const hash = ((i * 73) ^ (j * 79)) & 0x7fffffff;
      const colorIdx = hash % colorKeys.length;
      const color = colorKeys[colorIdx];

      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'randomTriangles': {
    name: 'Random Triangles',
    description: 'Each triangle gets a random color',
    generate: (i, j, width, height, options = {}) => {
      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      return [0, 1, 2, 3].map(triangleIdx => {
        const hash = ((i * 73 + triangleIdx * 13) ^ (j * 79)) & 0x7fffffff;
        const colorIdx = hash % colorKeys.length;
        return { c: colorKeys[colorIdx] };
      });
    }
  },

  'maze': {
    name: 'Maze Generator',
    description: 'Procedural maze-like patterns',
    generate: (i, j, width, height, options = {}) => {
      // Simple maze-like pattern using bit manipulation
      const hash = ((i * 73) ^ (j * 79)) & 0x7fffffff;
      const bits = hash.toString(2).padStart(8, '0');

      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      return [
        { c: colorKeys[parseInt(bits.substr(0, 2), 2)] },
        { c: colorKeys[parseInt(bits.substr(2, 2), 2)] },
        { c: colorKeys[parseInt(bits.substr(4, 2), 2)] },
        { c: colorKeys[parseInt(bits.substr(6, 2), 2)] }
      ];
    }
  },

  // DENSITY-BASED GENERATORS (inspired by generative art)

  'dottedDensity': {
    name: 'Dotted Density',
    description: 'Varying dot sizes create density - high contrast effect',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.15;
      const noiseVal = smoothNoise(i * scale, j * scale);

      // Use noise to determine density - threshold for high contrast
      if (noiseVal < 0.2) {
        return [{ c: 'light' }, { c: 'light' }, { c: 'light' }, { c: 'light' }];
      } else if (noiseVal < 0.4) {
        return [{ c: 'light' }, { c: 'medium' }, { c: 'light' }, { c: 'medium' }];
      } else if (noiseVal < 0.6) {
        return [{ c: 'medium' }, { c: 'medium' }, { c: 'medium' }, { c: 'medium' }];
      } else if (noiseVal < 0.8) {
        return [{ c: 'dark' }, { c: 'medium' }, { c: 'dark' }, { c: 'medium' }];
      } else {
        return [{ c: 'dark' }, { c: 'dark' }, { c: 'dark' }, { c: 'dark' }];
      }
    }
  },

  'stippled': {
    name: 'Stippled Pattern',
    description: 'Random dot density creates organic stippling effect',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.1;
      const noiseVal = smoothNoise(i * scale, j * scale);

      // Generate random but deterministic pattern for each triangle
      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      return [0, 1, 2, 3].map(triangleIdx => {
        const hash = ((i * 73 + triangleIdx * 13) ^ (j * 79)) & 0x7fffffff;
        const randomVal = (hash % 100) / 100;

        // Use noise value as threshold - creates density variation
        if (randomVal < noiseVal) {
          return { c: 'dark' };
        } else {
          return { c: 'light' };
        }
      });
    }
  },

  'crossHatch': {
    name: 'Cross Hatch',
    description: 'Line density creates shading like pen cross-hatching',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.12;
      const noiseVal = smoothNoise(i * scale, j * scale);

      const colorKeys = ['light', 'medium', 'dark'];

      // Determine density based on noise
      // Use different directional patterns per triangle
      const density = Math.floor(noiseVal * 3); // 0, 1, or 2

      return [
        { c: colorKeys[(i + density) % 3] },        // Top: vertical bias
        { c: colorKeys[(j + density) % 3] },        // Right: horizontal bias
        { c: colorKeys[(i + j + density) % 3] },    // Bottom: diagonal bias
        { c: colorKeys[((i - j) + density + 6) % 3] } // Left: opposite diagonal
      ];
    }
  },

  'textileWeave': {
    name: 'Textile Weave',
    description: 'Alternating row patterns like woven fabric',
    generate: (i, j, width, height, options = {}) => {
      const bandHeight = options.bandHeight || 3;
      const band = Math.floor(j / bandHeight) % 4;

      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      // Different pattern per band
      switch (band) {
        case 0: // Dense vertical stripes
          return [
            { c: colorKeys[i % 2 === 0 ? 0 : 2] },
            { c: colorKeys[i % 2 === 0 ? 0 : 2] },
            { c: colorKeys[i % 2 === 0 ? 0 : 2] },
            { c: colorKeys[i % 2 === 0 ? 0 : 2] }
          ];
        case 1: // Checkered
          return [
            { c: colorKeys[(i + j) % 2 === 0 ? 0 : 3] },
            { c: colorKeys[(i + j + 1) % 2 === 0 ? 0 : 3] },
            { c: colorKeys[(i + j) % 2 === 0 ? 0 : 3] },
            { c: colorKeys[(i + j + 1) % 2 === 0 ? 0 : 3] }
          ];
        case 2: // Horizontal blocks
          return [
            { c: colorKeys[1] },
            { c: colorKeys[1] },
            { c: colorKeys[1] },
            { c: colorKeys[1] }
          ];
        case 3: // Mixed triangles
          return [
            { c: colorKeys[i % 4] },
            { c: colorKeys[(i + 1) % 4] },
            { c: colorKeys[(i + 2) % 4] },
            { c: colorKeys[(i + 3) % 4] }
          ];
      }
    }
  },

  'thresholdBlocks': {
    name: 'Threshold Blocks',
    description: 'Hard thresholds create stark geometric blocks',
    generate: (i, j, width, height, options = {}) => {
      const scale = options.scale || 0.08;
      const noiseVal = smoothNoise(i * scale, j * scale);

      // Hard thresholds - no gradients!
      let color;
      if (noiseVal < 0.25) {
        color = 'light';
      } else if (noiseVal < 0.5) {
        color = 'medium';
      } else if (noiseVal < 0.75) {
        color = 'dark';
      } else {
        color = 'accent';
      }

      // All triangles same color for blocky effect
      return [
        { c: color },
        { c: color },
        { c: color },
        { c: color }
      ];
    }
  },

  'bandedComposite': {
    name: 'Banded Composite',
    description: 'Different patterns per horizontal band - complex compositions',
    generate: (i, j, width, height, options = {}) => {
      const bandHeight = options.bandHeight || 5;
      const band = Math.floor(j / bandHeight) % 6;
      const scale = 0.15;

      const colorKeys = ['light', 'medium', 'dark', 'accent'];

      // Different generator per band
      switch (band) {
        case 0: // Perlin noise
          const noiseVal = smoothNoise(i * scale, j * scale);
          const colorIdx = Math.floor(noiseVal * 4);
          return [{ c: colorKeys[colorIdx] }, { c: colorKeys[colorIdx] },
                  { c: colorKeys[colorIdx] }, { c: colorKeys[colorIdx] }];

        case 1: // Random stipple
          return [0, 1, 2, 3].map(idx => {
            const hash = ((i * 73 + idx * 13) ^ (j * 79)) & 0x7fffffff;
            return { c: hash % 2 === 0 ? 'light' : 'dark' };
          });

        case 2: // Vertical stripes
          const stripeColor = i % 3 === 0 ? 'dark' : 'light';
          return [{ c: stripeColor }, { c: stripeColor }, { c: stripeColor }, { c: stripeColor }];

        case 3: // Diagonal pattern
          const diagColor = colorKeys[(i + j) % 4];
          return [{ c: diagColor }, { c: diagColor }, { c: diagColor }, { c: diagColor }];

        case 4: // Checkerboard
          return [
            { c: (i + j) % 2 === 0 ? 'light' : 'dark' },
            { c: (i + j + 1) % 2 === 0 ? 'light' : 'dark' },
            { c: (i + j) % 2 === 0 ? 'light' : 'dark' },
            { c: (i + j + 1) % 2 === 0 ? 'light' : 'dark' }
          ];

        case 5: // Dense fill
          return [{ c: 'accent' }, { c: 'accent' }, { c: 'accent' }, { c: 'accent' }];
      }
    }
  },

  'concentricThreshold': {
    name: 'Concentric Threshold',
    description: 'Circular bands with hard thresholds - target-like patterns',
    generate: (i, j, width, height, options = {}) => {
      const centerX = options.centerX || 15;
      const centerY = options.centerY || 15;
      const frequency = options.frequency || 1.5;

      const dist = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      const ring = Math.floor(dist * frequency) % 4;

      const colorKeys = ['light', 'medium', 'dark', 'accent'];
      const color = colorKeys[ring];

      return [{ c: color }, { c: color }, { c: color }, { c: color }];
    }
  }
};

/**
 * Fills the canvas with programmatically generated grid tiles
 */
const fillWithProgrammaticGrid = (p5, tileWidth, tileHeight, generator, color_theme, tile_options = {}) => {
  const tiles_wide = Math.ceil(p5.width / tileWidth) + 2;
  const tiles_high = Math.ceil(p5.height / tileHeight) + 2;

  const startX = tileWidth / 2;
  const startY = tileHeight / 2;

  for (let i = 0; i < tiles_wide; i++) {
    for (let j = 0; j < tiles_high; j++) {
      const x_loc = startX + (tileWidth * i);
      const y_loc = startY + (tileHeight * j);

      // Viewport culling
      if (x_loc > p5.width + tileWidth || x_loc < -tileWidth ||
          y_loc > p5.height + tileHeight || y_loc < -tileHeight) {
        continue;
      }

      // Generate tile components programmatically
      const tile_components = generator(i, j, tileWidth, tileHeight, tile_options.generatorOptions || {});

      drawStyledGridTile(p5, x_loc, y_loc, tileWidth, tileHeight, tile_components, color_theme, tile_options);
    }
  }
};

/**
 * React hook for creating programmatic p5.js grid tessellations
 */
export function useP5ProgrammaticGrid({
  generatorName = 'perlinColors',
  color_theme = ColorThemes['Basic Bee'],
  width = 100,
  height = 100,
  tile_options = {},
}) {
  const safeColorTheme = useMemo(() => color_theme || ColorThemes['Basic Bee'], [color_theme]);
  const generator = useMemo(() => {
    return PROGRAMMATIC_GENERATORS[generatorName]?.generate || PROGRAMMATIC_GENERATORS['perlinColors'].generate;
  }, [generatorName]);

  const p5InstanceRef = useRef(null);
  const paramsRef = useRef({ width, height, generator, safeColorTheme, tile_options });

  const setup = useCallback((p5) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();
    p5InstanceRef.current = p5;
  }, []);

  paramsRef.current = { width, height, generator, safeColorTheme, tile_options };

  const draw = useCallback((p5) => {
    try {
      const params = paramsRef.current;
      p5.background(params.safeColorTheme.bg);

      fillWithProgrammaticGrid(p5, params.width, params.height, params.generator, params.safeColorTheme, params.tile_options);
      p5.noStroke();

    } catch (error) {
      console.error('Error in programmatic grid draw function:', error);
    }
  }, []);

  return { setup, draw };
}
