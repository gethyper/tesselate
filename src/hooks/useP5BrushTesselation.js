import { useCallback, useRef } from 'react';
import * as brush from 'p5.brush';

/**
 * Experimental p5.brush tessellation renderer.
 *
 * This is deliberately separate from `useP5Tesselation` because p5.brush requires a
 * WEBGL canvas, while the original renderer relies on 2D canvas context operations
 * (clipping, `drawImage`, gradients) that do not exist in WEBGL.
 *
 * Two families of look are available:
 *
 * *Dry media* (the original goal) — texture without diffusion:
 *   - `brush.hatch()`      — repeated textured lines inside each facet
 *   - `brush.mass()`       — layered hand-filled tone
 *   - `brush.wash()`       — flat opaque base coat (no bleed, no diffusion)
 *   - `brush.set()`        — textured outline strokes on facet edges
 *
 * *Watercolor* — p5.brush's diffusion fill system:
 *   - `brush.fill()`        — watercolor body color and opacity
 *   - `brush.fillBleed()`   — how far and which way pigment creeps past the edge
 *   - `brush.fillTexture()` — paper grain and the darker dried rim
 */

/**
 * Dry-media brushes shipped with p5.brush, used as a fallback if the library
 * cannot be queried. Prefer `listBrushTips()`, which asks the library directly.
 */
export const BRUSH_TIPS = [
  'pen',
  'rotring',
  '2B',
  'HB',
  '2H',
  'cpencil',
  'pastel',
  'crayon',
  'charcoal',
  'spray',
  'marker'
];

/**
 * Returns the brush names actually registered in p5.brush, falling back to the
 * static list. Sourcing this at runtime avoids drifting from the library.
 *
 * @returns {Array<string>} Available brush names
 */
export const listBrushTips = () => {
  try {
    const names = brush.box();
    return Array.isArray(names) && names.length ? names : BRUSH_TIPS;
  } catch (error) {
    return BRUSH_TIPS;
  }
};

/** Vector fields usable to bend strokes. `none` disables field influence. */
export const BRUSH_FIELDS = [
  'none',
  'hand',
  'curved',
  'zigzag',
  'waves',
  'seabed',
  'spiral',
  'columns'
];

/**
 * Texture modes.
 *
 * Dry media (no diffusion):
 * - `hatch`     : hatching only, facets read as line texture over the background
 * - `washHatch` : flat color base coat + hatching on top (most "tessellation-like")
 * - `mass`      : layered gestural fill, coarse and painterly but dry
 * - `wash`      : flat color only; texture comes purely from the outline brush
 *
 * Watercolor (p5.brush's diffusion fill):
 * - `watercolor`      : bleeding washes of pigment with paper grain
 * - `watercolorHatch` : watercolor body with dry hatching drawn over the top
 */
export const TEXTURE_MODES = {
  hatch: 'Hatch only',
  washHatch: 'Wash + hatch',
  mass: 'Mass (layered)',
  wash: 'Wash only',
  watercolor: 'Watercolor',
  watercolorHatch: 'Watercolor + hatch'
};

/** Whether a texture mode uses the watercolor diffusion fill. */
export const isWatercolorMode = (mode) => mode === 'watercolor' || mode === 'watercolorHatch';

/** Directions pigment can bleed relative to the facet edge. */
export const BLEED_DIRECTIONS = {
  out: 'Outward',
  in: 'Inward'
};

/** How each facet of a hexagon chooses its hatch angle. */
export const HATCH_ANGLE_MODES = {
  facet: 'Per facet (radial)',
  uniform: 'Uniform',
  alternating: 'Alternating',
  random: 'Random'
};

