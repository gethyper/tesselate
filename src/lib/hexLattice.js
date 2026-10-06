/**
 * Triangle-lattice coordinates for flat-top hexatile facets.
 *
 * Every facet of a flat-top hexatile is an equilateral triangle, and across the
 * tiling the facets form a uniform triangular lattice at half the hex-center
 * scale, with up- and down-pointing triangles alternating. Addressing facets by
 * that lattice instead of by `(col, row, facet)` is what makes rows of
 * triangles, 60-degree rhombi, zigzags and chevrons straightforward to express.
 *
 * Screen y points down and vertex `f` sits at angle `60f`, so:
 *   v0 = ( r,    0   )   v1 = ( r/2,  .866r)   v2 = (-r/2,  .866r)
 *   v3 = (-r,    0   )   v4 = (-r/2, -.866r)   v5 = ( r/2, -.866r)
 * Facet 1 spans v1-v2, giving a horizontal base below the center and an apex
 * above it, so it points up. Stepping two facets rotates by 120 degrees and
 * preserves orientation, hence odd facets point up and even facets point down.
 */

/** Positive modulo, so negative columns and rows wrap the way tiles repeat. */
export const mod = (n, m) => ((n % m) + m) % m;

/**
 * Symmetric triangle wave: rises 0..n then falls back to 0, period `2n`.
 * The building block for zigzags and chevrons.
 */
export const zig = (x, n) => {
  const m = mod(x, 2 * n);
  return m < n ? m : 2 * n - m;
};

/** Per-facet offsets along the lattice's two axes, in twelfths of a hex. */
const B6 = [2, 0, -2, -2, 0, 2];
const A6 = [0, 2, 2, 0, -2, -2];

export const TONES = ['light', 'medium', 'dark', 'accent'];

/**
 * Maps a facet to its triangular-lattice cell.
 *
 * @param {number} col - Hexagon column
 * @param {number} row - Hexagon row
 * @param {number} f - Facet index 0-5
 * @returns {Object} `{col, row, f, band, tc, up}` plus the raw lattice axes.
 *   `band` is the horizontal row of triangles, `tc` the position along it, and
 *   `up` whether the triangle points up.
 */
export const facetCoords = (col, row, f) => {
  const b6 = 6 * col + B6[f];
  const a6 = 6 * row + (mod(col, 2) ? 3 : 0) - 3 * col + A6[f];
  // Vertical position in units of sqrt(3)r/12. Doubling a6 puts both axes on a
  // common scale so whole bands fall on multiples of six.
  const y12 = 2 * a6 + b6;
  const band = Math.floor((y12 + 6) / 6);
  const tc = b6 / 2;
  return { col, row, f, a6, b6, y12, band, tc, up: mod(tc + band, 2) === 1 };
};

/**
 * Evaluates `rule` over every facet of a `cols` x `rows` tile.
 *
 * @param {number} cols - Tile width in hexagons
 * @param {number} rows - Tile height in hexagons
 * @param {Function} rule - Receives `facetCoords`, returns a tone name
 * @returns {Array} `tilePattern` indexed `[col][row][facet]`
 */
export const buildPattern = (cols, rows, rule) => {
  const pattern = [];
  for (let col = 0; col < cols; col++) {
    const column = [];
    for (let row = 0; row < rows; row++) {
      const facets = [];
      for (let f = 0; f < 6; f++) {
        const tone = rule(facetCoords(col, row, f));
        facets.push({ c: TONES.includes(tone) ? tone : 'light' });
      }
      column.push(facets);
    }
    pattern.push(column);
  }
  return pattern;
};

/**
 * Checks that `rule` actually repeats over a `cols` x `rows` tile.
 *
 * A rule that does not repeat still renders, but as scrambled noise rather than
 * an obvious error, so this is worth running on every edit. Stepping `cols`
 * columns shifts `tc` by `3 * cols` and leaves `band` alone; stepping `rows`
 * rows shifts `band` by `2 * rows` and leaves `tc` alone. The column step must
 * also be even, because odd columns sit half a hexagon lower.
 *
 * @returns {Array<string>} Human-readable problems, empty when the tile repeats
 */
export const verifyPeriodic = (cols, rows, rule) => {
  const issues = [];
  if (cols % 2 !== 0) {
    issues.push('Tile width must be even — odd columns sit half a hexagon lower, so an odd width breaks the lattice.');
  }
  let colBreak = null;
  let rowBreak = null;
  for (let col = -cols; col <= cols * 2; col++) {
    for (let row = -rows; row <= rows * 2; row++) {
      for (let f = 0; f < 6; f++) {
        const base = rule(facetCoords(col, row, f));
        if (colBreak === null && rule(facetCoords(col + cols, row, f)) !== base) {
          colBreak = `Pattern does not repeat every ${cols} columns (first mismatch at column ${col}, row ${row}, facet ${f}).`;
        }
        if (rowBreak === null && rule(facetCoords(col, row + rows, f)) !== base) {
          rowBreak = `Pattern does not repeat every ${rows} rows (first mismatch at column ${col}, row ${row}, facet ${f}).`;
        }
      }
    }
  }
  if (colBreak) issues.push(colBreak);
  if (rowBreak) issues.push(rowBreak);
  return issues;
};

