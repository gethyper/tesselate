import { useCallback, useRef } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
import { textures } from '../components/textures';

// Performance optimization: Reusable empty stroke options to avoid object creation
const EMPTY_STROKE_OPTIONS = Object.freeze({
  stroke_color: null,
  stroke_a: null,
  stroke_b: null,
  stroke_c: null
});

// Import tile pattern functions or define your pattern mapping

/**
 * Legacy function to draw a polygon with specified number of sides
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} centerX - X coordinate of the center
 * @param {number} centerY - Y coordinate of the center
 * @param {number} radius - Radius of the polygon
 * @param {number} numSides - Number of sides for the polygon
 */
export const legacyDrawPolygon = (p5, centerX, centerY, radius, numSides) => { 

    // p5 already has some functionality for drawing more complex shapes
    // beginShape tells p5 that we'll be positioning some vertices in a bit
    p5.beginShape()
  
    // This is where the heavy lifting happens
    // Make equiangular steps around the circle depending on the number of sides
    for(let a = 0; a < p5.TAU; a+=p5.TAU/numSides){
  
      // calculate the cartesian coordinates for a given angle and radius
      // and centered at the centerX and centerY coordinates
      let x = centerX + radius * p5.cos(a)
      let y = centerY + radius * p5.sin(a)
  
      // creating the vertex
      p5.vertex(x, y)
    }
  
    // telling p5 that we are done positioning our vertices
    // and can now draw it to the canvas
    p5.endShape(p5.CLOSE)
};

/**
 * Calculates and returns the vertices of a hexagon (both orientations)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} centerX - X coordinate of the hexagon center
 * @param {number} centerY - Y coordinate of the hexagon center
 * @param {number} radius - Radius of the hexagon
 * @param {boolean} isPointyTop - Whether to generate pointy-top (true) or flat-top (false) vertices
 * @returns {Array<Array<number>>} Array of [x, y] coordinate pairs representing the vertices
 */
export const generateHexVertices = (p5, centerX, centerY, radius, isPointyTop = false) => {
  const vertices = [];
  const startAngle = isPointyTop ? p5.TAU / 12 : 0;
  const endAngle = isPointyTop ? p5.TAU + p5.TAU / 12 : p5.TAU;
  
  for (let a = startAngle; a < endAngle; a += p5.TAU / 6) {
    vertices.push([centerX + radius * p5.cos(a), centerY + radius * p5.sin(a)]);
  }
  return vertices;
};

/**
 * Legacy function - kept for compatibility
 * Calculates and returns the vertices of a flat-top hexagon
 */
export const calculateHexagonVertices = (p5, centerX, centerY, radius) => {
  return generateHexVertices(p5, centerX, centerY, radius, false);
};

/**
 * Adjusts the brightness of a color by a given percentage
 * 
 * @param {string} colorStr - Color string (hex, named color, or rgb)
 * @param {number} percent - Percentage to adjust brightness (-100 to 100)
 * @returns {string} Adjusted color in rgb format
 */
const adjustColorBrightness = (colorStr, percent) => {
  // Handle named colors
  if (colorStr === 'grey' || colorStr === 'gray') {
    colorStr = '#808080';
  } else if (colorStr === 'white') {
    colorStr = '#FFFFFF';
  } else if (colorStr === 'black') {
    colorStr = '#000000';
  }
  
  let hex = colorStr.replace('#', '');
  
  // Handle 3-character hex codes
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Handle 5-character hex (malformed)
  if (hex.length === 5) {
    hex = hex + hex[4]; // duplicate last character
  }
  
  const num = parseInt(hex, 16);
  if (isNaN(num)) return colorStr; // Return original if can't parse
  
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return `rgb(${R}, ${G}, ${B})`;
};

/**
 * Creates a linear gradient fill for a triangular shape at a 45-degree angle
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} x1 - X coordinate of first vertex
 * @param {number} y1 - Y coordinate of first vertex
 * @param {number} x2 - X coordinate of second vertex
 * @param {number} y2 - Y coordinate of second vertex
 * @param {number} x3 - X coordinate of third vertex
 * @param {number} y3 - Y coordinate of third vertex
 * @param {string} baseColor - Base color for the gradient
 * @param {boolean} useGradient - Whether to apply gradient effect
 * @returns {string|CanvasGradient} Color string or canvas gradient object
 */
