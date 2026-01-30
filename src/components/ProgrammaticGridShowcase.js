// Curated showcase of programmatic grid tessellation combinations
// These use mathematical, rule-based, and generative algorithms instead of patterns

const ProgrammaticGridShowcase = {
  "perlin_dream": {
    title: "Perlin Dream",
    description: "Smooth color transitions using Perlin noise with triangle divisions",
    generatorName: "perlinColors",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 100, height: 100 },
    tileStyle: "triangles",
    generatorOptions: { scale: 0.15 },
    featured: true
  },

  "wave_interference": {
    title: "Wave Interference",
    description: "Two wave sources creating mesmerizing interference patterns",
    generatorName: "interference",
    colorTheme: "Electric Sheep",
    tileSize: { width: 80, height: 80 },
    tileStyle: "blank",
    generatorOptions: {
      center1X: 10,
      center1Y: 10,
      center2X: 20,
      center2Y: 20,
      frequency: 0.8
    },
    featured: true
  },

  "turbulent_triangles": {
    title: "Turbulent Triangles",
    description: "Layered noise creates turbulent organic patterns with triangle details",
    generatorName: "turbulence",
    colorTheme: "Hydrant Spin",
    tileSize: { width: 60, height: 60 },
    tileStyle: "triangles",
    generatorOptions: { scale: 0.12 },
    featured: true
  },

  "concentric_circles": {
    title: "Concentric Circles",
    description: "Ripples emanating from center with circular tile fills",
    generatorName: "concentricCircles",
    colorTheme: "Banned in '85",
    tileSize: { width: 50, height: 50 },
    tileStyle: "circle",
    generatorOptions: {
      centerX: 15,
      centerY: 15,
      frequency: 1.2
    },
    featured: true
  },

  "voronoi_cells": {
    title: "Voronoi Cells",
    description: "Organic cell-like regions with natural boundaries",
    generatorName: "voronoi",
    colorTheme: "Moar S'mores!",
    tileSize: { width: 40, height: 40 },
    tileStyle: "blank",
    generatorOptions: { numSeeds: 12 },
    featured: true
  },

  "sine_waves": {
    title: "Sine Waves",
    description: "Flowing horizontal wave patterns with rhythmic color changes",
    generatorName: "sineWaves",
    colorTheme: "Basic Bee",
    tileSize: { width: 70, height: 70 },
    tileStyle: "2-stripes-h",
    generatorOptions: {
      frequency: 0.7,
      amplitude: 2
    },
    featured: true
  },

  "distance_gradient": {
    title: "Distance Gradient",
    description: "Radial gradient from center with 3x3 grid complexity",
    generatorName: "distanceGradient",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 60, height: 60 },
    tileStyle: "grid-3x3",
    generatorOptions: {
      centerX: 15,
      centerY: 15,
      maxDist: 20
    },
    featured: false
  },

  "diagonal_stripes": {
    title: "Diagonal Stripes",
    description: "Classic diagonal stripes with mathematical precision",
    generatorName: "diagonal",
    colorTheme: "Electric Sheep",
    tileSize: { width: 80, height: 80 },
    tileStyle: "triangle-right",
    generatorOptions: { stripeWidth: 4 },
    featured: false
  },

  "modulo_grid": {
    title: "Modulo Grid",
    description: "Grid patterns created by modulo arithmetic with circle accents",
    generatorName: "modulo",
    colorTheme: "Hydrant Spin",
    tileSize: { width: 50, height: 50 },
    tileStyle: "circle-cross",
    generatorOptions: {
      modX: 5,
      modY: 3
    },
    featured: false
  },

  "triangle_rules": {
    title: "Triangle Rules",
    description: "Each triangle follows different mathematical rules",
    generatorName: "triangleRules",
    colorTheme: "Banned in '85",
    tileSize: { width: 60, height: 60 },
    tileStyle: "triangles",
    generatorOptions: {},
    featured: true
  },

  "game_of_life": {
    title: "Game of Life",
    description: "Static snapshot of Conway's Game of Life with circle fills",
    generatorName: "gameOfLife",
    colorTheme: "Moar S'mores!",
    tileSize: { width: 40, height: 40 },
    tileStyle: "circle",
    generatorOptions: {},
    featured: false
  },

  "random_triangles": {
    title: "Random Triangles",
    description: "Deterministic chaos with each triangle uniquely colored",
    generatorName: "randomTriangles",
    colorTheme: "Electric Sheep",
    tileSize: { width: 50, height: 50 },
    tileStyle: "triangles",
    generatorOptions: {},
    featured: false
  },

  "maze_generator": {
    title: "Maze Generator",
    description: "Procedural maze-like patterns with X-marked circles",
    generatorName: "maze",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 45, height: 45 },
    tileStyle: "circle-x",
    generatorOptions: {},
    featured: false
  },

  "quadrants": {
    title: "Quadrants",
    description: "Four color quadrants with stripe divisions",
    generatorName: "quadrants",
    colorTheme: "Hydrant Spin",
    tileSize: { width: 80, height: 80 },
    tileStyle: "3-stripes-v",
    generatorOptions: {
      centerX: 15,
      centerY: 15
    },
    featured: false
  },

  "perlin_triangles": {
    title: "Perlin Triangles",
    description: "Each triangle independently noise-colored for organic patterns",
    generatorName: "perlinTriangles",
    colorTheme: "Banned in '85",
    tileSize: { width: 70, height: 70 },
    tileStyle: "triangles",
    generatorOptions: { scale: 0.2 },
    featured: true
  },

  "dotted_density": {
    title: "Dotted Density",
    description: "High contrast density variation with threshold-based dots",
    generatorName: "dottedDensity",
    colorTheme: "Basic Bee",
    tileSize: { width: 40, height: 40 },
    tileStyle: "circle",
    generatorOptions: { scale: 0.15 },
    featured: true
  },

  "stippled_organic": {
    title: "Stippled Organic",
    description: "Random stippling creates natural, organic texture",
    generatorName: "stippled",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 50, height: 50 },
    tileStyle: "triangles",
    generatorOptions: { scale: 0.1 },
    featured: true
  },

  "cross_hatch_shading": {
    title: "Cross Hatch Shading",
    description: "Pen-like cross-hatching for artistic shading effect",
    generatorName: "crossHatch",
    colorTheme: "Hydrant Spin",
    tileSize: { width: 60, height: 60 },
    tileStyle: "2-stripes-h",
    generatorOptions: { scale: 0.12 },
    featured: true
  },

  "textile_weave_bands": {
    title: "Textile Weave",
    description: "Alternating band patterns like woven fabric",
    generatorName: "textileWeave",
    colorTheme: "Electric Sheep",
    tileSize: { width: 50, height: 50 },
    tileStyle: "blank",
    generatorOptions: { bandHeight: 4 },
    featured: true
  },

  "threshold_blocks": {
    title: "Threshold Blocks",
    description: "Hard-edged geometric blocks with stark contrast",
    generatorName: "thresholdBlocks",
    colorTheme: "Moar S'mores!",
    tileSize: { width: 80, height: 80 },
    tileStyle: "blank",
    generatorOptions: { scale: 0.08 },
    featured: true
  },

  "banded_composite": {
    title: "Banded Composite",
    description: "Complex multi-pattern composition in horizontal bands",
    generatorName: "bandedComposite",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 60, height: 60 },
    tileStyle: "triangles",
    generatorOptions: { bandHeight: 5 },
    featured: true
  },

  "concentric_threshold": {
    title: "Concentric Threshold",
    description: "Target-like concentric rings with hard thresholds",
    generatorName: "concentricThreshold",
    colorTheme: "Banned in '85",
    tileSize: { width: 50, height: 50 },
    tileStyle: "blank",
    generatorOptions: { centerX: 15, centerY: 15, frequency: 1.5 },
    featured: false
  }
};

// Helper functions for working with programmatic grid showcase data
export const getFeaturedProgrammaticGridShowcase = () => {
  return Object.entries(ProgrammaticGridShowcase)
    .filter(([key, item]) => item.featured)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getAllProgrammaticGridShowcase = () => ProgrammaticGridShowcase;

export const getRandomProgrammaticGridShowcase = () => {
  const keys = Object.keys(ProgrammaticGridShowcase);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, ...ProgrammaticGridShowcase[randomKey] };
};

export const getProgrammaticGridShowcaseByGenerator = (generatorName) => {
  return Object.entries(ProgrammaticGridShowcase)
    .filter(([key, item]) => item.generatorName === generatorName)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getProgrammaticGridShowcaseByTheme = (theme) => {
  return Object.entries(ProgrammaticGridShowcase)
    .filter(([key, item]) => item.colorTheme === theme)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export default ProgrammaticGridShowcase;
