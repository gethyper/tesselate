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
  // Validate input parameters
  if (typeof centerX !== 'number' || isNaN(centerX) || !isFinite(centerX) ||
      typeof centerY !== 'number' || isNaN(centerY) || !isFinite(centerY) ||
      typeof radius !== 'number' || isNaN(radius) || !isFinite(radius) || radius <= 0) {
    console.error(`generateHexVertices called with invalid parameters: centerX=${centerX}, centerY=${centerY}, radius=${radius}`);
    console.error('Vertex generation call stack:', new Error().stack);
    return []; // Return empty vertices array
  }
  
  const vertices = [];
  const startAngle = isPointyTop ? p5.TAU / 12 : 0;
  const endAngle = isPointyTop ? p5.TAU + p5.TAU / 12 : p5.TAU;
  
  for (let a = startAngle; a < endAngle; a += p5.TAU / 6) {
    const x = centerX + radius * p5.cos(a);
    const y = centerY + radius * p5.sin(a);
    
    // Validate each vertex
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      console.error(`Generated NaN vertex: x=${x}, y=${y}, angle=${a}, centerX=${centerX}, centerY=${centerY}, radius=${radius}`);
      continue; // Skip this vertex
    }
    
    vertices.push([x, y]);
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
    // Validate center coordinates and radius
    if (typeof centerX !== 'number' || isNaN(centerX) || !isFinite(centerX) ||
        typeof centerY !== 'number' || isNaN(centerY) || !isFinite(centerY) ||
        typeof radius !== 'number' || isNaN(radius) || !isFinite(radius)) {
      // Add stack trace to see exactly where this is being called from
      console.error(`Invalid hexagon parameters: centerX=${centerX}, centerY=${centerY}, radius=${radius}`);
      console.error('Call stack:', new Error().stack);
      return; // Skip drawing this hexagon
    }

    const vertices = generateHexVertices(p5, centerX, centerY, radius, isPointyTop);
    p5.beginShape();
    vertices.forEach(([x, y]) => {
      if (typeof x === 'number' && typeof y === 'number' && isFinite(x) && isFinite(y)) {
        p5.vertex(x, y);
      }
    });
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
  // Validate input parameters
  if (typeof centerX !== 'number' || isNaN(centerX) || !isFinite(centerX) ||
      typeof centerY !== 'number' || isNaN(centerY) || !isFinite(centerY) ||
      typeof radius !== 'number' || isNaN(radius) || !isFinite(radius) || radius <= 0) {
    console.warn(`drawHexatile called with invalid parameters: centerX=${centerX}, centerY=${centerY}, radius=${radius}`);
    return; // Skip drawing this tile
  }
  
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
  // Validate all coordinates are valid numbers
  const coords = [x1, y1, x2, y2, x3, y3];
  for (let i = 0; i < coords.length; i++) {
    if (typeof coords[i] !== 'number' || isNaN(coords[i]) || !isFinite(coords[i])) {
      console.warn(`Invalid coordinate at position ${i}: ${coords[i]}, skipping triangle`);
      return; // Skip drawing this triangle
    }
  }

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

        // Validate coordinates before drawing
        if (isNaN(tileX) || isNaN(tileY) || !isFinite(tileX) || !isFinite(tileY)) {
          console.error(`🚨 WOBBLE DEBUG v3.0 - drawMultiHexatiles POINTY-TOP FAILED: column=${column}, row=${row}`);
          console.error(`  tileX = ${baseX} + ${horizontalOffset} + ${tile_x_adjust} = ${tileX}`);
          console.error(`  tileY = ${startY} + ${((tileHeight - tileYOffset) * row)} + ${tile_y_adjust} = ${tileY}`);
          console.error(`  Components: baseX=${baseX}, horizontalOffset=${horizontalOffset}, tile_x_adjust=${tile_x_adjust}`);
          console.error(`  Tile dimensions: tileWidth=${tileWidth}, tileHeight=${tileHeight}, tileXOffset=${tileXOffset}, tileYOffset=${tileYOffset}`);
          console.error(`  Position: startX=${startX}, startY=${startY}, column=${column}, row=${row}`);
          continue;
        }

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
        
        // Validate coordinates before drawing
        if (isNaN(tileX) || isNaN(tileY) || !isFinite(tileX) || !isFinite(tileY)) {
          console.error(`🚨 WOBBLE DEBUG v3.0 - drawMultiHexatiles FLAT-TOP FAILED: column=${column}, row=${row}`);
          console.error(`  tileX = ${tileX}`);
          console.error(`  tileY = ${startY} + ${verticalOffset} + ${(verticalSpacing * row)} = ${tileY}`);
          console.error(`  Components: startX=${startX}, startY=${startY}, horizontalSpacing=${horizontalSpacing}, verticalSpacing=${verticalSpacing}`);
          console.error(`  verticalOffset=${verticalOffset}, column=${column}, row=${row}`);
          continue;
        }
        
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
  // Ensure all inputs are finite numbers
  const safeWidth = (isFinite(tile_width) && !isNaN(tile_width)) ? tile_width : 50;
  const safeXOffset = (isFinite(tile_x_offset) && !isNaN(tile_x_offset)) ? tile_x_offset : 0;
  const safeXAdjust = (isFinite(tile_x_adjust) && !isNaN(tile_x_adjust)) ? tile_x_adjust : 0;
  
  const divisor = safeWidth - safeXOffset + safeXAdjust;
  
  // Prevent division by zero or negative divisor with more robust fallback
  if (divisor <= 1 || !isFinite(divisor) || isNaN(divisor)) {
    console.warn(`Invalid divisor in getTilesWide: ${divisor} (tile_width=${tile_width}, tile_x_offset=${tile_x_offset}, tile_x_adjust=${tile_x_adjust}), using fallback`);
    // Use a safe minimum divisor based on tile width
    const fallbackDivisor = Math.max(safeWidth * 0.8, 10);
    return Math.ceil(p5.width / fallbackDivisor) + 1;
  }
  
  const result = Math.round(p5.width / divisor) + 1;
  
  // Cap at reasonable maximum to prevent memory issues
  if (!isFinite(result) || isNaN(result) || result > 500) {
    console.warn(`getTilesWide calculated invalid/excessive tiles: ${result}, using fallback`);
    return Math.min(Math.ceil(p5.width / Math.max(safeWidth, 10)) + 1, 100);
  }
  
  return Math.max(1, result); // Ensure at least 1 tile
};