export const createGradientFill = (p5, x1, y1, x2, y2, x3, y3, baseColor, useGradient = true) => {
  if (!useGradient) {
    return baseColor;
  }
  
  // Calculate shape bounds
  const minX = Math.min(x1, x2, x3);
  const maxX = Math.max(x1, x2, x3);
  const minY = Math.min(y1, y2, y3);
  const maxY = Math.max(y1, y2, y3);
  
  // Calculate gradient start and end points at 45 degree angle
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const diagonal = Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
  const offset = diagonal / 2;
  
  // 45 degree angle (π/4 radians)
  const angle = Math.PI / 4;
  const startX = centerX - offset * Math.cos(angle);
  const startY = centerY - offset * Math.sin(angle);
  const endX = centerX + offset * Math.cos(angle);
  const endY = centerY + offset * Math.sin(angle);
  
  // Create gradient colors (2% lighter to 2% darker)
  const lightColor = adjustColorBrightness(baseColor, 2);
  const darkColor = adjustColorBrightness(baseColor, -2);
  
  // Create linear gradient
  const ctx = p5.drawingContext;
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(1, darkColor);
  
  return gradient;
};

/**
 * Draws a hexagon outline (supports both orientations)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} centerX - X coordinate of the hexagon center
 * @param {number} centerY - Y coordinate of the hexagon center
 * @param {number} radius - Radius of the hexagon
 * @param {boolean} isPointyTop - Whether to draw pointy-top (true) or flat-top (false) outline
 */
export const drawHexagonOutline = (p5, centerX, centerY, radius, isPointyTop = false) => {
    const vertices = generateHexVertices(p5, centerX, centerY, radius, isPointyTop);
    p5.beginShape();
    vertices.forEach(([x, y]) => p5.vertex(x, y));
    p5.endShape(p5.CLOSE);
};

/**
 * Legacy function - kept for compatibility
 * Draws a flat-top hexagon outline
 */
export const drawFlatTopHexagonOutline = (p5, centerX, centerY, radius) => {
    drawHexagonOutline(p5, centerX, centerY, radius, false);
};

/**
 * Legacy function - kept for compatibility
 * Draws a pointy-top hexagon outline (rotated 30 degrees from flat-top)
 */
export const drawPointyTopHexagonOutline = (p5, centerX, centerY, radius) => {
    drawHexagonOutline(p5, centerX, centerY, radius, true);
};

/**
 * Draws a single hexagonal tile composed of triangular segments (supports both orientations)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} centerX - X coordinate of the hexagon center
 * @param {number} centerY - Y coordinate of the hexagon center
 * @param {number} radius - Radius of the hexagon
 * @param {Array} tile_components - Array of tile component definitions with colors and strokes
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration including texture
 * @param {boolean} enableGradient - Whether to apply gradient effects to triangles
 * @param {boolean} isPointyTop - Whether to draw pointy-top (true) or flat-top (false) hexagon
 */
