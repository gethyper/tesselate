import { useCallback, useRef, useMemo } from 'react';
import GridTileDesigns from '../components/GridTileDesigns';
import ColorThemes from '../components/ColorThemes';

/**
 * Creates an inverted color theme by swapping light/dark and medium/accent
 */
const invertColorTheme = (theme) => {
  return {
    light: theme.dark,
    medium: theme.accent,
    dark: theme.light,
    accent: theme.medium,
    bg: theme.bg // Keep background the same
  };
};

/**
 * Draws a single grid tile composed of 4 triangular segments
 * Each grid tile is divided into 4 triangles from the center (top, right, bottom, left)
 *
 * @param {Object} p5 - The p5.js instance
 * @param {number} centerX - X coordinate of the grid tile center
 * @param {number} centerY - Y coordinate of the grid tile center
 * @param {number} width - Width of the grid tile
 * @param {number} height - Height of the grid tile
 * @param {Array} tile_components - Array of 4 tile component definitions with colors
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 */
export const drawGridTile = (p5, centerX, centerY, width, height, tile_components, color_theme, tile_options = {}) => {
  const halfW = width / 2;
  const halfH = height / 2;

  // Calculate the 4 corners
  const topLeft = [centerX - halfW, centerY - halfH];
  const topRight = [centerX + halfW, centerY - halfH];
  const bottomRight = [centerX + halfW, centerY + halfH];
  const bottomLeft = [centerX - halfW, centerY + halfH];
  const center = [centerX, centerY];

  // Draw each of the 4 triangles (top, right, bottom, left)
  const triangles = [
    { vertices: [topLeft, topRight, center], component: tile_components[0] },      // Top
    { vertices: [topRight, bottomRight, center], component: tile_components[1] },  // Right
    { vertices: [bottomRight, bottomLeft, center], component: tile_components[2] }, // Bottom
    { vertices: [bottomLeft, topLeft, center], component: tile_components[3] }      // Left
  ];

  triangles.forEach(({ vertices, component }) => {
    const tri_color = color_theme[component.c || component.color];
    const stroke_color = component.s ? color_theme[component.s] : null;

    p5.push();
    p5.fill(tri_color);

    if (stroke_color) {
      p5.stroke(stroke_color);
      p5.strokeWeight(component.sw || 1);
    } else {
      p5.noStroke();
    }

    p5.beginShape();
    vertices.forEach(([x, y]) => p5.vertex(x, y));
    p5.endShape(p5.CLOSE);
    p5.pop();
  });
};

/**
 * Draws a simple solid grid tile (no triangular divisions)
 */
export const drawSolidGridTile = (p5, centerX, centerY, width, height, color, stroke_color = null, stroke_weight = 1) => {
  p5.push();
  p5.fill(color);

  if (stroke_color) {
    p5.stroke(stroke_color);
    p5.strokeWeight(stroke_weight);
  } else {
    p5.noStroke();
  }

  p5.rectMode(p5.CENTER);
  p5.rect(centerX, centerY, width, height);
  p5.pop();
};

/**
 * Tile style definitions
 */
export const TILE_STYLES = {
  'blank': { label: 'Blank', colorCount: 1 },
  'triangles': { label: 'Triangles (4)', colorCount: 4 },
  '2-stripes-v': { label: '2 Vertical Stripes', colorCount: 2 },
  '2-stripes-h': { label: '2 Horizontal Stripes', colorCount: 2 },
  '3-stripes-v': { label: '3 Vertical Stripes', colorCount: 3 },
  '3-stripes-h': { label: '3 Horizontal Stripes', colorCount: 3 },
  'grid-2x2': { label: '2x2 Grid', colorCount: 4 },
  'grid-3x3': { label: '3x3 Grid', colorCount: 4 },
  'triangle-up': { label: 'Triangle Up', colorCount: 2 },
  'triangle-down': { label: 'Triangle Down', colorCount: 2 },
  'triangle-left': { label: 'Triangle Left', colorCount: 2 },
  'triangle-right': { label: 'Triangle Right', colorCount: 2 },
  'circle': { label: 'Circle', colorCount: 2 },
  'circle-line-v': { label: 'Circle + Vertical Line', colorCount: 3 },
  'circle-line-h': { label: 'Circle + Horizontal Line', colorCount: 3 },
  'circle-line-diag': { label: 'Circle + Diagonal Line', colorCount: 3 },
  'circle-line-diag-alt': { label: 'Circle + Diagonal Line (Alt)', colorCount: 3 },
  'circle-cross': { label: 'Circle + Cross', colorCount: 3 },
  'circle-x': { label: 'Circle + X', colorCount: 3 },
};

