/**
 * Square Tile Designs
 *
 * Each square tile is divided into 4 triangles from the center:
 * - Index 0: Top triangle
 * - Index 1: Right triangle
 * - Index 2: Bottom triangle
 * - Index 3: Left triangle
 *
 * Pattern schema: { c: "color_key", s: "stroke_color_key", sw: stroke_weight }
 */

const SquareTileDesigns = {

  // 1. Checkerboard - Classic alternating pattern
  'checkerboard': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}]
      ],
      [
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ]
    ]
  },

  // 2. Pinwheel - Rotating triangles creating a spinning effect
  'pinwheel': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ],
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ]
    ]
  },

  // 3. Windmill - Four-blade spinning pattern
  'windmill': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"light"}]
      ],
      [
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"dark"}],
        [{c:"light"},{c:"medium"},{c:"dark"},{c:"medium"}]
      ]
    ]
  },

  // 4. Herringbone - Classic zigzag pattern
  'herringbone': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"dark"},{c:"dark"}]
      ],
      [
        [{c:"light"},{c:"light"},{c:"dark"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"light"}]
      ]
    ]
  },

  // 5. Diamond - Diagonal diamond pattern
  'diamond': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ]
    ]
  },

  // 6. Hourglass - Top/bottom vs left/right creating hourglass shapes
  'hourglass': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ]
    ]
  },

  // 7. Bowtie - Alternating bowtie/hourglass pattern
  'bowtie': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ]
    ]
  },

  // 8. Chevron - V-shaped pattern with 3 colors
  'chevron': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"light"},{c:"medium"},{c:"dark"},{c:"medium"}]
      ],
      [
        [{c:"dark"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"light"},{c:"medium"},{c:"dark"},{c:"medium"}]
      ]
    ]
  },

  // 9. Quarter Turn - Each quadrant rotates the pattern
  'quarterTurn': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"accent"},{c:"dark"},{c:"medium"},{c:"light"}],
        [{c:"light"},{c:"accent"},{c:"dark"},{c:"medium"}]
      ],
      [
        [{c:"medium"},{c:"light"},{c:"accent"},{c:"dark"}],
        [{c:"dark"},{c:"medium"},{c:"light"},{c:"accent"}]
      ]
    ]
  },

  // 10. Basketweave - Woven appearance with alternating orientations
  'basketweave': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"}]
      ],
      [
        [{c:"medium"},{c:"medium"},{c:"dark"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"medium"},{c:"medium"}]
      ]
    ]
  },

  // Bonus patterns

  // 11. Solid - Simple solid color squares
  'solid': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}]
      ]
    ]
  },

  // 12. Striped Diagonal - Diagonal stripes
  'stripedDiagonal': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ],
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ]
    ]
  },

  // 13. Optical Illusion - Creates depth perception
  'opticalIllusion': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"medium"},{c:"dark"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"light"}]
      ],
      [
        [{c:"dark"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"dark"}]
      ]
    ]
  },

  // 14. Tumbling Blocks - 3D cube illusion
  'tumblingBlocks': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"dark"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"medium"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"medium"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"medium"}]
      ]
    ]
  },

  // 15. Star Burst - Radiating star pattern
  'starBurst': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"accent"},{c:"dark"},{c:"accent"},{c:"dark"}],
        [{c:"dark"},{c:"accent"},{c:"dark"},{c:"accent"}]
      ],
      [
        [{c:"dark"},{c:"accent"},{c:"dark"},{c:"accent"}],
        [{c:"accent"},{c:"dark"},{c:"accent"},{c:"dark"}]
      ]
    ]
  },

  // 16. Maze - Interlocking maze-like pattern
  'maze': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"light"}],
        [{c:"dark"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"light"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ]
    ]
  },

  // 17. Gradient Fade - Smooth color transition
  'gradientFade': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"light"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"dark"}]
      ],
      [
        [{c:"light"},{c:"medium"},{c:"light"},{c:"medium"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ]
    ]
  },

  // 18. Argyle - Classic argyle diamond pattern
  'argyle': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"accent"},{c:"dark"},{c:"accent"}],
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}]
      ],
      [
        [{c:"medium"},{c:"medium"},{c:"medium"},{c:"medium"}],
        [{c:"dark"},{c:"accent"},{c:"dark"},{c:"accent"}]
      ]
    ]
  },

  // 19. Cross - Interlocking cross pattern
  'cross': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}]
      ],
      [
        [{c:"dark"},{c:"dark"},{c:"dark"},{c:"dark"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ]
    ]
  },

  // 20. Confetti - Random-looking scattered pattern
  'confetti': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"accent"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"accent"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"accent"}],
        [{c:"accent"},{c:"medium"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"accent"},{c:"medium"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"accent"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"accent"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"accent"}]
      ],
      [
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"accent"}],
        [{c:"accent"},{c:"medium"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"accent"},{c:"medium"},{c:"dark"}],
        [{c:"dark"},{c:"light"},{c:"accent"},{c:"medium"}]
      ],
      [
        [{c:"dark"},{c:"light"},{c:"accent"},{c:"medium"}],
        [{c:"medium"},{c:"dark"},{c:"light"},{c:"accent"}],
        [{c:"accent"},{c:"medium"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"accent"},{c:"medium"},{c:"dark"}]
      ]
    ]
  },

  // ===== Circle-optimized patterns =====
  // For circle tile style: index 0 = circle color, index 1 = background color

  // 21. Polka Dots - Classic alternating dots
  'polkaDots': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}]
      ],
      [
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ]
    ]
  },

  // 22. Polka Inverse - Dots with dark background
  'polkaInverse': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"accent"},{c:"dark"},{c:"accent"},{c:"dark"}]
      ],
      [
        [{c:"accent"},{c:"dark"},{c:"accent"},{c:"dark"}],
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}]
      ]
    ]
  },

  // 23. Bubble Grid - Uniform circles in a grid
  'bubbleGrid': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}]
      ]
    ]
  },

  // 24. Rainbow Dots - Multi-colored circles
  'rainbowDots': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}],
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}]
      ],
      [
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}],
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}]
      ]
    ]
  },

  // 25. Scattered Dots - Random-looking dot placement
  'scatteredDots': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}]
      ],
      [
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}]
      ],
      [
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"light"},{c:"light"},{c:"light"},{c:"light"}],
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}]
      ]
    ]
  },

  // 26. Gradient Dots - Circles transitioning in color
  'gradientDots': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"light"},{c:"dark"},{c:"light"},{c:"dark"}],
        [{c:"medium"},{c:"dark"},{c:"medium"},{c:"dark"}],
        [{c:"accent"},{c:"dark"},{c:"accent"},{c:"dark"}]
      ]
    ]
  },

  // 27. Dotted Stripes - Rows of different colored dots
  'dottedStripes': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ],
      [
        [{c:"accent"},{c:"light"},{c:"accent"},{c:"light"}]
      ],
      [
        [{c:"medium"},{c:"light"},{c:"medium"},{c:"light"}]
      ]
    ]
  },

  // 28. Checker Dots - Checkerboard with dots
  'checkerDots': {
    'tileShape': 'square',
    'tilePattern': [
      [
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}],
        [{c:"dark"},{c:"medium"},{c:"dark"},{c:"medium"}]
      ],
      [
        [{c:"dark"},{c:"medium"},{c:"dark"},{c:"medium"}],
        [{c:"dark"},{c:"light"},{c:"dark"},{c:"light"}]
      ]
    ]
  }
};

export default SquareTileDesigns;