export const drawHexatile = (p5, centerX, centerY, radius, tile_components, color_theme, tile_options = {}, enableGradient = false, isPointyTop = false) => {
  // Generate hexagon vertices using unified function
  const vertices = generateHexVertices(p5, centerX, centerY, radius, isPointyTop);
  
  // Draw shadow if requested
  if (tile_options.addShadows) {
    p5.push();
    p5.fill(0, 0, 0, 50); // Semi-transparent black shadow
    p5.noStroke();
    if (isPointyTop) {
      drawPointyTopHexagonOutline(p5, centerX + 3, centerY + 3, radius);
    } else {
      drawFlatTopHexagonOutline(p5, centerX + 3, centerY + 3, radius);
    }
    p5.pop();
  }
  
  // Draw the hexagon outline
  if (isPointyTop) {
    drawPointyTopHexagonOutline(p5, centerX, centerY, radius);
  } else {
    drawFlatTopHexagonOutline(p5, centerX, centerY, radius);
  }
  
  // Pre-calculate center point to avoid repetitive access
  const centerPoint = [centerX, centerY];
  
  // Draw each triangular segment
  for (let i = 0; i < vertices.length - 1; i++) {
    const tri = tile_components[i];
    const tri_color = color_theme[tri.c || tri.color];
    
    // Extract current and next vertices
    const [x1, y1] = vertices[i];
    const [x2, y2] = vertices[i + 1];
    const [x3, y3] = centerPoint;

    // Create stroke options only when needed (avoid object creation for simple cases)
    let stroke_options;
    if (tri.stroke || tri.s || tri.stroke_a || tri.sa || tri.stroke_b || tri.sb || tri.stroke_c || tri.sc) {
      stroke_options = {
        stroke_color: tri.stroke ? color_theme[tri.stroke] : tri.s ? color_theme[tri.s] : null,
        stroke_a: tri.stroke_a ? color_theme[tri.stroke_a] : tri.sa ? color_theme[tri.sa] : null,
        stroke_b: tri.stroke_b ? color_theme[tri.stroke_b] : tri.sb ? color_theme[tri.sb] : null,
        stroke_c: tri.stroke_c ? color_theme[tri.stroke_c] : tri.sc ? color_theme[tri.sc] : null
      };
    } else {
      // Reuse empty object to avoid allocation
      stroke_options = EMPTY_STROKE_OPTIONS;
    }

    drawTriangle(p5, x1, y1, x2, y2, x3, y3, tri_color, stroke_options, enableGradient, tile_options.textureImg);
  }
};

/**
 * Legacy function - kept for compatibility
 * Draws a single flat-top hexagonal tile composed of triangular segments
 */
export const drawFlatTopHexatile = (p5, centerX, centerY, radius, tile_components, color_theme, tile_options = {}, enableGradient = false) => {
  drawHexatile(p5, centerX, centerY, radius, tile_components, color_theme, tile_options, enableGradient, false);
};

/**
 * Legacy function - kept for compatibility
 * Draws a single pointy-top hexagonal tile composed of triangular segments
 */
export const drawPointyTopHexatile = (p5, centerX, centerY, radius, tile_components, color_theme, tile_options = {}, enableGradient = false) => {
  drawHexatile(p5, centerX, centerY, radius, tile_components, color_theme, tile_options, enableGradient, true);
};

/**
 * Draws a textured triangle using canvas clipping and image overlay
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} x1 - X coordinate of first vertex
 * @param {number} y1 - Y coordinate of first vertex
 * @param {number} x2 - X coordinate of second vertex
 * @param {number} y2 - Y coordinate of second vertex
 * @param {number} x3 - X coordinate of third vertex
 * @param {number} y3 - Y coordinate of third vertex
 * @param {string} color - Base color for the triangle
 * @param {HTMLImageElement} textureImg - Texture image to overlay
 */
export const drawTexturedTriangle = (p5, x1, y1, x2, y2, x3, y3, color, textureImg) => {
  if (!textureImg) {
    return;
  }
  
  try {
    
    // Calculate triangle bounds
    const minX = Math.min(x1, x2, x3);
    const maxX = Math.max(x1, x2, x3);
    const minY = Math.min(y1, y2, y3);
    const maxY = Math.max(y1, y2, y3);
    
    // Get the canvas context
    const ctx = p5.drawingContext;
    ctx.save();
    
    // Create clipping path for the triangle
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.clip();
    
    // First draw the base color
    ctx.fillStyle = color;
    ctx.fill();
    
    // Then draw the texture on top with 10% opacity
    ctx.globalAlpha = 0.10;
    ctx.drawImage(textureImg, minX, minY, maxX - minX, maxY - minY);
    
    // Restore context
    ctx.restore();
    
  } catch (error) {
    console.error('Error drawing textured triangle:', error);
    // Fallback to solid color using p5.js
    p5.fill(color);
    p5.noStroke();
    p5.beginShape();
    p5.vertex(x1, y1);
    p5.vertex(x2, y2);
    p5.vertex(x3, y3);
    p5.endShape(p5.CLOSE);
  }
};