const getTilesHigh = (p5, tile_height, tile_y_offset, tile_y_adjust = 0) => {
  // Ensure all inputs are finite numbers
  const safeHeight = (isFinite(tile_height) && !isNaN(tile_height)) ? tile_height : 50;
  const safeYOffset = (isFinite(tile_y_offset) && !isNaN(tile_y_offset)) ? tile_y_offset : 0;
  const safeYAdjust = (isFinite(tile_y_adjust) && !isNaN(tile_y_adjust)) ? tile_y_adjust : 0;
  
  const divisor = safeHeight - safeYOffset + safeYAdjust;
  
  // Prevent division by zero or negative divisor with more robust fallback
  if (divisor <= 1 || !isFinite(divisor) || isNaN(divisor)) {
    console.warn(`Invalid divisor in getTilesHigh: ${divisor} (tile_height=${tile_height}, tile_y_offset=${tile_y_offset}, tile_y_adjust=${tile_y_adjust}), using fallback`);
    // Use a safe minimum divisor based on tile height
    const fallbackDivisor = Math.max(safeHeight * 0.8, 10);
    return Math.ceil(p5.height / fallbackDivisor) + 1;
  }
  
  const result = Math.round(p5.height / divisor) + 1;
  
  // Cap at reasonable maximum to prevent memory issues
  if (!isFinite(result) || isNaN(result) || result > 500) {
    console.warn(`getTilesHigh calculated invalid/excessive tiles: ${result}, using fallback`);
    return Math.min(Math.ceil(p5.height / Math.max(safeHeight, 10)) + 1, 100);
  }
  
  return Math.max(1, result); // Ensure at least 1 tile
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

  // Debug logging for troubleshooting
  if (adjustment.type === 'random' && (isNaN(i) || isNaN(j) || isNaN(r))) {
    console.warn(`Invalid parameters for random adjustment: i=${i}, j=${j}, r=${r}, adjustment=`, adjustment);
    return 0;
  }

  switch (adjustment.type) {
    case 'wave':
    case 'sine':
      // wave:amplitude:frequency (optimized calculation with safety checks)
      const amplitude = adjustment.values[0] || 10;
      const frequency = adjustment.values[1] || 1;
      
      // Validate wave parameters
      if (!isFinite(amplitude) || isNaN(amplitude) || !isFinite(frequency) || isNaN(frequency)) {
        return 0;
      }
      
      const waveInput = (i + j) * frequency * 0.1;
      const waveResult = amplitude * Math.sin(waveInput);
      return isFinite(waveResult) && !isNaN(waveResult) ? waveResult : 0;
    
    case 'random':
      // random:intensity (optimized deterministic random with safety checks)
      const intensity = adjustment.values[0] || 5;
      
      // Validate intensity parameter
      if (!isFinite(intensity) || isNaN(intensity)) {
        console.warn(`Invalid intensity in random adjustment: ${intensity}`);
        return 0;
      }
      
      // Validate input parameters
      if (!isFinite(i) || isNaN(i) || !isFinite(j) || isNaN(j)) {
        console.warn(`Invalid i,j parameters in random adjustment: i=${i}, j=${j}`);
        return 0;
      }
      
      // Use safer deterministic random based on position with overflow protection
      // Keep values smaller to prevent overflow
      const safeI = Math.abs(i % 1000); // Cap i to prevent overflow
      const safeJ = Math.abs(j % 1000); // Cap j to prevent overflow
      const seed = (safeI * 73 + safeJ * 79) % 2147483647; // Use smaller primes, mod early
      
      // Check for overflow in seed calculation
      if (!isFinite(seed) || isNaN(seed) || seed < 0) {
        console.warn(`Seed calculation overflow: i=${i}, j=${j}, safeI=${safeI}, safeJ=${safeJ}, seed=${seed}`);
        return 0;
      }
      
      // Use safer calculation to prevent overflow in multiplication
      const modResult = Math.abs((seed * 16807) % 2147483647);
      const pseudoRandom = modResult / 2147483647; // Linear congruential generator
      
      // Debug random calculation for problematic positions
      if ((i === 43 && j === 19) || (i > 40 && isNaN(pseudoRandom))) {
        console.error(`🎲 Random calculation debug at i=${i}, j=${j}:`);
        console.error(`  seed = ${i} * 1009 + ${j} * 1013 = ${seed}`);
        console.error(`  modResult = (${seed} * 16807) % 2147483647 = ${modResult}`);
        console.error(`  pseudoRandom = ${modResult} / 2147483647 = ${pseudoRandom}`);
        console.error(`  intensity = ${intensity}`);
      }
      
      // Validate the random calculation result
      if (!isFinite(pseudoRandom) || isNaN(pseudoRandom)) {
        console.warn(`Pseudorandom calculation failed: seed=${seed}, modResult=${modResult}, pseudoRandom=${pseudoRandom}`);
        return 0;
      }
      
      const finalResult = (pseudoRandom - 0.5) * intensity * 2;
      const safeResult = isFinite(finalResult) && !isNaN(finalResult) ? finalResult : 0;
      
      if (safeResult !== finalResult) {
        console.warn(`Final result validation failed: finalResult=${finalResult}, returning 0`);
      }
      
      return safeResult;
    
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
 * Creates optimized adjustment function for X or Y coordinate with memoization
 * 
 * @param {number|Object} adjustment - X or Y adjustment value/object
 * @param {number} r - Tile radius
 * @param {string} axis - 'x' or 'y' for legacy behavior
 * @returns {Function} Function that takes (i, j) and returns adjustment value
 */
const createAdjustmentFunction = (adjustment, r, axis) => {
  // For numeric adjustments, no need to cache
  if (typeof adjustment !== 'object' || adjustment.type === 'numeric') {
    const numericValue = getNumericValue(adjustment);
    return (i, j) => numericValue * (axis === 'x' ? i : j);
  }

  // For complex adjustments (wave, wobble, random), use memoization
  const cache = new Map();
  const maxCacheSize = 5000; // Limit cache size to prevent memory issues
  
  return (i, j) => {
    const key = `${i},${j}`;
    
    // Check cache first
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Calculate new value
    const value = calculateTileAdjustment(adjustment, i, j, r);
    
    // Validate the calculated value with extra safety
    const safeValue = (typeof value === 'number' && isFinite(value) && !isNaN(value)) ? value : 0;
    
    // Debug specific problematic cases
    if ((value !== safeValue && i > 40) || (i === 43 && j === 19)) {
      console.error(`🚨 Adjustment calculation issue at i=${i}, j=${j}:`);
      console.error(`  Raw calculated value: ${value}`);
      console.error(`  Safe value used: ${safeValue}`);
      console.error(`  Adjustment object:`, adjustment);
      console.error(`  Cache key: ${key}`);
      console.error(`  Cache size: ${cache.size}`);
    }
    
    // Add to cache if under limit
    if (cache.size < maxCacheSize) {
      cache.set(key, safeValue);
    }
    
    return safeValue;
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
  // Check if radius is valid
  if (isNaN(r) || !isFinite(r) || r <= 0) {
    console.error(`Invalid radius parameter in tileUnified: r=${r}`);
    return;
  }
  
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
  
  // Debug tile dimensions
  if (isNaN(tile_width) || isNaN(tile_height) || isNaN(tile_x_offset) || isNaN(tile_y_offset)) {
    console.error(`Invalid tile dimensions: width=${tile_width}, height=${tile_height}, x_offset=${tile_x_offset}, y_offset=${tile_y_offset}, r=${r}, shape=${tile_shape}`);
  }
  
  // Get mosaic dimensions
  const tiles_in_mosaic_wide = tile_pattern.length;
  const tiles_in_mosaic_high = tile_pattern[0].length;
  
  // Pre-calculate adjustment values once (performance optimization)
  const xAdjustForTiling = typeof tile_x_adjust === 'object' ? tile_x_adjust.value || 0 : tile_x_adjust;
  const yAdjustForTiling = typeof tile_y_adjust === 'object' ? tile_y_adjust.value || 0 : tile_y_adjust;
  
  // Use single mosaic dimensions if requested, otherwise fill canvas
  const tiles_wide = tile_options.showSingleMosaic ? tiles_in_mosaic_wide : getTilesWide(p5, tile_width, tile_x_offset, xAdjustForTiling);
  const tiles_high = tile_options.showSingleMosaic ? tiles_in_mosaic_high : getTilesHigh(p5, tile_height, tile_y_offset, yAdjustForTiling);
  
  // Debug tiles calculation
  if (isNaN(tiles_wide) || isNaN(tiles_high) || tiles_wide > 200 || tiles_high > 200) {
    console.error(`Suspicious tiles calculation: tiles_wide=${tiles_wide}, tiles_high=${tiles_high}`);
    console.error(`  tile_width=${tile_width}, tile_height=${tile_height}`);
    console.error(`  canvas size: ${p5.width}x${p5.height}`);
  }
  
  // Test specific problematic position if we're dealing with wobble
  if (tile_x_adjust && typeof tile_x_adjust === 'object' && tile_x_adjust.type === 'random') {
    console.log(`🧪 Testing wobble calculation at i=43, j=19:`);
    const testXAdjust = getXAdjustment(43, 19);
    console.log(`  Result: ${testXAdjust}`);
  }
  
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  for (let i = 0; i < tiles_wide; i++) {
    // Calculate base X position based on orientation with validation
    let x_pos;
    if (i === 0) {
      x_pos = 0;
    } else if (isPointyTop) {
      x_pos = tile_width * i;
    } else {
      x_pos = (tile_width - tile_x_offset) * i;
    }
    
    // Validate and provide fallback for x_pos
    if (!isFinite(x_pos) || isNaN(x_pos)) {
      console.error(`x_pos calculation failed at i=${i}:`);
      console.error(`  tile_width=${tile_width}, tile_x_offset=${tile_x_offset}, isPointyTop=${isPointyTop}`);
      console.error(`  Invalid result: ${x_pos}`);
      // Use safe fallback based on available values
      const safeTileWidth = (isFinite(tile_width) && !isNaN(tile_width)) ? tile_width : 50;
      x_pos = i * safeTileWidth;
      console.error(`  Using fallback x_pos=${x_pos}`);
    }
    const tile_column = (i % tiles_in_mosaic_wide);
    
    // Calculate vertical offset for flat-top (alternates by column)
    const offset_y = (!isPointyTop && (i % 2 !== 0)) ? tile_y_offset + tile_x_y_normalize + extraOffset : 0;
  
    for (let j = 0; j < tiles_high; j++) {
      const tile_row = (j % tiles_in_mosaic_high);
      
      // Calculate horizontal offset for pointy-top (alternates by row)
      const offset_x = (isPointyTop && (j % 2 !== 0)) ? tile_x_offset + tile_x_y_normalize + extraOffset : 0;
      
      // Calculate final positions based on orientation with validation
      let xAdjust = getXAdjustment(i, j);
      let yAdjust = getYAdjustment(i, j);
      
      // Validate adjustments and provide safe fallbacks
      if (!isFinite(xAdjust) || isNaN(xAdjust)) {
        console.warn(`Invalid xAdjust at i=${i}, j=${j}: ${xAdjust}, using 0`);
        xAdjust = 0;
      }
      if (!isFinite(yAdjust) || isNaN(yAdjust)) {
        console.warn(`Invalid yAdjust at i=${i}, j=${j}: ${yAdjust}, using 0`);
        yAdjust = 0;
      }
      
      // Validate offset_x calculation
      let safeOffsetX = offset_x;
      if (!isFinite(offset_x) || isNaN(offset_x)) {
        console.warn(`Invalid offset_x at i=${i}, j=${j}: ${offset_x}, using 0`);
        safeOffsetX = 0;
      }
      
      // Calculate final coordinates with safe values
      const x_loc = x_pos + safeOffsetX + xAdjust;
      
      let y_loc;
      if (isPointyTop) {
        const yBase = (tile_height - tile_y_offset) * j;
        y_loc = (isFinite(yBase) && !isNaN(yBase)) ? yBase + yAdjust : j * 50 + yAdjust;
      } else {
        const yBase = tile_height * j + offset_y;
        y_loc = (isFinite(yBase) && !isNaN(yBase)) ? yBase + yAdjust : j * 50 + yAdjust;
      }

      // Final validation and fallback for coordinates
      let finalX = x_loc;
      let finalY = y_loc;
      
      if (!isFinite(finalX) || isNaN(finalX)) {
        console.warn(`Invalid final x_loc at i=${i}, j=${j}: ${finalX}, using fallback`);
        finalX = i * 50; // Simple fallback positioning
      }
      
      if (!isFinite(finalY) || isNaN(finalY)) {
        console.warn(`Invalid final y_loc at i=${i}, j=${j}: ${finalY}, using fallback`);
        finalY = j * 50; // Simple fallback positioning
      }

      // Draw the appropriate tile type with validated coordinates
      if (isPointyTop) {
        drawPointyTopHexatile(p5, finalX, finalY, r, tile_pattern[tile_column][tile_row], color_theme, tile_options, useGradient);
      } else {
        drawFlatTopHexatile(p5, finalX, finalY, r, tile_pattern[tile_column][tile_row], color_theme, tile_options, useGradient);
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



  