/**
 * Draws a grid tile with the specified style
 */
export const drawStyledGridTile = (p5, centerX, centerY, width, height, tile_components, color_theme, tile_options = {}) => {
  const tileStyle = tile_options.tileStyle || 'triangles';
  const halfW = width / 2;
  const halfH = height / 2;

  // Get colors from tile_components (use first few depending on style)
  const getColor = (index) => {
    const comp = tile_components[index % tile_components.length];
    return color_theme[comp.c || comp.color];
  };

  p5.push();
  p5.noStroke();

  switch (tileStyle) {
    case 'blank': {
      // Solid fill with first color
      p5.fill(getColor(0));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      break;
    }

    case 'triangles': {
      // Original 4 triangles from center (default)
      const topLeft = [centerX - halfW, centerY - halfH];
      const topRight = [centerX + halfW, centerY - halfH];
      const bottomRight = [centerX + halfW, centerY + halfH];
      const bottomLeft = [centerX - halfW, centerY + halfH];
      const center = [centerX, centerY];

      const triangles = [
        { vertices: [topLeft, topRight, center], colorIdx: 0 },      // Top
        { vertices: [topRight, bottomRight, center], colorIdx: 1 },  // Right
        { vertices: [bottomRight, bottomLeft, center], colorIdx: 2 }, // Bottom
        { vertices: [bottomLeft, topLeft, center], colorIdx: 3 }      // Left
      ];

      triangles.forEach(({ vertices, colorIdx }) => {
        p5.fill(getColor(colorIdx));
        p5.beginShape();
        vertices.forEach(([x, y]) => p5.vertex(x, y));
        p5.endShape(p5.CLOSE);
      });
      break;
    }

    case '2-stripes-v': {
      // 2 vertical stripes
      const stripeW = width / 2;
      p5.fill(getColor(0));
      p5.rect(centerX - halfW, centerY - halfH, stripeW, height);
      p5.fill(getColor(1));
      p5.rect(centerX, centerY - halfH, stripeW, height);
      break;
    }

    case '2-stripes-h': {
      // 2 horizontal stripes
      const stripeH = height / 2;
      p5.fill(getColor(0));
      p5.rect(centerX - halfW, centerY - halfH, width, stripeH);
      p5.fill(getColor(1));
      p5.rect(centerX - halfW, centerY, width, stripeH);
      break;
    }

    case '3-stripes-v': {
      // 3 vertical stripes
      const stripeW = width / 3;
      p5.fill(getColor(0));
      p5.rect(centerX - halfW, centerY - halfH, stripeW, height);
      p5.fill(getColor(1));
      p5.rect(centerX - halfW + stripeW, centerY - halfH, stripeW, height);
      p5.fill(getColor(2));
      p5.rect(centerX - halfW + stripeW * 2, centerY - halfH, stripeW, height);
      break;
    }

    case '3-stripes-h': {
      // 3 horizontal stripes
      const stripeH = height / 3;
      p5.fill(getColor(0));
      p5.rect(centerX - halfW, centerY - halfH, width, stripeH);
      p5.fill(getColor(1));
      p5.rect(centerX - halfW, centerY - halfH + stripeH, width, stripeH);
      p5.fill(getColor(2));
      p5.rect(centerX - halfW, centerY - halfH + stripeH * 2, width, stripeH);
      break;
    }

    case 'grid-2x2': {
      // 2x2 grid
      const cellW = width / 2;
      const cellH = height / 2;
      p5.fill(getColor(0));
      p5.rect(centerX - halfW, centerY - halfH, cellW, cellH);
      p5.fill(getColor(1));
      p5.rect(centerX, centerY - halfH, cellW, cellH);
      p5.fill(getColor(2));
      p5.rect(centerX - halfW, centerY, cellW, cellH);
      p5.fill(getColor(3));
      p5.rect(centerX, centerY, cellW, cellH);
      break;
    }

    case 'grid-3x3': {
      // 3x3 grid with alternating colors
      const cellW = width / 3;
      const cellH = height / 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const colorIdx = (i + j) % 4;
          p5.fill(getColor(colorIdx));
          p5.rect(centerX - halfW + i * cellW, centerY - halfH + j * cellH, cellW, cellH);
        }
      }
      break;
    }

    case 'triangle-up': {
      // Background + triangle pointing up
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      p5.beginShape();
      p5.vertex(centerX, centerY - halfH);
      p5.vertex(centerX + halfW, centerY + halfH);
      p5.vertex(centerX - halfW, centerY + halfH);
      p5.endShape(p5.CLOSE);
      break;
    }

    case 'triangle-down': {
      // Background + triangle pointing down
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      p5.beginShape();
      p5.vertex(centerX - halfW, centerY - halfH);
      p5.vertex(centerX + halfW, centerY - halfH);
      p5.vertex(centerX, centerY + halfH);
      p5.endShape(p5.CLOSE);
      break;
    }

    case 'triangle-left': {
      // Background + triangle pointing left
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      p5.beginShape();
      p5.vertex(centerX - halfW, centerY);
      p5.vertex(centerX + halfW, centerY - halfH);
      p5.vertex(centerX + halfW, centerY + halfH);
      p5.endShape(p5.CLOSE);
      break;
    }

    case 'triangle-right': {
      // Background + triangle pointing right
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      p5.beginShape();
      p5.vertex(centerX + halfW, centerY);
      p5.vertex(centerX - halfW, centerY - halfH);
      p5.vertex(centerX - halfW, centerY + halfH);
      p5.endShape(p5.CLOSE);
      break;
    }

    case 'circle': {
      // Background + centered circle
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const diameter = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, diameter, diameter);
      break;
    }

    case 'circle-line-v': {
      // Background + circle + vertical line
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw vertical line
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX, centerY - dia/2, centerX, centerY + dia/2);
      break;
    }

    case 'circle-line-h': {
      // Background + circle + horizontal line
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw horizontal line
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX - dia/2, centerY, centerX + dia/2, centerY);
      break;
    }

    case 'circle-line-diag': {
      // Background + circle + diagonal line (top-left to bottom-right)
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw diagonal line
      const offset = dia / 2 * 0.707; // sqrt(2)/2 for 45 degree
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX - offset, centerY - offset, centerX + offset, centerY + offset);
      break;
    }

    case 'circle-line-diag-alt': {
      // Background + circle + diagonal line (top-right to bottom-left)
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw diagonal line
      const offset = dia / 2 * 0.707;
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX + offset, centerY - offset, centerX - offset, centerY + offset);
      break;
    }

    case 'circle-cross': {
      // Background + circle + cross (vertical + horizontal)
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw cross
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX, centerY - dia/2, centerX, centerY + dia/2);
      p5.line(centerX - dia/2, centerY, centerX + dia/2, centerY);
      break;
    }

    case 'circle-x': {
      // Background + circle + X (two diagonals)
      p5.fill(getColor(1));
      p5.rectMode(p5.CENTER);
      p5.rect(centerX, centerY, width, height);
      p5.fill(getColor(0));
      const dia = Math.min(width, height) * 0.8;
      p5.ellipse(centerX, centerY, dia, dia);
      // Draw X
      const offset = dia / 2 * 0.707;
      p5.stroke(getColor(2));
      p5.strokeWeight(Math.max(2, dia * 0.08));
      p5.line(centerX - offset, centerY - offset, centerX + offset, centerY + offset);
      p5.line(centerX + offset, centerY - offset, centerX - offset, centerY + offset);
      break;
    }

    default: {
      // Fallback to triangles
      drawGridTile(p5, centerX, centerY, width, height, tile_components, color_theme, tile_options);
    }
  }

  p5.pop();
};