export const DEFAULT_BRUSH_OPTIONS = Object.freeze({
  radius: 110,
  textureMode: 'washHatch',
  hatchBrush: 'rotring',
  hatchDistance: 6,
  hatchWeight: 1,
  hatchRandomness: 0.1,
  hatchGradient: 0,
  hatchAngleMode: 'facet',
  hatchBaseAngle: 30,
  hatchColorKey: 'auto',
  washOpacity: 225,
  fillOpacity: 110,
  bleedStrength: 0.12,
  bleedDirection: 'out',
  bleedAngle: 0,
  fillTextureStrength: 0.45,
  fillBorderStrength: 0.45,
  fillScatter: true,
  outline: true,
  outlineBrush: 'HB',
  outlineWeight: 1,
  outlineColorKey: 'dark',
  massBrush: 'charcoal',
  massPrecision: 0.55,
  massStrength: 0.9,
  brushScale: 1.4,
  field: 'none',
  wiggle: 0,
  seed: 1
});

/**
 * `brush.scaleBrushes()` multiplies the parameters of every registered brush, so
 * calling it repeatedly compounds. Track the applied factor and only ever apply
 * the delta needed to reach the requested absolute scale.
 */
let appliedBrushScale = 1;
const setAbsoluteBrushScale = (scale) => {
  const target = Number.isFinite(scale) && scale > 0 ? scale : 1;
  if (Math.abs(target - appliedBrushScale) < 1e-6) return;
  brush.scaleBrushes(target / appliedBrushScale);
  appliedBrushScale = target;
};

/** Resets the cached scale so a freshly mounted sketch re-applies it. */
export const resetBrushScale = () => {
  appliedBrushScale = 1;
};

/**
 * Computes the centers of every hexagon needed to cover the canvas, with one tile
 * of bleed on each edge so partial tiles reach the borders.
 *
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} radius - Hexagon radius
 * @param {boolean} isPointyTop - Pointy-top (true) or flat-top (false)
 * @returns {Array<{x: number, y: number, col: number, row: number}>} Hexagon centers
 */
export const computeHexCenters = (width, height, radius, isPointyTop) => {
  const centers = [];
  const SQRT3 = Math.sqrt(3);

  if (isPointyTop) {
    const hexWidth = SQRT3 * radius;
    const rowSpacing = 1.5 * radius;
    const rows = Math.ceil(height / rowSpacing) + 2;
    const cols = Math.ceil(width / hexWidth) + 2;

    for (let row = -1; row < rows; row++) {
      const rowOffset = (row % 2 === 0) ? 0 : hexWidth / 2;
      for (let col = -1; col < cols; col++) {
        centers.push({
          x: col * hexWidth + rowOffset,
          y: row * rowSpacing,
          col: col + 1,
          row: row + 1
        });
      }
    }
  } else {
    const hexHeight = SQRT3 * radius;
    const colSpacing = 1.5 * radius;
    const cols = Math.ceil(width / colSpacing) + 2;
    const rows = Math.ceil(height / hexHeight) + 2;

    for (let col = -1; col < cols; col++) {
      const colOffset = (col % 2 === 0) ? 0 : hexHeight / 2;
      for (let row = -1; row < rows; row++) {
        centers.push({
          x: col * colSpacing,
          y: row * hexHeight + colOffset,
          col: col + 1,
          row: row + 1
        });
      }
    }
  }

  return centers;
};

/**
 * Returns the six vertices of a hexagon as `[x, y]` pairs.
 *
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Hexagon radius
 * @param {boolean} isPointyTop - Pointy-top (true) or flat-top (false)
 * @returns {Array<Array<number>>} Six vertices
 */
export const hexVertices = (centerX, centerY, radius, isPointyTop) => {
  const vertices = [];
  const startAngle = isPointyTop ? -Math.PI / 2 : 0;
  for (let i = 0; i < 6; i++) {
    const angle = startAngle + (i * Math.PI) / 3;
    vertices.push([
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    ]);
  }
  return vertices;
};

/**
 * Resolves the hatch angle for a given facet.
 *
 * @param {Object} p5 - p5 instance (used for seeded randomness)
 * @param {string} mode - One of the keys of HATCH_ANGLE_MODES
 * @param {number} baseAngle - Base angle in degrees
 * @param {number} facetIndex - Index of the triangle within the hexagon (0-5)
 * @returns {number} Angle in degrees
 */
