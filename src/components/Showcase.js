// Curated showcase of favorite tessellation combinations
// Each entry combines a tile pattern with a color theme for stunning visual results

const Showcase = {
  "midnight_knots": {
    title: "Midnight Persian Knots",
    description: "Deep purple and gold create an elegant Persian carpet effect",
    tilePattern: "persianKnots",
    colorTheme: "Purp-uh-trator",
    tileSize: 25,
    featured: true
  },

  "vintage_shadows": {
    title: "Vintage Shadow Boxes", 
    description: "Warm browns and creams evoke mid-century modern design",
    tilePattern: "shadowBoxes",
    colorTheme: "End-century Modern",
    tileSize: 30,
    featured: true
  },

  "neon_triangles": {
    title: "Neon Persian Triangles",
    description: "Cyberpunk meets traditional geometry in electric colors",
    tilePattern: "persianTriangles", 
    colorTheme: "Nanobeast",
    tileSize: 20,
    featured: false
  },

  "autumn_knots": {
    title: "Autumn Spice Knots",
    description: "Rich ginger and neutral tones create cozy warmth",
    tilePattern: "persianKnots",
    colorTheme: "Ginger Neutral", 
    tileSize: 35,
    featured: true
  },

  "chrome_shadows": {
    title: "Chrome Dream Shadows",
    description: "Cool metallics and cyan create futuristic depth",
    tilePattern: "shadowBoxes",
    colorTheme: "Chrome Dreams",
    tileSize: 28,
    featured: false
  },

  "scarlet_triangles": {
    title: "Scarlet Academic Triangles",
    description: "Classic red and gold in sophisticated patterns",
    tilePattern: "persianTriangles",
    colorTheme: "Scarlet A+",
    tileSize: 22,
    featured: true
  },

  "campfire_shadows": {
    title: "Campfire Shadow Boxes",
    description: "S'mores colors create cozy geometric warmth",
    tilePattern: "shadowBoxes", 
    colorTheme: "Moar S'mores!",
    tileSize: 32,
    featured: false
  },

  "banana_knots": {
    title: "Tropical Persian Knots",
    description: "Bright yellows and greens bring tropical energy",
    tilePattern: "persianKnots",
    colorTheme: "That's Bananas!",
    tileSize: 26,
    featured: false
  },

  "decades_triangles": {
    title: "Retro Decade Triangles", 
    description: "80s neon palette in geometric perfection",
    tilePattern: "persianTriangles",
    colorTheme: "Decades Menu",
    tileSize: 24,
    featured: true
  },

  "forest_shadows": {
    title: "Forest Green Shadows",
    description: "Nature-inspired greens with golden highlights",
    tilePattern: "shadowBoxes",
    colorTheme: "Raking in Grands", 
    tileSize: 29,
    featured: false
  },

  "modern_hex_grid": {
    title: "Modern Hex Grid",
    description: "Clean geometric pattern with mid-century modern colors",
    tilePattern: "pointyTop3x3",
    colorTheme: "End-century Modern",
    tileSize: 18,
    featured: true
  },

  "coily_wave_boxes": {
    title: "Coily Wave Boxes",
    description: "Teal and purple shadow boxes with mesmerizing wave distortions",
    tilePattern: "shadowBoxes",
    colorTheme: "Coily Cubes",
    tileSize: 23,
    tileXAdjust: "wave:20:4",
    tileYAdjust: "wave:20:4",
    featured: true
  },

  "micro_flat_modern": {
    title: "Micro Flat Modern",
    description: "Ultra-fine flat-top hexagons with shifted positioning create intricate mid-century patterns",
    tilePattern: "flatTop3x3",
    colorTheme: "End-century Modern",
    tileSize: 10,
    tileXAdjust: "10",
    featured: true
  },

  "scarlet_cc_chaos": {
    title: "Scarlet CC Chaos",
    description: "Claude Code pattern in academic scarlet with chaotic random positioning",
    tilePattern: "CC",
    colorTheme: "Scarlet A+",
    tileSize: 20,
    tileXAdjust: "random:60:0",
    tileYAdjust: "random:60:0",
    featured: true
  },

  "faded_cc_wave": {
    title: "Faded CC Wave",
    description: "Claude Code pattern in retro robot colors with hypnotic wave distortions",
    tilePattern: "CC",
    colorTheme: "Faded Robot",
    tileSize: 24,
    tileXAdjust: "wave:30:6",
    featured: true
  }
};

// Helper functions for working with showcase data
export const getFeaturedShowcase = () => {
  return Object.entries(Showcase)
    .filter(([key, item]) => item.featured)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getAllShowcase = () => Showcase;

export const getRandomShowcase = () => {
  const keys = Object.keys(Showcase);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, ...Showcase[randomKey] };
};

export const getShowcaseByPattern = (pattern) => {
  return Object.entries(Showcase)
    .filter(([key, item]) => item.tilePattern === pattern)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export const getShowcaseByTheme = (theme) => {
  return Object.entries(Showcase)
    .filter(([key, item]) => item.colorTheme === theme)
    .reduce((acc, [key, item]) => {
      acc[key] = item;
      return acc;
    }, {});
};

export default Showcase;