/**
 * Draws a triangle with optional gradient, texture, and stroke customization
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} x1 - X coordinate of first vertex
 * @param {number} y1 - Y coordinate of first vertex
 * @param {number} x2 - X coordinate of second vertex
 * @param {number} y2 - Y coordinate of second vertex
 * @param {number} x3 - X coordinate of third vertex
 * @param {number} y3 - Y coordinate of third vertex
 * @param {string} color - Fill color for the triangle
 * @param {Object} stroke_options - Stroke configuration object
 * @param {boolean} useGradient - Whether to apply gradient fill
 * @param {HTMLImageElement|null} textureImg - Optional texture image
 */
export const drawTriangle = (p5, x1, y1, x2, y2, x3, y3, color, stroke_options = EMPTY_STROKE_OPTIONS, useGradient = false, textureImg = null) => {
  // Destructure once to avoid repeated property access
  const {
    stroke_color = null,
    stroke_weight = 1,
    stroke_a = null,
    stroke_b = null,
    stroke_c = null
  } = stroke_options;

  if (textureImg) {
    // Draw texture with color tinting
    drawTexturedTriangle(p5, x1, y1, x2, y2, x3, y3, color, textureImg);
  } else {
    // Create and apply gradient fill or solid color
    const fill = createGradientFill(p5, x1, y1, x2, y2, x3, y3, color, useGradient);
    if (typeof fill === 'string') {
      p5.fill(fill);
    } else {
      p5.drawingContext.fillStyle = fill;
    }
    
    if (stroke_color) {
      p5.stroke(stroke_color);
      p5.strokeWeight(stroke_weight);
    } else {
      p5.noStroke();
    }
    
    p5.beginShape();
    p5.vertex(x1, y1);
    p5.vertex(x2, y2);
    p5.vertex(x3, y3);
    p5.endShape(p5.CLOSE);
  }

  // Draw individual edge strokes if specified
  if (stroke_a || stroke_b || stroke_c) {
    p5.strokeWeight(stroke_weight);
    
    if (stroke_a) {
      p5.stroke(stroke_a);
      p5.line(x1, y1, x2, y2);
    }
    
    if (stroke_b) {
      p5.stroke(stroke_b);
      p5.line(x2, y2, x3, y3);
    }
    
    if (stroke_c) {
      p5.stroke(stroke_c);
      p5.line(x3, y3, x1, y1);
    }
  }

  p5.noStroke();
}; 



/**
 * Unified function to draw multiple hexagonal tiles (both flat-top and pointy-top)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} pos_x - Starting X position for the tile pattern
 * @param {number} pos_y - Starting Y position for the tile pattern
 * @param {number} radius - Radius of each hexagonal tile
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
export const drawMultiHexatiles = (
  p5, 
  tile_shape, 
  pos_x, 
  pos_y, 
  radius, 
  tile_pattern, 
  color_theme, 
  tile_options = {}, 
  useGradient = false
) => {
  // Extract adjustments from options with defaults
  const { tile_x_adjust = 0, tile_y_adjust = 0 } = tile_options;

  // Grid dimensions
  const tilesWide = tile_pattern.length;
  const tilesHigh = tile_pattern[0].length;

  // Starting position
  const startX = pos_x;
  const startY = pos_y;
  
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // Pointy-top tessellation logic
    const tileWidth = getTileWidth(tile_shape, radius);
    const tileHeight = getTileHeight(tile_shape, radius);
    const tileXOffset = getTileXOffset(tile_shape, radius);
    const tileYOffset = getTileYOffset(tile_shape, radius);

    for (let column = 0; column < tilesWide; column++) {
      const baseX = startX + (tileWidth * column) - tileXOffset;

      for (let row = 0; row < tilesHigh; row++) {
        const horizontalOffset = (row % 2 === 0) ? 0 : tileXOffset;
        const tileX = baseX + horizontalOffset + tile_x_adjust;
        const tileY = startY + ((tileHeight - tileYOffset) * row) + tile_y_adjust;

        drawPointyTopHexatile(p5, tileX, tileY, radius, tile_pattern[column][row], color_theme, tile_options, useGradient);
      }
    }
  } else {
    // Flat-top tessellation logic
    const HORIZONTAL_SPACING_RATIO = 1.5;
    const VERTICAL_SPACING_RATIO = Math.sqrt(3) / 2;
    const horizontalSpacing = radius * HORIZONTAL_SPACING_RATIO;
    const verticalSpacing = radius * 2 * VERTICAL_SPACING_RATIO;

    for (let column = 0; column < tilesWide; column++) {
      const tileX = startX + (horizontalSpacing * column);
      const verticalOffset = (column % 2 !== 0) ? verticalSpacing / 2 : 0;
      
      for (let row = 0; row < tilesHigh; row++) {
        const tileY = startY + verticalOffset + (verticalSpacing * row);
        
        drawFlatTopHexatile(p5, tileX, tileY, radius, tile_pattern[column][row], color_theme, tile_options, useGradient);
      }
    }
  }
};

/**
 * Legacy function - kept for compatibility
 * Draws multiple pointy-top hexagonal tiles in a tessellated pattern
 */