const resolveHatchAngle = (p5, mode, baseAngle, facetIndex) => {
  switch (mode) {
    case 'uniform':
      return baseAngle;
    case 'alternating':
      return baseAngle + (facetIndex % 2 === 0 ? 0 : 90);
    case 'random':
      return baseAngle + p5.random(-90, 90);
    case 'facet':
    default:
      // Each facet steps 60 degrees so the six triangles read as distinct planes.
      return baseAngle + facetIndex * 60;
  }
};

/**
 * Parses a CSS hex/named color into RGB components.
 *
 * @param {string} color - Color string
 * @returns {Array<number>|null} `[r, g, b]`, or null if unparseable
 */
const toRgb = (color) => {
  const NAMED = { white: '#ffffff', black: '#000000', grey: '#808080', gray: '#808080', navy: '#000080', pink: '#ffc0cb' };
  let value = NAMED[color] || color;
  if (typeof value !== 'string' || value[0] !== '#') return null;
  if (value.length === 4) {
    value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  if (value.length !== 7) return null;
  return [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16)
  ];
};

/**
 * Picks a hatch color that stays visible against the facet it sits on. Without
 * this, facets whose fill matches the hatch color render as flat blocks.
 *
 * @param {string} facetColor - The facet's fill color
 * @param {Object} colorTheme - Color theme object
 * @returns {string} A contrasting color from the theme
 */
const autoHatchColor = (facetColor, colorTheme) => {
  const rgb = toRgb(facetColor);
  const candidates = ['dark', 'medium', 'light', 'accent']
    .map((key) => colorTheme[key])
    .filter(Boolean);

  if (!rgb) return colorTheme.dark || facetColor;
  const luminance = (c) => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]);
  const base = luminance(rgb);

  let best = null;
  let bestDelta = -1;
  for (const candidate of candidates) {
    const candidateRgb = toRgb(candidate);
    if (!candidateRgb) continue;
    const delta = Math.abs(luminance(candidateRgb) - base);
    if (delta > bestDelta) {
      bestDelta = delta;
      best = candidate;
    }
  }
  return best || colorTheme.dark || facetColor;
};

/**
 * Draws one hexagonal tile as six brush-rendered triangular facets.
 *
 * @param {Object} p5 - p5 instance
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} radius - Hexagon radius
 * @param {Array<Object>} tileComponents - Six component definitions (`{c: 'light'}` etc.)
 * @param {Object} colorTheme - Color theme object
 * @param {Object} options - Brush render options (see DEFAULT_BRUSH_OPTIONS)
 */
export const drawBrushHexatile = (p5, centerX, centerY, radius, tileComponents, colorTheme, options) => {
  const isPointyTop = options.isPointyTop;
  const vertices = hexVertices(centerX, centerY, radius, isPointyTop);

  for (let i = 0; i < 6; i++) {
    const component = tileComponents[i % tileComponents.length] || { c: 'light' };
    const facetColor = colorTheme[component.c || component.color] || colorTheme.light;

    const [x1, y1] = vertices[i];
    const [x2, y2] = vertices[(i + 1) % 6];
    const points = [[x1, y1], [x2, y2], [centerX, centerY]];

    // Reset every state channel so modes never leak between facets.
    brush.noFill();
    brush.noWash();
    brush.noHatch();
    brush.noMass();
    brush.noStroke();

    const mode = options.textureMode;

    if (mode === 'wash' || mode === 'washHatch') {
      brush.wash(facetColor, options.washOpacity);
    }

    if (isWatercolorMode(mode)) {
      brush.fill(facetColor, options.fillOpacity);
      // Bleed is what separates watercolor from a flat wash: pigment creeps past
      // the facet edge, so neighbouring facets blend instead of butting together.
      brush.fillBleed(
        options.bleedStrength,
        options.bleedDirection,
        options.bleedAngle > 0 ? options.bleedAngle : null
      );
      brush.fillTexture(
        options.fillTextureStrength,
        options.fillBorderStrength,
        options.fillScatter
      );
    }

    if (mode === 'hatch' || mode === 'washHatch' || mode === 'watercolorHatch') {
      const hatchColor = options.hatchColorKey === 'auto'
        ? autoHatchColor(facetColor, colorTheme)
        : (colorTheme[options.hatchColorKey] || facetColor);
      brush.hatchStyle(options.hatchBrush, hatchColor, options.hatchWeight);
      brush.hatch(
        options.hatchDistance,
        resolveHatchAngle(p5, options.hatchAngleMode, options.hatchBaseAngle, i),
        {
          rand: options.hatchRandomness > 0 ? options.hatchRandomness : false,
          continuous: false,
          gradient: options.hatchGradient > 0 ? options.hatchGradient : false
        }
      );
    }

    if (mode === 'mass') {
      brush.mass(options.massBrush, facetColor, {
        precision: options.massPrecision,
        strength: options.massStrength,
        gradient: 0,
        outline: false
      });
    }

    if (options.outline) {
      const outlineColor = colorTheme[options.outlineColorKey] || colorTheme.dark;
      brush.set(options.outlineBrush, outlineColor, options.outlineWeight);
    }

    brush.polygon(points);
  }
};