/**
 * Calculate tile adjustment effects based on position and effect type
 */
const calculateTileAdjustment = (adjustment, i, j) => {
  if (!adjustment || adjustment.type === 'numeric') {
    return adjustment?.value || 0;
  }

  // Validate adjustment has required properties
  if (!adjustment.type || !adjustment.values || !Array.isArray(adjustment.values)) {
    console.warn('Invalid adjustment object:', adjustment);
    return 0;
  }

  switch (adjustment.type) {
    case 'wave':
    case 'sine':
      const amplitude = adjustment.values[0] || 10;
      const frequency = adjustment.values[1] || 1;
      const waveInput = (i + j) * frequency * 0.1;
      const waveResult = amplitude * Math.sin(waveInput);
      return isFinite(waveResult) && !isNaN(waveResult) ? waveResult : 0;

    case 'random':
      const intensity = adjustment.values[0] || 5;
      const hash = ((i * 73) ^ (j * 79)) & 0x7fffffff;
      const pseudoRandom = (hash % 10000) / 10000;
      return (pseudoRandom - 0.5) * intensity * 2;

    case 'alt':
      const value1 = adjustment.values[0] || 0;
      const value2 = adjustment.values[1] || 0;
      return (i + j) % 2 === 0 ? value1 : value2;

    case 'shiftx':
      const xOffset = adjustment.values[0] || 10;
      const xInterval = Math.max(1, adjustment.values[1] || 2);
      return (i % xInterval === 0) ? 0 : xOffset;

    case 'shifty':
      const yOffset = adjustment.values[0] || 10;
      const yInterval = Math.max(1, adjustment.values[1] || 2);
      return (j % yInterval === 0) ? 0 : yOffset;

    default:
      console.warn(`Unknown adjustment type: ${adjustment.type}`);
      return 0;
  }
};