export const drawMultiPointyTopHexatile = (p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  drawMultiHexatiles(p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options, useGradient);
};

/**
 * Legacy function - kept for compatibility  
 * Draws multiple flat-top hexagonal tiles in a tessellated pattern
 */
export const drawMultiHexatile = (p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  drawMultiHexatiles(p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options, useGradient);
};



/**
 * Calculates the width of a hexagonal tile based on its orientation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @returns {number} Width of the tile
 */
const getTileWidth = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2 * 0.8666) : (r * 2);
};

/**
 * Calculates the height of a hexagonal tile based on its orientation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @returns {number} Height of the tile
 */
const getTileHeight = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2) : (r * 2 * 0.8666);
};

/**
 * Calculates the horizontal offset needed for proper hexagon tessellation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @returns {number} Horizontal offset for tessellation
 */
const getTileXOffset = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  const baseOffset = isPointyTop ? r * 0.8666 : r / 2;
  return baseOffset;
};

/**
 * Calculates the vertical offset needed for proper hexagon tessellation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @returns {number} Vertical offset for tessellation
 */
const getTileYOffset = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  const baseOffset = isPointyTop ? r / 2 : r * 0.8666;
  return baseOffset;
};

/**
 * Calculates the total width of a mosaic pattern
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} tile_width - Width of individual tiles
 * @param {number} tiles_in_mosaic_wide - Number of tiles horizontally in the mosaic
 * @param {number} tile_x_offset - Horizontal offset between tiles
 * @returns {number} Total width of the mosaic
 */
// eslint-disable-next-line no-unused-vars
const getMosaicWidth = (tile_shape, tile_width, tiles_in_mosaic_wide, tile_x_offset) => {
  // Handle single tile case
  if (tiles_in_mosaic_wide === 1) {
    return tile_width;
  }

  // Calculate width based on tile orientation
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // For pointy-top hexagons: width = (number of tiles * tile width) + offset
    return (tiles_in_mosaic_wide * tile_width) + tile_x_offset;
  } else {
    // For flat-top hexagons: width = overlapping tiles + final full tile
    return ((tiles_in_mosaic_wide - 1) * (tile_width - tile_x_offset)) + tile_width;
  }
};

/**
 * Calculates the total height of a mosaic pattern
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} tile_height - Height of individual tiles
 * @param {number} tiles_in_mosaic_high - Number of tiles vertically in the mosaic
 * @param {number} tile_y_offset - Vertical offset between tiles
 * @returns {number} Total height of the mosaic
 */
// eslint-disable-next-line no-unused-vars
const getMosaicHeight = (tile_shape, tile_height, tiles_in_mosaic_high, tile_y_offset) => {
  // Handle single tile case
  if (tiles_in_mosaic_high === 1) {
    return tile_height;
  }

  // Calculate height based on tile orientation
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // For pointy-top hexagons: height = overlapping tiles + final offset
    return ((tile_height - tile_y_offset) * tiles_in_mosaic_high) + tile_y_offset;
  } else {
    // For flat-top hexagons: height = number of tiles * tile height
    return (tile_height * tiles_in_mosaic_high);
  }
};

const getTilesWide = (p5, tile_width, tile_x_offset, tile_x_adjust = 0 ) => {
  return Math.round(p5.width / (tile_width - tile_x_offset + tile_x_adjust)) + 1;
};

const getTilesHigh = (p5, tile_height, tile_y_offset, tile_y_adjust = 0) => {
  return Math.round(p5.height / (tile_height - tile_y_offset + tile_y_adjust)) + 1;
};


