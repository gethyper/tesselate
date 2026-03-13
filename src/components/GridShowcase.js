// Curated showcase of favorite grid tessellation combinations
// Grid tessellations use square tiles with various division patterns

const GridShowcase = {
  "chrome_chevron_chaos": {
    title: "Chrome Chevron Chaos",
    description: "Metallic chevron triangles with intense random positioning creates dynamic chrome shrapnel effect",
    tilePattern: "chevron",
    colorTheme: "Chrome Dreams",
    tileSize: { width: 20, height: 20 },
    tileStyle: "triangle-right",
    tileXAdjust: "random:100",
    tileYAdjust: "random:100",
    featured: true
  },

  "electric_weave_wave": {
    title: "Electric Weave Wave",
    description: "Basketweave pattern in electric cyan and magenta with dramatic wave distortions",
    tilePattern: "basketweave",
    colorTheme: "Electric Sheep",
    tileSize: { width: 80, height: 80 },
    tileYAdjust: "wave:200:40",
    featured: true
  },

  "hydrant_starburst": {
    title: "Hydrant Starburst Wave",
    description: "Starburst triangles in fiery red and yellow with double wave distortions",
    tilePattern: "starBurst",
    colorTheme: "Hydrant Spin",
    tileSize: { width: 20, height: 20 },
    tileStyle: "triangle-right",
    tileXAdjust: "wave:200:40",
    tileYAdjust: "wave:200:40",
    featured: true
  },

  "decades_maze_wave": {
    title: "Decades Maze Wave",
    description: "Retro 80s maze pattern with triangle fills and hypnotic wave distortions",
    tilePattern: "maze",
    colorTheme: "Decades Menu",
    tileSize: { width: 20, height: 20 },
    tileStyle: "triangle-up",
    tileXAdjust: "wave:100:20",
    tileYAdjust: "wave:100:20",
    featured: true
  },

  "banned_starburst_chaos": {
    title: "Banned Starburst Chaos",
    description: "Retro 80s starburst with 3x3 grid fills and chaotic random positioning",
    tilePattern: "starBurst",
    colorTheme: "Banned in '85",
    tileSize: { width: 20, height: 20 },
    tileStyle: "grid-3x3",
    tileXAdjust: "random:-100",
    tileYAdjust: "random:-100",
    featured: true
  },

  "smores_confetti": {
    title: "S'mores Confetti",
    description: "Rainbow dots with circle fills scattered randomly in warm campfire colors",
    tilePattern: "rainbowDots",
    colorTheme: "Moar S'mores!",
    tileSize: { width: 20, height: 20 },
    tileStyle: "circle",
    tileXAdjust: "random:200",
    tileYAdjust: "random:200",
    featured: true
  }
};

// Helper functions for working with grid showcase data
export const getFeaturedGridShowcase = () => {
  return Object.entries(GridShowcase)
    .filter(([key, item]) => item.featured)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getAllGridShowcase = () => GridShowcase;

export const getRandomGridShowcase = () => {
  const keys = Object.keys(GridShowcase);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, ...GridShowcase[randomKey] };
};

export const getGridShowcaseByPattern = (pattern) => {
  return Object.entries(GridShowcase)
    .filter(([key, item]) => item.tilePattern === pattern)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getGridShowcaseByTheme = (theme) => {
  return Object.entries(GridShowcase)
    .filter(([key, item]) => item.colorTheme === theme)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export default GridShowcase;
