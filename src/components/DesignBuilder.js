import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ColorThemes from './ColorThemes';
import TileDesigns, { DRAFT_STORAGE_KEY } from './TileDesigns';

import {
  BORDER_CYCLE,
  RULE_PRESETS,
  TONES,
  borderEdges,
  buildPattern,
  compileRule,
  facetCoords,
  formatDesignLiteral,
  mod,
  toneFractions,
  verifyPeriodic
} from '../lib/hexLattice';
import { computeHexCenters, hexVertices } from '../hooks/useP5BrushTesselation';

/**
 * Needlepoint plates the designs were drawn from, so a design can be corrected
 * against its source rather than from memory. Designs invented for this app have
 * no plate and simply show no reference.
 */
const PLATE_BY_DESIGN = {
  ribbonedStars: '7099',
  venetianTriangles: '7100',
  sanMarcoLightning: '7101',
  sanMarcoSteppedBoxes: '7103',
  turkishSky: '7108',
  // Plate 7109 is waiting for a Palermo Meander; the design drawn from it
  // became Harlequin Chevrons instead, which owes the plate nothing.
  palermoMeander: '7109',
  egyptianHexapod: '7111',
  shimmeringDiamonds: '7112'
};

/** Designs that can be loaded for correction, plate-backed ones listed first. */
const LOADABLE_DESIGNS = Object.keys(TileDesigns)
  .filter((name) => Array.isArray(TileDesigns[name]?.tilePattern))
  .sort((a, b) => {
    const plated = Number(Boolean(PLATE_BY_DESIGN[b])) - Number(Boolean(PLATE_BY_DESIGN[a]));
    return plated || a.localeCompare(b);
  });

const PREVIEW_RADIUS = 26;
// Clicking steps through every tone the themes define, accent included.
const TONE_CYCLE = [...TONES];
const SQRT3 = Math.sqrt(3);

/**
 * Sizes and centers the single-tile editor.
 *
 * `computeHexCenters` puts hexagon (0, 0) at the canvas origin, so without an
 * offset the first tile hangs off the top-left corner. The radius also has to
 * shrink for large tiles — a 6 x 18 repeat has 108 hexagons and will not fit at
 * a fixed size.
 */
const editorLayout = (width, height, cols, rows) => {
  const radius = Math.max(7, Math.min(
    46,
    width / ((cols + 1.5) * 1.5),
    height / ((rows + 1.5) * SQRT3)
  ));
  return {
    radius,
    offsetX: width / 2 - ((cols - 1) * 1.5 * radius) / 2,
    offsetY: height / 2 - ((rows - 1) * SQRT3 * radius + (SQRT3 * radius) / 2) / 2
  };
};