const getNumericValue = (adjustment) => {
  if (typeof adjustment === 'object') {
    return adjustment?.value || 0;
  }
  return adjustment || 0;
};

const createAdjustmentFunction = (adjustment, axis) => {
  if (typeof adjustment !== 'object' || adjustment.type === 'numeric') {
    const numericValue = getNumericValue(adjustment);
    // For constant numeric adjustments, just return the value (don't multiply by i or j)
    return (i, j) => numericValue;
  }

  return (i, j) => calculateTileAdjustment(adjustment, i, j);
};

/**
 * Fills the canvas with tessellated grid tiles
 */
export const fillWithGridTiles = (p5, width, height, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  const tile_x_adjust = tile_options.tile_x_adjust || 0;
  const tile_y_adjust = tile_options.tile_y_adjust || 0;

  const getXAdjustment = createAdjustmentFunction(tile_x_adjust, 'x');
  const getYAdjustment = createAdjustmentFunction(tile_y_adjust, 'y');

  const tiles_in_pattern_wide = tile_pattern.length;
  const tiles_in_pattern_high = tile_pattern[0].length;

  // Calculate how many tiles we need
  const tiles_wide = tile_options.showSingleMosaic ? tiles_in_pattern_wide : Math.ceil(p5.width / width) + 2;
  const tiles_high = tile_options.showSingleMosaic ? tiles_in_pattern_high : Math.ceil(p5.height / height) + 2;

  // Starting offset to ensure coverage
  const startX = width / 2;
  const startY = height / 2;

  for (let i = 0; i < tiles_wide; i++) {
    const tile_column = i % tiles_in_pattern_wide;

    for (let j = 0; j < tiles_high; j++) {
      const tile_row = j % tiles_in_pattern_high;

      const xAdjust = getXAdjustment(i, j);
      const yAdjust = getYAdjustment(i, j);

      const x_loc = startX + (width * i) + xAdjust;
      const y_loc = startY + (height * j) + yAdjust;

      // Viewport culling
      if (x_loc > p5.width + width || x_loc < -width ||
          y_loc > p5.height + height || y_loc < -height) {
        continue;
      }

      // Determine if this tile should use alternate (inverted) colors
      // Use deterministic random based on tile position for consistent pattern
      const altColorFrequency = tile_options.altColorFrequency || 0;
      const tileHash = ((i * 73) ^ (j * 79)) & 0x7fffffff;
      const tileRandom = (tileHash % 100);

      // Calculate position-based frequency using gradient
      const altColorGradient = tile_options.altColorGradient || 'none';
      const altColorGradientIntensity = tile_options.altColorGradientIntensity || 1.0;

      let positionFactor = 1.0; // Default: uniform distribution

      if (altColorFrequency > 0 && altColorGradient !== 'none') {
        const normalizedI = i / tiles_wide;
        const normalizedJ = j / tiles_high;

        switch (altColorGradient) {
          case 'vertical':
            positionFactor = Math.pow(normalizedJ, altColorGradientIntensity);
            break;
          case 'vertical-reverse':
            positionFactor = Math.pow(1 - normalizedJ, altColorGradientIntensity);
            break;
          case 'horizontal':
            positionFactor = Math.pow(normalizedI, altColorGradientIntensity);
            break;
          case 'horizontal-reverse':
            positionFactor = Math.pow(1 - normalizedI, altColorGradientIntensity);
            break;
          case 'radial-out':
            const distFromCenterOut = Math.sqrt(Math.pow(normalizedI - 0.5, 2) + Math.pow(normalizedJ - 0.5, 2)) * 1.4142;
            positionFactor = Math.pow(Math.min(distFromCenterOut, 1), altColorGradientIntensity);
            break;
          case 'radial-in':
            const distFromCenterIn = Math.sqrt(Math.pow(normalizedI - 0.5, 2) + Math.pow(normalizedJ - 0.5, 2)) * 1.4142;
            positionFactor = Math.pow(1 - Math.min(distFromCenterIn, 1), altColorGradientIntensity);
            break;
          case 'diagonal':
            positionFactor = Math.pow((normalizedI + normalizedJ) / 2, altColorGradientIntensity);
            break;
          case 'diagonal-reverse':
            positionFactor = Math.pow((1 - normalizedI + normalizedJ) / 2, altColorGradientIntensity);
            break;
          default:
            positionFactor = 1.0;
        }
      }

      const effectiveFrequency = altColorFrequency * positionFactor;
      const useAltColor = altColorFrequency > 0 && tileRandom < effectiveFrequency;
      const tileColorTheme = useAltColor ? invertColorTheme(color_theme) : color_theme;

      drawStyledGridTile(p5, x_loc, y_loc, width, height, tile_pattern[tile_column][tile_row], tileColorTheme, tile_options);
    }
  }
};