/**
 * Calculate tile adjustment effects based on position and effect type
 * 
 * @param {Object} adjustment - Adjustment object from URL parsing
 * @param {number} i - Column index
 * @param {number} j - Row index
 * @param {number} r - Tile radius
 * @returns {number} Calculated adjustment value
 */
const calculateTileAdjustment = (adjustment, i, j, r) => {
  if (!adjustment || adjustment.type === 'numeric') {
    return adjustment?.value || 0;
  }

  switch (adjustment.type) {
    case 'wave':
    case 'sine':
      // wave:amplitude:frequency
      const amplitude = adjustment.values[0] || 10;
      const frequency = adjustment.values[1] || 1;
      return amplitude * Math.sin((i + j) * frequency * 0.1);
    
    case 'random':
      // random:intensity
      const intensity = adjustment.values[0] || 5;
      // Use deterministic random based on position for consistency
      const seed = i * 1000 + j;
      const pseudoRandom = Math.sin(seed) * 10000;
      return (pseudoRandom - Math.floor(pseudoRandom) - 0.5) * intensity * 2;
    
    case 'alt':
      // alt:value1:value2
      const value1 = adjustment.values[0] || 0;
      const value2 = adjustment.values[1] || 0;
      return (i + j) % 2 === 0 ? value1 : value2;
    
    default:
      return 0;
  }
};

/**
 * Extracts numeric value from adjustment parameter (object or primitive)
 * 
 * @param {number|Object} adjustment - Adjustment value or object
 * @returns {number} Numeric value
 */
const getNumericValue = (adjustment) => typeof adjustment === 'object' ? adjustment.value : adjustment;

/**
 * Creates adjustment function for X or Y coordinate
 * 
 * @param {number|Object} adjustment - X or Y adjustment value/object
 * @param {number} r - Tile radius
 * @param {string} axis - 'x' or 'y' for legacy behavior
 * @returns {Function} Function that takes (i, j) and returns adjustment value
 */
const createAdjustmentFunction = (adjustment, r, axis) => {
  return (i, j) => {
    if (typeof adjustment === 'object' && adjustment.type !== 'numeric') {
      return calculateTileAdjustment(adjustment, i, j, r);
    }
    const numericValue = getNumericValue(adjustment);
    // Legacy numeric behavior: X uses i, Y uses j
    return numericValue * (axis === 'x' ? i : j);
  };
};

/**
 * Calculates normalization and extra offset values for tile adjustments
 * 
 * @param {number|Object} tile_x_adjust - X adjustment parameter
 * @param {number|Object} tile_y_adjust - Y adjustment parameter
 * @returns {Object} Object with tile_x_y_normalize and extraOffset values
 */
const calculateAdjustmentOffsets = (tile_x_adjust, tile_y_adjust) => {
  const xNumeric = getNumericValue(tile_x_adjust);
  const yNumeric = getNumericValue(tile_y_adjust);
  
  // Normalization when both adjustments are equal (legacy behavior)
  const tile_x_y_normalize = (xNumeric === yNumeric && typeof tile_x_adjust !== 'object' && typeof tile_y_adjust !== 'object') ? xNumeric/2 : 0;
  
  // Extra operation when tile_x_adjust and tile_y_adjust are the same
  const extraOffset = (xNumeric === yNumeric) ? yNumeric/2 : 0;
  
  return { tile_x_y_normalize, extraOffset };
};

/**
 * Fills the entire canvas with tessellated hexagonal tiles
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of each hexagonal tile
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
export const fillWithTiles = (p5, tile_shape, r, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  console.log("🔧 fillWithTiles called - START");
  // Use unified drawing function
  const tileFunction = tile_shape === 'pointyTopHexatile' ? tilePointyTopHexatile : tileFlatTopHexatile;
  
  console.log(`🔧 About to call ${tile_shape === 'pointyTopHexatile' ? 'tilePointyTopHexatile' : 'tileFlatTopHexatile'}`);
  tileFunction(p5, r, tile_shape, tile_pattern, color_theme, null, tile_options, useGradient);
  console.log("🔧 fillWithTiles called - END");
};


/**
 * Unified tiling function that works for both flat-top and pointy-top hexagons
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */


/**
 * Unified tiling function that works for both flat-top and pointy-top hexagons
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
const tileUnified = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  const tile_x_adjust = tile_options.tile_x_adjust || 0;
  const tile_y_adjust = tile_options.tile_y_adjust || 0;
  console.log(tile_x_adjust, tile_y_adjust)
  
  // Use shared adjustment helpers
  const getXAdjustment = createAdjustmentFunction(tile_x_adjust, r, 'x');
  const getYAdjustment = createAdjustmentFunction(tile_y_adjust, r, 'y');
  const { tile_x_y_normalize, extraOffset } = calculateAdjustmentOffsets(tile_x_adjust, tile_y_adjust);

  // Calculate tile dimensions and offsets
  const tile_width = getTileWidth(tile_shape, r);
  const tile_height = getTileHeight(tile_shape, r);
  const tile_x_offset = getTileXOffset(tile_shape, r);
  const tile_y_offset = getTileYOffset(tile_shape, r);
  
  // Get mosaic dimensions
  const tiles_in_mosaic_wide = tile_pattern.length;
  const tiles_in_mosaic_high = tile_pattern[0].length;
  
  // Pre-calculate adjustment values once (performance optimization)
  const xAdjustForTiling = typeof tile_x_adjust === 'object' ? tile_x_adjust.value || 0 : tile_x_adjust;
  const yAdjustForTiling = typeof tile_y_adjust === 'object' ? tile_y_adjust.value || 0 : tile_y_adjust;
  
  // Use single mosaic dimensions if requested, otherwise fill canvas
  const tiles_wide = tile_options.showSingleMosaic ? tiles_in_mosaic_wide : getTilesWide(p5, tile_width, tile_x_offset, xAdjustForTiling);
  const tiles_high = tile_options.showSingleMosaic ? tiles_in_mosaic_high : getTilesHigh(p5, tile_height, tile_y_offset, yAdjustForTiling);
  
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  for (let i = 0; i < tiles_wide; i++) {
    // Calculate base X position based on orientation
    const x_pos = (i === 0) ? 0 : (isPointyTop ? (tile_width * i) : ((tile_width - tile_x_offset) * i));
    const tile_column = (i % tiles_in_mosaic_wide);
    
    // Calculate vertical offset for flat-top (alternates by column)
    const offset_y = (!isPointyTop && (i % 2 !== 0)) ? tile_y_offset + tile_x_y_normalize + extraOffset : 0;
  
    for (let j = 0; j < tiles_high; j++) {
      const tile_row = (j % tiles_in_mosaic_high);
      
      // Calculate horizontal offset for pointy-top (alternates by row)
      const offset_x = (isPointyTop && (j % 2 !== 0)) ? tile_x_offset + tile_x_y_normalize + extraOffset : 0;
      
      // Calculate final positions based on orientation
      const x_loc = x_pos + offset_x + getXAdjustment(i, j);
      const y_loc = isPointyTop ? 
        ((tile_height - tile_y_offset) * j + getYAdjustment(i, j)) :
        ((tile_height * j) + offset_y + getYAdjustment(i, j));

      // Draw the appropriate tile type
      if (isPointyTop) {
        drawPointyTopHexatile(p5, x_loc, y_loc, r, tile_pattern[tile_column][tile_row], color_theme, tile_options, useGradient);
      } else {
        drawFlatTopHexatile(p5, x_loc, y_loc, r, tile_pattern[tile_column][tile_row], color_theme, tile_options, useGradient);
      }
    }
  }
};

/**
 * Legacy function - kept for compatibility
 * Tiles the canvas with pointy-top hexagonal patterns
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type (should be 'pointyTopHexatile')
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns (unused)
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
const tilePointyTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  // Use unified tiling function
  tileUnified(p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options, useGradient);
};

/**
 * Legacy function - kept for compatibility  
 * Tiles the canvas with flat-top hexagonal patterns
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type (should be flat-top hexagon)
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns (unused)
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
const tileFlatTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  // Use unified tiling function
  tileUnified(p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options, useGradient);
};


/**
 * React hook for creating p5.js hexagonal tessellation visualizations
 * 
 * @param {Object} config - Configuration object for the tessellation
 * @param {string} config.tile_shape - Shape type for tiles (default: 'tripleHex')
 * @param {Array<Array>} config.tile_pattern - 2D array defining the tile pattern
 * @param {Object} config.color_theme - Color theme object containing color definitions
 * @param {number} config.r - Radius of each hexagonal tile (default: 100)
 * @param {boolean} config.single_tile - Whether to draw only a single centered tile (default: false)
 * @param {boolean} config.useGradient - Whether to apply gradient effects (default: false)
 * @param {string|null} config.textureKey - Key for texture to apply to tiles (default: null)
 * @param {Object} config.tile_options - Additional tile configuration options (default: {})
 * @returns {Object} Object containing setup and draw functions for p5.js
 */