/** Share of the tile taken by each tone, as rounded percentages. */
export const toneFractions = (pattern) => {
  const counts = {};
  let total = 0;
  pattern.forEach((column) => column.forEach((facets) => facets.forEach(({ c }) => {
    counts[c] = (counts[c] || 0) + 1;
    total += 1;
  })));
  return Object.fromEntries(
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tone, n]) => [tone, Math.round((n / total) * 100)])
  );
};

/** Renders a pattern as the JS literal `TileDesigns.js` expects. */
export const formatDesignLiteral = (name, pattern) => {
  const columns = pattern.map((column) => {
    const rows = column.map((facets) => {
      const facetList = facets
        .map(({ c, b }) => (b ? `{c: "${c}", b: "${b}"}` : `{c: "${c}"}`))
        .join(', ');
      return `      [${facetList}]`;
    });
    return `    [\n${rows.join(',\n')}\n    ]`;
  });
  return `  '${name}': {\n    tileShape: "flatTopHexatile",\n    tilePattern: [\n${columns.join(',\n')}\n    ]\n  },`;
};

/**
 * Edges of facet `f`, named as they are authored: `a` is the spoke out to vertex
 * `f`, `b` the outer hexagon edge, `c` the spoke back from vertex `f + 1`.
 *
 * A facet's `c` edge is the same line as the next facet's `a`, so callers that
 * stroke these must dedupe or the shared spoke is struck twice and reads darker
 * than the ones around it.
 *
 * @param {string} border - "all", "a", "b", "c", or falsy for no border.
 * @returns {Array<string>} the edge names to stroke.
 */
export const borderEdges = (border) => {
  if (!border) return [];
  return border === 'all' ? ['a', 'b', 'c'] : [border];
};

/** The order shift-clicking steps a facet's border through. */
export const BORDER_CYCLE = [null, 'all', 'a', 'b', 'c'];

/**
 * Compiles a user-written rule body into a tone function.
 *
 * The body is evaluated per facet with the lattice coordinates and the helpers
 * in scope, so `return up ? 'dark' : 'light'` is a complete rule. A bare
 * expression is also accepted for brevity.
 *
 * @returns {{rule: Function|null, error: string|null}}
 */
export const compileRule = (source) => {
  const body = source.trim();
  if (!body) return { rule: null, error: 'Rule is empty.' };
  const wrapped = /\breturn\b/.test(body) ? body : `return (${body});`;
  let fn;
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function('coords', 'mod', 'zig', 'TONES', `
      const { col, row, f, band, tc, up, a6, b6, y12 } = coords;
      ${wrapped}
    `);
  } catch (error) {
    return { rule: null, error: `Syntax error: ${error.message}` };
  }
  const rule = (coords) => fn(coords, mod, zig, TONES);
  // Sample a spread of facets, not just one: a rule can be fine on facet 0 and
  // return an unknown tone on the first up-pointing triangle or odd column.
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      for (let f = 0; f < 6; f++) {
        let tone;
        try {
          tone = rule(facetCoords(col, row, f));
        } catch (error) {
          return { rule: null, error: `Error while running rule: ${error.message}` };
        }
        if (!TONES.includes(tone)) {
          return {
            rule: null,
            error: `Rule returned ${JSON.stringify(tone)} at column ${col}, row ${row}, facet ${f} — expected one of ${TONES.join(', ')}.`
          };
        }
      }
    }
  }
  return { rule, error: null };
};

/** Starting points that cover the shapes the lattice makes available. */
export const RULE_PRESETS = [
  {
    name: 'Triangle rows',
    cols: 2,
    rows: 2,
    source: "up ? (mod(band, 2) === 0 ? 'dark' : 'medium') : 'light'"
  },
  {
    name: 'Vertical rhombi',
    cols: 4,
    rows: 2,
    source: [
      "// A vertical rhombus is an up triangle stacked on the down triangle below it.",
      "const anchor = up ? band : band - 1;",
      "const k = (anchor - mod(tc + 1, 2)) / 2;",
      "const p = mod(tc + 2 * k, 4);",
      "return p === 0 ? 'dark' : p === 2 ? 'light' : 'medium';"
    ].join('\n')
  },
  {
    name: 'Zigzag bands',
    cols: 6,
    rows: 18,
    source: [
      "// Drift the stripe index by a triangle wave to sweep the bands sideways.",
      "const s = mod(tc - zig(band, 18), 18);",
      "return s < 6 ? 'light' : s < 12 ? 'dark' : 'medium';"
    ].join('\n')
  },
  {
    name: 'Chevrons',
    cols: 4,
    rows: 3,
    source: [
      "const s = mod(band + zig(tc, 6), 6);",
      "return s < 2 ? 'light' : s < 4 ? 'dark' : 'medium';"
    ].join('\n')
  },
  {
    name: 'Whole hexagons',
    cols: 2,
    rows: 2,
    source: "mod(col + row, 2) === 0 ? 'dark' : 'light'"
  },
  {
    name: 'Half hexagons',
    cols: 2,
    rows: 2,
    source: [
      "// Facets 3, 4 and 5 are the top half of a hexagon; 0, 1 and 2 the bottom.",
      "const top = f >= 3;",
      "return top ? 'light' : 'dark';"
    ].join('\n')
  }
];