/**
 * React hook for creating p5.js grid tessellation visualizations
 *
 * @param {Object} config - Configuration object for the tessellation
 * @param {Array<Array>} config.tile_pattern - 2D array defining the tile pattern
 * @param {Object} config.color_theme - Color theme object containing color definitions
 * @param {number} config.width - Width of each grid tile (default: 100)
 * @param {number} config.height - Height of each grid tile (default: 100)
 * @param {boolean} config.useGradient - Whether to apply gradient effects (default: false)
 * @param {Object} config.tile_options - Additional tile configuration options (default: {})
 * @returns {Object} Object containing setup and draw functions for p5.js
 */
export function useP5GridTesselation({
  tile_pattern = GridTileDesigns['checkerboard'].tilePattern,
  color_theme = ColorThemes['Basic Bee'],
  width = 100,
  height = 100,
  useGradient = false,
  tile_options = {},
}) {
  const safeTilePattern = useMemo(() => tile_pattern || GridTileDesigns['checkerboard'].tilePattern, [tile_pattern]);
  const safeColorTheme = useMemo(() => color_theme || ColorThemes['Basic Bee'], [color_theme]);

  const p5InstanceRef = useRef(null);
  const paramsRef = useRef({ width, height, safeTilePattern, safeColorTheme, tile_options, useGradient });

  const setup = useCallback((p5) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();
    p5InstanceRef.current = p5;
  }, []);

  paramsRef.current = { width, height, safeTilePattern, safeColorTheme, tile_options, useGradient };

  const draw = useCallback((p5) => {
    try {
      const params = paramsRef.current;
      p5.background(params.safeColorTheme.bg);

      if (!params.safeTilePattern || !Array.isArray(params.safeTilePattern) || params.safeTilePattern.length === 0) {
        return;
      }

      fillWithGridTiles(p5, params.width, params.height, params.safeTilePattern, params.safeColorTheme, params.tile_options, params.useGradient);
      p5.noStroke();

    } catch (error) {
      console.error('Error in grid draw function:', error);
    }
  }, []);

  return { setup, draw };
}