export function useP5Tesselation({
  tile_shape = TileDesigns['tripleHex'].tileShape,
  tile_pattern = TileDesigns['tripleHex'].tilePattern,
  color_theme = ColorThemes['basic_b'],
  r = 100,
  single_tile = false,
  useGradient = false,
  textureKey = null,
  tile_options = {},
}) {
  // Ensure we always have valid defaults
  const safeTileShape = tile_shape || TileDesigns['tripleHex'].tileShape;
  const safeTilePattern = tile_pattern || TileDesigns['tripleHex'].tilePattern;
  const safeColorTheme = color_theme || ColorThemes['basic_b'];
  const p5InstanceRef = useRef(null);
  const textureImageRef = useRef(null);
  const paramsRef = useRef({ r, safeTileShape, safeTilePattern, safeColorTheme, tile_options, useGradient });

  const setup = useCallback((p5) => {
    console.log("🏗️ SETUP CALLED - Canvas created");
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();
    p5InstanceRef.current = p5;
    
    // Load texture if specified
    if (textureKey && textures[textureKey]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        textureImageRef.current = img;
        // Don't call redraw here - let the component handle it
      };
      img.onerror = (error) => {
        console.error('Failed to load texture:', textureKey, error);
      };
      img.src = textures[textureKey];
    }
  }, [textureKey]);

  // Update params ref when dependencies change  
  paramsRef.current = { r, safeTileShape, safeTilePattern, safeColorTheme, tile_options, useGradient };

  let drawCounterRef = useRef(0);
  const draw = useCallback((p5) => {
    try {
      drawCounterRef.current++;
      const drawId = Math.random().toString(36).substr(2, 9);
      console.log(`🎨 DRAW #${drawCounterRef.current} [ID:${drawId}] called at ${Date.now()}`);
      console.log(`🔍 p5.isLooping: ${p5.isLooping()}, frameCount: ${p5.frameCount}`);
      console.trace('Draw function call stack');
      
      const params = paramsRef.current;
      p5.background(params.safeColorTheme.bg);

      // Update tile_options with current texture
      const updatedTileOptions = {
        ...params.tile_options,
        textureImg: textureImageRef.current
      };

      // Safety check for tile_pattern
      if (!params.safeTilePattern || !Array.isArray(params.safeTilePattern) || params.safeTilePattern.length === 0) {
        return;
      }

      console.log(`🏗️ About to call fillWithTiles...`);
      fillWithTiles(p5, params.safeTileShape, params.r, params.safeTilePattern, params.safeColorTheme, updatedTileOptions, params.useGradient);
      console.log(`✅ fillWithTiles completed`);
      
      p5.noStroke();
      console.log(`🎯 Draw function ending...`);
      // Don't call noLoop here - let the component manage it
      
    } catch (error) {
      console.error('Error in draw function:', error);
    }
  }, []); // No dependencies - everything comes from refs!

  return { setup, draw };
}

/*
// Helper function to draw a single triangle
const drawTile = (p5, x, y, w, h) => {
  const { tileDesign, tileComponents } = pattern;
  
  // Use the pattern function from our mapping
  if (tilePatterns[tileDesign]) {
    tilePatterns[tileDesign](p5, x, y, w, h, tileComponents);
  } else if (typeof window[tileDesign] === 'function') {
    // Fallback to window object if function exists globally
    window[tileDesign](p5, x, y, w, h, tileDesign, tileComponents);
  } else {
    console.warn(`Pattern function ${tileDesign} not found`);
    // Draw a placeholder tile
    p5.fill(200, 0, 0);
    p5.rect(x, y, w, h);
  }
}*/



  