/** Fills one facet triangle on a 2D context. */
const fillFacet = (ctx, x, y, vertices, facet, color) => {
  const a = vertices[facet];
  const b = vertices[(facet + 1) % 6];
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

/**
 * Strokes the edges a facet's border asks for.
 *
 * A facet's `c` edge is the same line as the next facet's `a`, so a hexagon
 * whose facets all carry `all` would stroke every spoke twice. Edges are keyed
 * by their endpoints and skipped once drawn, which keeps a shared spoke the same
 * weight as a lone one.
 */
const strokeBorder = (ctx, x, y, vertices, facet, border, drawn) => {
  const a = vertices[facet];
  const b = vertices[(facet + 1) % 6];
  const segments = { a: [[x, y], a], b: [a, b], c: [b, [x, y]] };
  borderEdges(border).forEach((edge) => {
    const [from, to] = segments[edge];
    const key = [from, to]
      .map((p) => `${Math.round(p[0] * 2)},${Math.round(p[1] * 2)}`)
      .sort()
      .join('|');
    if (drawn.has(key)) return;
    drawn.add(key);
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.stroke();
  });
};

/** True when `(px, py)` falls inside the triangle `(x, y) - a - b`. */
const insideFacet = (px, py, x, y, a, b) => {
  const sign = (ax, ay, bx, by, cx, cy) => (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  const d1 = sign(px, py, x, y, a[0], a[1]);
  const d2 = sign(px, py, a[0], a[1], b[0], b[1]);
  const d3 = sign(px, py, b[0], b[1], x, y);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

/**
 * Builder for hexatile designs.
 *
 * Two ways in, sharing one pattern: paint facets directly for small tiles, or
 * write a rule over the triangle-lattice coordinates for the large repeats
 * where painting hundreds of facets by hand is impractical. A rule can be baked
 * into the grid and then hand-tweaked, so the two modes compose.
 */
const DesignBuilder = () => {
  const [cols, setCols] = useState(2);
  const [rows, setRows] = useState(2);
  const [mode, setMode] = useState('paint');
  const [themeName, setThemeName] = useState('Basic Bee');
  const [designName, setDesignName] = useState('myDesign');
  const [ruleSource, setRuleSource] = useState(RULE_PRESETS[0].source);
  const [grid, setGrid] = useState(() => buildPattern(2, 2, () => 'light'));
  const [copied, setCopied] = useState(false);
  const [loadedFrom, setLoadedFrom] = useState('');
  const [showPlate, setShowPlate] = useState(true);
  const [previewScale, setPreviewScale] = useState(PREVIEW_RADIUS);
  const [borderTone, setBorderTone] = useState('bg');
  const undoStack = useRef([]);

  const previewRef = useRef(null);
  const editorRef = useRef(null);
  const theme = ColorThemes[themeName] || ColorThemes['Basic Bee'];

  const compiled = useMemo(() => (mode === 'rule' ? compileRule(ruleSource) : { rule: null, error: null }), [mode, ruleSource]);

  const periodicity = useMemo(() => {
    if (mode !== 'rule' || !compiled.rule) return [];
    try {
      return verifyPeriodic(cols, rows, compiled.rule);
    } catch (error) {
      return [`Error while checking the tile: ${error.message}`];
    }
  }, [mode, compiled.rule, cols, rows]);

  // In rule mode the pattern is derived; in paint mode the grid is the source of
  // truth. Keeping both behind one value means preview, export and tone counts
  // never have to care which mode is active.
  const pattern = useMemo(() => {
    if (mode === 'rule' && compiled.rule) {
      try {
        return buildPattern(cols, rows, compiled.rule);
      } catch (error) {
        return null;
      }
    }
    return grid;
  }, [mode, compiled.rule, cols, rows, grid]);

  /** Resizes the painted grid, keeping whatever already overlaps the new size. */
  const resize = useCallback((nextCols, nextRows) => {
    const c = Math.max(1, Math.min(24, nextCols));
    const r = Math.max(1, Math.min(24, nextRows));
    setCols(c);
    setRows(r);
    setGrid((previous) => buildPattern(c, r, ({ col, row, f }) => previous[col]?.[row]?.[f]?.c || 'light'));
  }, []);

  /** Copies the current rule output into the painted grid for hand-tweaking. */
  const bakeRuleIntoGrid = useCallback(() => {
    if (!compiled.rule) return;
    setGrid(buildPattern(cols, rows, compiled.rule));
    setMode('paint');
  }, [compiled.rule, cols, rows]);

  const applyPreset = useCallback((preset) => {
    setRuleSource(preset.source);
    setMode('rule');
    resize(preset.cols, preset.rows);
  }, [resize]);

  /**
   * Loads a shipped design into the painted grid so it can be corrected by hand
   * against its plate. The facets are deep-copied because the grid is mutated
   * in place while painting and `TileDesigns` is a live module-level object.
   */
  const loadDesign = useCallback((name) => {
    const source = TileDesigns[name]?.tilePattern;
    if (!Array.isArray(source) || !source.length) return;
    undoStack.current = [];
    setCols(source.length);
    setRows(source[0].length);
    setGrid(source.map((column) => column.map((facets) => facets.map((facet) => ({ c: facet.c })))));
    setMode('paint');
    setDesignName(name);
    setLoadedFrom(name);
  }, []);

  /** Throws away every correction and reloads the shipped design. */
  const revertDesign = useCallback(() => {
    if (loadedFrom) loadDesign(loadedFrom);
  }, [loadedFrom, loadDesign]);

  const undo = useCallback(() => {
    const previous = undoStack.current.pop();
    if (previous) setGrid(previous);
  }, []);

  // Repaint the tiled preview whenever the pattern or theme changes.
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !pattern) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = theme.bg || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centers = computeHexCenters(width, height, previewScale, false);
    centers.forEach(({ x, y, col, row }) => {
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, previewScale, false);
      for (let f = 0; f < 6; f++) {
        fillFacet(ctx, x, y, vertices, f, theme[facets[f].c] || '#888');
      }
    });

    // Borders are stroked after every fill, so a facet drawn later cannot paint
    // over an edge it shares with one drawn earlier.
    ctx.strokeStyle = theme[borderTone] || '#222';
    ctx.lineWidth = Math.max(1, previewScale / 14);
    ctx.lineCap = 'round';
    const drawn = new Set();
    centers.forEach(({ x, y, col, row }) => {
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, previewScale, false);
      for (let f = 0; f < 6; f++) {
        if (facets[f].b) strokeBorder(ctx, x, y, vertices, f, facets[f].b, drawn);
      }
    });
  }, [pattern, theme, previewScale, borderTone]);

  // Repaint the editable single-tile view. Drawn at the same geometry as the
  // preview so a facet is clicked where it actually appears in the tiling.
  useEffect(() => {
    const canvas = editorRef.current;
    if (!canvas || !pattern) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const { radius, offsetX, offsetY } = editorLayout(width, height, pattern.length, pattern[0].length);
    const centers = computeHexCenters(width, height, radius, false);
    centers.forEach(({ x: cx, y: cy, col, row }) => {
      const x = cx + offsetX;
      const y = cy + offsetY;
      const inTile = col >= 0 && col < pattern.length && row >= 0 && row < pattern[0].length;
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, radius, false);
      ctx.globalAlpha = inTile ? 1 : 0.22;
      for (let f = 0; f < 6; f++) {
        fillFacet(ctx, x, y, vertices, f, theme[facets[f].c] || '#888');
      }
      ctx.globalAlpha = 1;
      if (inTile) {
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        for (let f = 0; f < 6; f++) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(vertices[f][0], vertices[f][1]);
          ctx.stroke();
        }
      }
    });

    // Authored borders go over the faint facet guides, so an edge that carries a
    // border is told apart from the spokes that merely divide the hexagon.
    ctx.strokeStyle = theme[borderTone] || '#222';
    ctx.lineWidth = Math.max(1.5, radius / 12);
    ctx.lineCap = 'round';
    const drawn = new Set();
    centers.forEach(({ x: cx, y: cy, col, row }) => {
      const x = cx + offsetX;
      const y = cy + offsetY;
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, radius, false);
      ctx.globalAlpha = col >= 0 && col < pattern.length && row >= 0 && row < pattern[0].length ? 1 : 0.22;
      for (let f = 0; f < 6; f++) {
        if (facets[f].b) strokeBorder(ctx, x, y, vertices, f, facets[f].b, drawn);
      }
      ctx.globalAlpha = 1;
    });
  }, [pattern, theme, borderTone]);

  /**
   * Finds the facet under the pointer, or null when the pointer is outside the
   * editable tile. Shared by painting and the coordinate readout so both agree.
   */
  const facetUnderCursor = useCallback((event) => {
    const canvas = editorRef.current;
    if (!canvas) return null;
    const box = canvas.getBoundingClientRect();
    const { radius, offsetX, offsetY } = editorLayout(box.width, box.height, cols, rows);
    const px = event.clientX - box.left - offsetX;
    const py = event.clientY - box.top - offsetY;

    const centers = computeHexCenters(box.width, box.height, radius, false);
    for (const { x, y, col, row } of centers) {
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      if (Math.hypot(px - x, py - y) > radius * 1.05) continue;
      const vertices = hexVertices(x, y, radius, false);
      for (let f = 0; f < 6; f++) {
        if (insideFacet(px, py, x, y, vertices[f], vertices[(f + 1) % 6])) {
          return facetCoords(col, row, f);
        }
      }
    }
    return null;
  }, [cols, rows]);

  /**
   * Plain click steps the facet's tone; shift-click steps its border instead, so
   * tone and edge are authored with the same gesture on the same target.
   */
  const paintAt = useCallback((event, editBorder) => {
    if (mode !== 'paint') return;
    const target = facetUnderCursor(event);
    if (!target) return;
    const { col, row, f } = target;
    setGrid((previous) => {
      undoStack.current.push(previous);
      if (undoStack.current.length > 80) undoStack.current.shift();
      const next = previous.map((column) => column.map((facets) => facets.map((facet) => ({ ...facet }))));
      const facet = next[col][row][f];
      if (editBorder) {
        const step = BORDER_CYCLE.indexOf(facet.b || null);
        const border = BORDER_CYCLE[(step + 1) % BORDER_CYCLE.length];
        if (border) facet.b = border;
        else delete facet.b;
      } else {
        facet.c = TONE_CYCLE[(TONE_CYCLE.indexOf(facet.c) + 1) % TONE_CYCLE.length];
      }
      return next;
    });
  }, [mode, facetUnderCursor]);

  const literal = useMemo(() => (pattern ? formatDesignLiteral(designName || 'myDesign', pattern) : ''), [pattern, designName]);
  const fractions = useMemo(() => (pattern ? toneFractions(pattern) : {}), [pattern]);

  const copyLiteral = useCallback(() => {
    if (!literal) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    // `writeText` rejects when the document is not focused, so keep a fallback.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(literal).then(done, () => window.prompt('Copy this design:', literal));
      return;
    }
    window.prompt('Copy this design:', literal);
  }, [literal]);

  /**
   * Saves the design into the draft store `TileDesigns` reads at load, then
   * opens the real brush renderer. That is the only way to see the design with
   * texture — the builder's own preview is flat for instant feedback.
   */
  const previewWithBrush = useCallback(() => {
    if (!pattern) return;
    const name = designName || 'myDesign';
    let drafts = {};
    try {
      drafts = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) || '{}');
    } catch (error) {
      drafts = {};
    }
    drafts[name] = { tileShape: 'flatTopHexatile', tilePattern: pattern };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    const params = new URLSearchParams({
      pattern: name,
      size: '40',
      theme: themeName,
      brush: 'true',
      secret: 'true'
    });
    // A full load is required: TileDesigns reads the draft store at module load.
    window.open(`${window.location.pathname}#/tesselate?${params}`, '_blank');
  }, [pattern, designName, themeName]);

  const [hover, setHover] = useState(null);
  const accent = theme.dark || '#333';

  return (
    <div style={styles.page}>
      {/* The tiling fills the window and the controls float over it, so the
          pattern is read at size rather than through a letterboxed panel. */}
      <canvas ref={previewRef} style={styles.previewCanvas} />

      <div style={styles.leftStack}>
        <section style={styles.card}>
          <header style={styles.cardHead}>
            <span>Tile {cols} &times; {rows}</span>
            {hover && (
              <span style={styles.coords}>
                band {hover.band} · tc {hover.tc} · {hover.up ? 'up' : 'down'} · facet {hover.f}
              </span>
            )}
          </header>
          <canvas
            ref={editorRef}
            style={{ ...styles.editorCanvas, cursor: mode === 'paint' ? 'pointer' : 'default' }}
            onClick={(event) => paintAt(event, event.shiftKey)}
            onMouseMove={(event) => setHover(facetUnderCursor(event))}
            onMouseLeave={() => setHover(null)}
          />
        </section>

        {showPlate && PLATE_BY_DESIGN[loadedFrom] && (
          <section style={styles.card}>
            <header style={styles.cardHead}>Plate {PLATE_BY_DESIGN[loadedFrom]}</header>
            <img
              src={`${process.env.PUBLIC_URL}/images/plates/cr_${PLATE_BY_DESIGN[loadedFrom]}.jpg`}
              alt={`Needlepoint plate ${PLATE_BY_DESIGN[loadedFrom]}`}
              style={styles.plateImage}
            />
          </section>
        )}
      </div>

      <aside style={styles.panel}>
        <h1 style={styles.wordmark}>
          <svg width="22" height="22" viewBox="0 0 24 24" style={styles.glyph}>
            <polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          TESSELLATIONS
        </h1>
        <p style={styles.subtitle}>Pattern builder</p>

        <section style={styles.section}>
          <label style={styles.label}>Correct a design</label>
          <select value={loadedFrom} onChange={(event) => loadDesign(event.target.value)} style={styles.select}>
            <option value="">Load a shipped design…</option>
            {LOADABLE_DESIGNS.map((name) => (
              <option key={name} value={name}>
                {PLATE_BY_DESIGN[name] ? `${name} — plate ${PLATE_BY_DESIGN[name]}` : name}
              </option>
            ))}
          </select>
          {loadedFrom && (
            <div style={{ ...styles.row, marginTop: 8 }}>
              <button onClick={undo} style={styles.chip}>Undo</button>
              <button onClick={revertDesign} style={styles.chip}>Revert</button>
              {PLATE_BY_DESIGN[loadedFrom] && (
                <button
                  onClick={() => setShowPlate((v) => !v)}
                  style={{ ...styles.chip, ...(showPlate ? { borderColor: accent, color: accent } : {}) }}
                >
                  Plate
                </button>
              )}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Tile size</label>
          <div style={styles.row}>
            <Stepper label="cols" value={cols} onChange={(v) => resize(v, rows)} step={2} />
            <Stepper label="rows" value={rows} onChange={(v) => resize(cols, v)} step={1} />
          </div>
          <p style={styles.hint}>
            Columns must be even — odd columns sit half a hexagon lower, so an odd
            width cannot repeat.
          </p>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Preview</label>
          <div style={styles.row}>
            <div style={styles.stepper}>
              <button onClick={() => setPreviewScale((v) => Math.max(6, v - 4))} style={styles.stepButton}>−</button>
              <span style={styles.stepValue}>{previewScale}<small style={styles.stepLabel}>px</small></span>
              <button onClick={() => setPreviewScale((v) => Math.min(90, v + 4))} style={styles.stepButton}>+</button>
            </div>
            <select value={borderTone} onChange={(e) => setBorderTone(e.target.value)} style={styles.inlineSelect}>
              {['bg', ...TONES].map((tone) => <option key={tone} value={tone}>border: {tone}</option>)}
            </select>
          </div>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Mode</label>
          <div style={styles.row}>
            {['paint', 'rule'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  ...styles.toggle,
                  ...(mode === m ? { background: accent, borderColor: accent, color: '#fff' } : {})
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {mode === 'paint' ? (
          <section style={styles.section}>
            <label style={styles.label}>Tones</label>
            <div style={styles.swatchRow}>
              {TONES.map((tone) => (
                <span key={tone} style={{ ...styles.swatch, background: theme[tone] || '#888' }} title={tone} />
              ))}
            </div>
            <p style={styles.hint}>
              Click a facet to step it light → medium → dark → accent. Shift-click
              steps its border: all → a → b → c → none, where a and c are the
              spokes and b the outer edge.
            </p>
          </section>
        ) : (
          <section style={styles.section}>
            <label style={styles.label}>Rule</label>
            <textarea
              value={ruleSource}
              onChange={(event) => setRuleSource(event.target.value)}
              spellCheck={false}
              style={styles.textarea}
            />
            <p style={styles.hint}>
              In scope: <code>band</code>, <code>tc</code>, <code>up</code>, <code>col</code>,
              {' '}<code>row</code>, <code>f</code>, plus <code>mod()</code> and <code>zig()</code>.
              Return a tone name.
            </p>
            {compiled.error && <p style={styles.error}>{compiled.error}</p>}
            {periodicity.map((issue) => <p key={issue} style={styles.error}>{issue}</p>)}
            {!compiled.error && periodicity.length === 0 && (
              <p style={styles.ok}>Tile repeats cleanly at {cols} &times; {rows}.</p>
            )}
            <button
              onClick={bakeRuleIntoGrid}
              disabled={!compiled.rule}
              style={{ ...styles.button, background: accent }}
            >
              Bake into grid and switch to paint
            </button>
          </section>
        )}

        <section style={styles.section}>
          <label style={styles.label}>Presets</label>
          <div style={styles.presetGrid}>
            {RULE_PRESETS.map((preset) => (
              <button key={preset.name} onClick={() => applyPreset(preset)} style={styles.preset}>
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Theme</label>
          <select value={themeName} onChange={(event) => setThemeName(event.target.value)} style={styles.select}>
            {Object.keys(ColorThemes).map((name) => <option key={name}>{name}</option>)}
          </select>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Export</label>
          <input
            value={designName}
            onChange={(event) => setDesignName(event.target.value.replace(/[^A-Za-z0-9]/g, ''))}
            style={styles.input}
            placeholder="designName"
          />
          <button onClick={copyLiteral} style={{ ...styles.button, background: accent }} disabled={!literal}>
            {copied ? 'Copied' : 'Copy for TileDesigns.js'}
          </button>
          <button onClick={previewWithBrush} style={styles.buttonGhost} disabled={!pattern}>
            Preview with brush texture
          </button>
          <p style={styles.hint}>
            {Object.entries(fractions).map(([tone, pct]) => `${tone} ${pct}%`).join(' · ')}
            {pattern ? ` · ${pattern.length * pattern[0].length * 6} facets` : ''}
          </p>
        </section>
      </aside>
    </div>
  );
};

const Stepper = ({ label, value, onChange, step }) => (
  <div style={styles.stepper}>
    <button onClick={() => onChange(value - step)} style={styles.stepButton}>−</button>
    <span style={styles.stepValue}>{value}<small style={styles.stepLabel}>{label}</small></span>
    <button onClick={() => onChange(value + step)} style={styles.stepButton}>+</button>
  </div>
);

const FROST = 'linear-gradient(135deg, rgba(255,255,255,0.78), rgba(240,240,255,0.78))';
const SHADOW = '0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14)';
const INK = 'rgba(0,0,0,0.78)';
const MUTED = 'rgba(0,0,0,0.5)';
const LINE = 'rgba(0,0,0,0.23)';

const styles = {
  page: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    color: INK,
    font: '13px/1.5 Inter, -apple-system, system-ui, sans-serif'
  },
  previewCanvas: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },

  leftStack: {
    position: 'absolute',
    top: 16,
    left: 16,
    bottom: 16,
    width: 340,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    borderRadius: 4,
    overflow: 'hidden',
    background: FROST,
    backdropFilter: 'blur(10px)',
    border: '1px solid white',
    boxShadow: SHADOW
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    padding: '9px 12px',
    font: "500 10px/1 'Tourney', Inter, sans-serif",
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: MUTED
  },
  editorCanvas: { flex: 1, width: '100%', minHeight: 0, display: 'block' },
  plateImage: { flex: 1, minHeight: 0, width: '100%', objectFit: 'contain' },
  coords: { color: INK, fontVariantNumeric: 'tabular-nums', textTransform: 'none', letterSpacing: 0 },

  panel: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 310,
    maxHeight: 'calc(100vh - 32px)',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: 16,
    borderRadius: 4,
    background: FROST,
    backdropFilter: 'blur(10px)',
    border: '1px solid white',
    boxShadow: SHADOW
  },
  wordmark: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: 0,
    font: "500 20px/1 'Tourney', Inter, sans-serif",
    letterSpacing: 1,
    color: INK
  },
  glyph: { flex: '0 0 auto' },
  subtitle: {
    margin: '4px 0 18px 32px',
    font: '500 10px/1 Inter, sans-serif',
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: MUTED
  },

  section: { margin: '0 0 18px' },
  label: {
    display: 'block',
    font: '500 10px/1 Inter, sans-serif',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: MUTED,
    margin: '0 0 8px'
  },
  row: { display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' },
  hint: { margin: '8px 0 0', fontSize: 11, lineHeight: 1.5, color: MUTED },
  error: { margin: '8px 0 0', fontSize: 11, color: '#a3321f' },
  ok: { margin: '8px 0 0', fontSize: 11, color: '#1f6b3a' },

  select: {
    width: '100%',
    padding: '9px 8px',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    font: '13px Inter, sans-serif'
  },
  inlineSelect: {
    flex: 1,
    padding: '7px 8px',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    font: '12px Inter, sans-serif'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '9px 8px',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    font: '12px ui-monospace, SFMono-Regular, Menlo, monospace'
  },
  textarea: {
    width: '100%',
    minHeight: 190,
    boxSizing: 'border-box',
    padding: 9,
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
    resize: 'vertical'
  },

  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: 3,
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)'
  },
  stepButton: {
    width: 24,
    height: 24,
    border: 0,
    borderRadius: 3,
    background: 'rgba(0,0,0,.06)',
    color: INK,
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1
  },
  stepValue: { minWidth: 42, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  stepLabel: {
    display: 'block',
    fontSize: 9,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: '.08em'
  },

  toggle: {
    flex: 1,
    padding: '8px 0',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    cursor: 'pointer',
    textTransform: 'capitalize',
    font: '13px Inter, sans-serif'
  },
  chip: {
    padding: '6px 12px',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    cursor: 'pointer',
    fontSize: 12
  },
  swatchRow: { display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden', border: `1px solid ${LINE}` },
  swatch: { flex: 1, height: 30 },

  presetGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 },
  preset: {
    padding: '8px 4px',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    cursor: 'pointer',
    fontSize: 11
  },

  button: {
    width: '100%',
    marginTop: 9,
    padding: '10px 0',
    border: 0,
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    font: "500 12px/1 Inter, sans-serif",
    letterSpacing: '.04em',
    textTransform: 'uppercase'
  },
  buttonGhost: {
    width: '100%',
    marginTop: 7,
    padding: '10px 0',
    borderRadius: 4,
    border: `1px solid ${LINE}`,
    background: 'rgba(255,255,255,.72)',
    color: INK,
    cursor: 'pointer',
    font: "500 12px/1 Inter, sans-serif",
    letterSpacing: '.04em',
    textTransform: 'uppercase'
  }
};

export default DesignBuilder;