/** Milliseconds of brush work allowed per animation frame. */
const FRAME_BUDGET_MS = 40;

/**
 * Triggers a PNG download of a canvas element.
 *
 * @param {HTMLCanvasElement} canvas - source canvas
 * @param {string} filename - file name without extension
 */
const downloadCanvas = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Hook producing p5 lifecycle callbacks for a WEBGL p5.brush tessellation sketch.
 *
 * Brush strokes are orders of magnitude more expensive than flat fills, so a full
 * canvas is rendered progressively across frames within a time budget. Without this
 * the main thread locks for tens of seconds on every parameter change.
 *
 * @param {Object} config - Configuration
 * @param {Array} config.tile_pattern - `[column][row]` tile pattern
 * @param {Object} config.color_theme - Color theme object
 * @param {boolean} config.isPointyTop - Hexagon orientation
 * @param {Object} config.brushOptions - Brush render options merged over defaults
 * @returns {{setup: Function, draw: Function, invalidate: Function, renderAll: Function}} Callbacks
 */
export function useP5BrushTesselation({
  tile_pattern,
  color_theme,
  isPointyTop = true,
  brushOptions = {}
}) {
  // Latest values are read at draw time so redraws never use stale props.
  const latest = useRef({ tile_pattern, color_theme, isPointyTop, brushOptions });
  latest.current = { tile_pattern, color_theme, isPointyTop, brushOptions };

  // Progressive render state, deliberately outside React so frames stay cheap.
  const job = useRef({ dirty: true, queue: [], index: 0, options: null, onProgress: null });
  const bufferRef = useRef(null);

  /** Marks the canvas as needing a fresh render pass. */
  const invalidate = useCallback(() => {
    job.current.dirty = true;
  }, []);

  /**
   * Creates (or recreates) the offscreen WEBGL buffer the tessellation accumulates
   * into. The main WEBGL canvas is cleared by p5 every frame, so progressive
   * rendering has to target a buffer that persists between frames.
   *
   * @param {Object} p5 - p5 instance
   */
  const ensureBuffer = useCallback((p5) => {
    const existing = bufferRef.current;
    if (existing && existing.width === p5.width && existing.height === p5.height) {
      return existing;
    }
    existing?.remove();
    const buffer = p5.createGraphics(p5.width, p5.height, p5.WEBGL);
    buffer.angleMode(p5.DEGREES);
    bufferRef.current = buffer;
    return buffer;
  }, []);

  const setup = useCallback((p5) => {
    // p5.brush tracks the active sketch in module-level state. React StrictMode
    // mounts twice, so bind the instance here (immediately before createCanvas)
    // rather than in the sketch body, where a second mount could steal it.
    brush.instance(p5);
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    p5.angleMode(p5.DEGREES);
    p5.pixelDensity(Math.min(p5.displayDensity(), 2));
    brush.load();
    resetBrushScale();
    ensureBuffer(p5);
    invalidate();
  }, [invalidate, ensureBuffer]);

  /** Releases the offscreen buffer when the sketch goes away. */
  const teardown = useCallback(() => {
    bufferRef.current?.remove();
    bufferRef.current = null;
  }, []);

  /**
   * Begins a new render pass: resolves options, clears the buffer and builds the
   * queue of hexagons still to be drawn.
   */
  const startPass = useCallback((p5) => {
    const {
      tile_pattern: pattern,
      color_theme: theme,
      isPointyTop: pointyTop,
      brushOptions: rawOptions
    } = latest.current;

    if (!pattern || !pattern.length || !pattern[0] || !pattern[0].length || !theme) {
      return false;
    }

    const options = { ...DEFAULT_BRUSH_OPTIONS, ...rawOptions, isPointyTop: pointyTop };

    // Seeding p5 also seeds p5.brush, keeping renders reproducible.
    p5.randomSeed(options.seed);
    p5.noiseSeed(options.seed);
    setAbsoluteBrushScale(options.brushScale);

    const patternCols = pattern.length;
    const patternRows = pattern[0].length;
    // The buffer is WEBGL, so its origin is at the center. Bake that offset into
    // the tile centers instead of relying on a transform, because p5.brush
    // resolves transforms against the main sketch rather than the buffer.
    const offsetX = p5.width / 2;
    const offsetY = p5.height / 2;
    const queue = computeHexCenters(p5.width, p5.height, options.radius, pointyTop).map(
      ({ x, y, col, row }) => ({
        x: x - offsetX,
        y: y - offsetY,
        components: pattern[col % patternCols][row % patternRows]
      })
    );

    const buffer = ensureBuffer(p5);
    buffer.background(theme.bg || '#ffffff');

    job.current.options = options;
    job.current.theme = theme;
    job.current.queue = queue;
    job.current.index = 0;
    job.current.dirty = false;
    return true;
  }, [ensureBuffer]);

  const draw = useCallback((p5) => {
    const state = job.current;

    // Re-assert ownership each frame so a stale sketch can never redirect output.
    brush.instance(p5);

    if (state.dirty) {
      startPass(p5);
    }

    const buffer = bufferRef.current;
    if (!buffer) return;

    const { options, theme, queue } = state;

    if (options && state.index < queue.length) {
      brush.load(buffer);

      if (options.field && options.field !== 'none') {
        brush.field(options.field);
      } else if (options.wiggle > 0) {
        brush.wiggle(options.wiggle);
      } else {
        brush.noField();
      }

      // Always advance by at least one tile so a slow tile can never stall the pass.
      const started = performance.now();
      do {
        const tile = queue[state.index];
        drawBrushHexatile(buffer, tile.x, tile.y, options.radius, tile.components, theme, options);
        state.index += 1;
      } while (state.index < queue.length && performance.now() - started < FRAME_BUDGET_MS);

      brush.noField();
      brush.load();

      state.onProgress?.(state.index / queue.length);
    }

    // Present the accumulated buffer; the main canvas itself is not persistent.
    p5.clear();
    p5.image(buffer, -p5.width / 2, -p5.height / 2, p5.width, p5.height);
  }, [startPass]);

  /**
   * Exports the tessellation as a PNG.
   *
   * Reads the offscreen buffer rather than the visible canvas: a displayed WEBGL
   * canvas has its drawing buffer discarded once the frame is composited, so it
   * reads back fully transparent from outside the draw loop. The buffer is never
   * composited, so it keeps its pixels.
   *
   * @param {string} filename - file name without extension
   */
  const save = useCallback((filename) => {
    const canvas = bufferRef.current?.canvas;
    if (!canvas) return;
    downloadCanvas(canvas, filename || 'brush-tesselation');
  }, []);

  return { setup, draw, invalidate, teardown, save, job };
}

export default useP5BrushTesselation;
