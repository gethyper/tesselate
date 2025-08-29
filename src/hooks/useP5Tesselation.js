import { useCallback, useRef } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
import { textures } from '../components/textures';
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
export const oldDrawHexagon = (p5, centerX, centerY, radius, numSides) => { 

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
 * Calculates and returns the vertices of a flat-top hexagon
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} cX - X coordinate of the hexagon center
 * @param {number} cY - Y coordinate of the hexagon center
 * @param {number} r - Radius of the hexagon
 * @returns {Array<Array<number>>} Array of [x, y] coordinate pairs representing the vertices
 */
export const getHexagonVertices = (p5, cX, cY, r) => {
  const vertices = [];
  for (let a = 0; a < p5.TAU; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
  }
  return vertices;
}

/**
 * Adjusts the brightness of a color by a given percentage
 * 
 * @param {string} colorStr - Color string (hex, named color, or rgb)
 * @param {number} percent - Percentage to adjust brightness (-100 to 100)
 * @returns {string} Adjusted color in rgb format
 */
const adjustColor = (colorStr, percent) => {
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
  const lightColor = adjustColor(baseColor, 2);
  const darkColor = adjustColor(baseColor, -2);
  
  // Create linear gradient
  const ctx = p5.drawingContext;
  const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, lightColor);
  gradient.addColorStop(1, darkColor);
  
  return gradient;
};

/**
 * Draws a flat-top hexagon outline
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} cX - X coordinate of the hexagon center
 * @param {number} cY - Y coordinate of the hexagon center
 * @param {number} r - Radius of the hexagon
 */
export const drawFlatTopHexagon = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = 0; a < p5.TAU; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

/**
 * Draws a pointy-top hexagon outline (rotated 30 degrees from flat-top)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} cX - X coordinate of the hexagon center
 * @param {number} cY - Y coordinate of the hexagon center
 * @param {number} r - Radius of the hexagon
 */
export const drawPointyTopHexagon = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = p5.TAU/12; a < p5.TAU + p5.TAU/12; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

/**
 * Draws a single flat-top hexagonal tile composed of triangular segments
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} cX - X coordinate of the hexagon center
 * @param {number} cY - Y coordinate of the hexagon center
 * @param {number} r - Radius of the hexagon
 * @param {Array} tile_components - Array of tile component definitions with colors and strokes
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration including texture
 * @param {boolean} useGradient - Whether to apply gradient effects to triangles
 */
export const drawHexatile = (p5, cX, cY, r, tile_components, color_theme, tile_options = {}, useGradient = false) => {
  const vertices = [];
  
  // Generate hexagon vertices
  for (let a = 0; a < p5.TAU; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
  }
  
  // Draw shadow if requested
  if (tile_options.addShadows) {
    p5.push();
    p5.fill(0, 0, 0, 50); // Semi-transparent black shadow
    p5.noStroke();
    drawFlatTopHexagon(p5, cX + 3, cY + 3, r); // Offset shadow
    p5.pop();
  }
  
  // Draw the hexagon outline
  drawFlatTopHexagon(p5, cX, cY, r);
  
  // Draw each triangular segment
  for (let i = 0; i < vertices.length - 1; i++) {
    const tri = tile_components[i];
    const tri_color = color_theme[tri.c || tri.color];
    
    const stroke_options = {
      stroke_color: color_theme[tri.stroke || tri.s],
      stroke_a: color_theme[tri.stroke_a || tri.sa],
      stroke_b: color_theme[tri.stroke_b || tri.sb],
      stroke_c: color_theme[tri.stroke_c || tri.sc]
    };

    const x1 = vertices[i][0];
    const y1 = vertices[i][1];
    const x2 = vertices[i + 1][0];
    const y2 = vertices[i + 1][1];
    const x3 = cX;
    const y3 = cY;

    drawTriangle(p5, x1, y1, x2, y2, x3, y3, tri_color, stroke_options, useGradient, tile_options.textureImg);
  }
};

/**
 * Draws a single pointy-top hexagonal tile composed of triangular segments
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} cX - X coordinate of the hexagon center
 * @param {number} cY - Y coordinate of the hexagon center
 * @param {number} r - Radius of the hexagon
 * @param {Array} tile_components - Array of tile component definitions with colors and strokes
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration including texture
 * @param {boolean} useGradient - Whether to apply gradient effects to triangles
 */
export const drawPointyTopHexatile = (p5, cX, cY, r, tile_components, color_theme, tile_options = {}, useGradient = false) => {
  const vertices = [];
  
  // Generate pointy-top hexagon vertices (rotated by 30 degrees)
  for (let a = p5.TAU / 12; a < p5.TAU + p5.TAU / 12; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
  }

  // Draw shadow if requested
  if (tile_options.addShadows) {
    p5.push();
    p5.fill(0, 0, 0, 50); // Semi-transparent black shadow
    p5.noStroke();
    drawPointyTopHexagon(p5, cX + 3, cY + 3, r); // Offset shadow
    p5.pop();
  }

  // Draw the hexagon outline
  drawPointyTopHexagon(p5, cX, cY, r);

  // Draw each triangular segment
  for (let i = 0; i < vertices.length - 1; i++) {
    const tri = tile_components[i];
    const tri_color = color_theme[tri.color || tri.c];
    
    const stroke_options = {
      stroke_color: color_theme[tri.stroke || tri.s],
      stroke_a: color_theme[tri.stroke_a || tri.sa],
      stroke_b: color_theme[tri.stroke_b || tri.sb],
      stroke_c: color_theme[tri.stroke_c || tri.sc]
    };

    const x1 = vertices[i][0];
    const y1 = vertices[i][1];
    const x2 = vertices[i + 1][0];
    const y2 = vertices[i + 1][1];
    const x3 = cX;
    const y3 = cY;

    drawTriangle(p5, x1, y1, x2, y2, x3, y3, tri_color, stroke_options, useGradient, tile_options.textureImg);
  }
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
 * Parses color strings and returns RGB components
 * 
 * @param {string} colorStr - Color string (hex, named color, or rgb format)
 * @returns {Object|null} Object with r, g, b properties or null if parsing fails
 */
// eslint-disable-next-line no-unused-vars
const parseColor = (colorStr) => {
  if (!colorStr) return null;
  
  // Handle named colors
  if (colorStr === 'grey' || colorStr === 'gray') {
    return { r: 128, g: 128, b: 128 };
  } else if (colorStr === 'white') {
    return { r: 255, g: 255, b: 255 };
  } else if (colorStr === 'black') {
    return { r: 0, g: 0, b: 0 };
  }
  
  // Handle hex colors
  if (colorStr.startsWith('#')) {
    let hex = colorStr.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    if (!isNaN(num)) {
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }
  }
  
  // Handle rgb() format
  const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  
  return null;
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
export const drawTriangle = (p5, x1, y1, x2, y2, x3, y3, color, stroke_options = {}, useGradient = false, textureImg = null) => {
  const stroke_color = stroke_options.stroke_color || null;
  const stroke_weight = stroke_options.stroke_weight || 1;
  const stroke_a = stroke_options.stroke_a || null;
  const stroke_b = stroke_options.stroke_b || null;
  const stroke_c = stroke_options.stroke_c || null;

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
 * Draws multiple pointy-top hexagonal tiles in a tessellated pattern
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {string} tile_shape - The shape type (used for consistency with other functions)
 * @param {number} pos_x - Starting X position for the tile pattern
 * @param {number} pos_y - Starting Y position for the tile pattern
 * @param {number} radius - Radius of each hexagonal tile
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
export const drawMultiPointyTopHexatile = (
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

  // Calculate tile dimensions and offsets using helper functions
  const tileWidth = getTileWidth(tile_shape, radius, tile_x_adjust);
  const tileHeight = getTileHeight(tile_shape, radius, tile_y_adjust);
  const tileXOffset = getTileXOffset(tile_shape, radius, tile_x_adjust);
  const tileYOffset = getTileYOffset(tile_shape, radius, tile_y_adjust);

  // Starting position
  const startX = pos_x;
  const startY = pos_y;

  // Draw tiles in a tessellated pattern
  for (let column = 0; column < tilesWide; column++) {
    // Base X position for this column
    const baseX = startX + (tileWidth * column) - tileXOffset;

    for (let row = 0; row < tilesHigh; row++) {
      // Alternate rows are offset horizontally for proper tessellation
      const horizontalOffset = (row % 2 === 0) ? 0 : tileXOffset;
      
      // Calculate final tile position
      const tileX = baseX + horizontalOffset;
      const tileY = startY + ((tileHeight - tileYOffset) * row);

      drawPointyTopHexatile(
        p5, 
        tileX, 
        tileY, 
        radius, 
        tile_pattern[column][row], 
        color_theme, 
        tile_options, 
        useGradient
      );
    }
  }
};

/**
 * Draws multiple flat-top hexagonal tiles in a tessellated pattern
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {string} tile_shape - The shape type (used for consistency with other functions)
 * @param {number} pos_x - Starting X position for the tile pattern
 * @param {number} pos_y - Starting Y position for the tile pattern
 * @param {number} radius - Radius of each hexagonal tile
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
export const drawMultiHexatile = (
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
  
  // Flat-top hexagon tessellation constants
  const HORIZONTAL_SPACING_RATIO = 1.5; // 3/2 ratio for flat-top hex spacing
  const VERTICAL_SPACING_RATIO = Math.sqrt(3) / 2; // √3/2 ≈ 0.866 for flat-top hex height
  
  // Calculate spacing between tiles
  const horizontalSpacing = radius * HORIZONTAL_SPACING_RATIO;
  const verticalSpacing = radius * 2 * VERTICAL_SPACING_RATIO;

  // Draw tiles in a tessellated pattern
  for (let column = 0; column < tilesWide; column++) {
    const tileX = startX + (horizontalSpacing * column);
    
    // Alternate columns are offset vertically for proper tessellation
    const verticalOffset = (column % 2 !== 0) ? verticalSpacing / 2 : 0;
    
    for (let row = 0; row < tilesHigh; row++) {
      const tileY = startY + verticalOffset + (verticalSpacing * row);
      
      drawHexatile(
        p5, 
        tileX, 
        tileY, 
        radius, 
        tile_pattern[column][row], 
        color_theme, 
        tile_options, 
        useGradient
      );
    }
  }
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
export const drawMultiUnified = (p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // Use the existing pointy-top logic
    drawMultiPointyTopHexatile(p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options, useGradient);
  } else {
    // Use the existing flat-top logic  
    drawMultiHexatile(p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options, useGradient);
  }
};

/**
 * Draws a hexagonal tile pattern centered at origin (0,0)
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of each hexagonal tile
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
export const drawCenteredHexatile = (p5, tile_shape, r, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  const x_loc = 0;
  const y_loc = 0;

  p5.noStroke(); 
  
  if (tile_shape === 'pointyTopHexatile') {
    drawMultiPointyTopHexatile(p5, tile_shape, x_loc, y_loc, r, tile_pattern, color_theme, tile_options, useGradient);
  } else {
    drawMultiHexatile(p5, tile_shape, x_loc, y_loc, r, tile_pattern, color_theme, tile_options, useGradient);
  }
};

/**
 * Calculates the width of a hexagonal tile based on its orientation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @param {number} tile_x_adjust - Additional horizontal adjustment
 * @returns {number} Width of the tile
 */
const getTileWidth = (tile_shape, r, tile_x_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2 * 0.8666) + tile_x_adjust : (r * 2) + tile_x_adjust;
};

/**
 * Calculates the height of a hexagonal tile based on its orientation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @param {number} tile_y_adjust - Additional vertical adjustment
 * @returns {number} Height of the tile
 */
const getTileHeight = (tile_shape, r, tile_y_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2) + tile_y_adjust : (r * 2 * 0.8666) + tile_y_adjust;
};

/**
 * Calculates the horizontal offset needed for proper hexagon tessellation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @param {number} tile_x_adjust - Additional horizontal adjustment
 * @returns {number} Horizontal offset for tessellation
 */
const getTileXOffset = (tile_shape, r, tile_x_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  const baseOffset = isPointyTop ? r * 0.8666 : r / 2;
  return baseOffset + tile_x_adjust;
};

/**
 * Calculates the vertical offset needed for proper hexagon tessellation
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} r - Radius of the hexagon
 * @param {number} tile_y_adjust - Additional vertical adjustment
 * @returns {number} Vertical offset for tessellation
 */
const getTileYOffset = (tile_shape, r, tile_y_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  const baseOffset = isPointyTop ? r / 2 : r * 0.8666;
  return baseOffset + tile_y_adjust;
};

/**
 * Calculates the total width of a mosaic pattern
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} tile_width - Width of individual tiles
 * @param {number} tiles_in_mosaic_wide - Number of tiles horizontally in the mosaic
 * @param {number} tile_x_offset - Horizontal offset between tiles
 * @param {number} mosaic_x_adjust - Additional horizontal adjustment for the mosaic
 * @returns {number} Total width of the mosaic
 */
const getMosaicWidth = (tile_shape, tile_width, tiles_in_mosaic_wide, tile_x_offset, mosaic_x_adjust = 0) => {
  // Handle single tile case
  if (tiles_in_mosaic_wide === 1) {
    return tile_width + mosaic_x_adjust;
  }

  // Calculate width based on tile orientation
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // For pointy-top hexagons: width = (number of tiles * tile width) + offset
    return (tiles_in_mosaic_wide * tile_width) + tile_x_offset + mosaic_x_adjust;
  } else {
    // For flat-top hexagons: width = overlapping tiles + final full tile
    return ((tiles_in_mosaic_wide - 1) * (tile_width - tile_x_offset)) + tile_width + mosaic_x_adjust;
  }
};

/**
 * Calculates the total height of a mosaic pattern
 * 
 * @param {string} tile_shape - Shape type ('pointyTopHexatile' or flat-top)
 * @param {number} tile_height - Height of individual tiles
 * @param {number} tiles_in_mosaic_high - Number of tiles vertically in the mosaic
 * @param {number} tile_y_offset - Vertical offset between tiles
 * @param {number} mosaic_y_adjust - Additional vertical adjustment for the mosaic
 * @returns {number} Total height of the mosaic
 */
const getMosaicHeight = (tile_shape, tile_height, tiles_in_mosaic_high, tile_y_offset, mosaic_y_adjust = 0) => {
  // Handle single tile case
  if (tiles_in_mosaic_high === 1) {
    return tile_height + mosaic_y_adjust;
  }

  // Calculate height based on tile orientation
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  if (isPointyTop) {
    // For pointy-top hexagons: height = overlapping tiles + final offset
    return ((tile_height - tile_y_offset) * tiles_in_mosaic_high) + tile_y_offset + mosaic_y_adjust;
  } else {
    // For flat-top hexagons: height = number of tiles * tile height
    return (tile_height * tiles_in_mosaic_high) + mosaic_y_adjust;
  }
};

/**
 * Calculates how many mosaics fit horizontally across the canvas
 * 
 * @param {Object} p5 - The p5.js instance (for accessing canvas width)
 * @param {number} mosaic_width - Width of a single mosaic
 * @param {number} tile_x_offset - Horizontal offset between tiles
 * @returns {number} Number of mosaics that fit horizontally
 */
const getMosaicsWide = (p5, mosaic_width, tile_x_offset) => {
  return Math.round(p5.width / (mosaic_width - tile_x_offset)) + 1;
};

const getTilesWide = (p5, tile_width, tile_x_offset) => {
  return Math.round(p5.width / (tile_width - tile_x_offset)) + 1;
};

/**
 * Calculates how many mosaics fit vertically across the canvas
 * 
 * @param {Object} p5 - The p5.js instance (for accessing canvas height)
 * @param {number} mosaic_height - Height of a single mosaic
 * @param {number} tile_y_offset - Vertical offset between tiles
 * @returns {number} Number of mosaics that fit vertically
 */
const getMosaicsHigh = (p5, mosaic_height, tile_y_offset) => {
  return Math.round(p5.height / (mosaic_height - tile_y_offset)) + 1;
};

const getTilesHigh = (p5, tile_height, tile_y_offset) => {
  return Math.round(p5.height / (tile_height - tile_y_offset)) + 1;
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
  console.log("fillWithTiles called");
  // Use unified drawing function
  const tileFunction = tile_shape === 'pointyTopHexatile' ? tilePointyTopHexatile : tileFlatTopHexatile;
  
  tileFunction(p5, r, tile_shape, tile_pattern, color_theme, drawMultiUnified, tile_options, useGradient);
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
const tileUnified = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  
  // Extract tile adjustments
  const tile_x_adjust = tile_options.tile_x_adjust || 0;
  const tile_y_adjust = tile_options.tile_y_adjust || 0;
  
  // Calculate tile dimensions and offsets
  const tile_width = getTileWidth(tile_shape, r, tile_x_adjust);
  const tile_height = getTileHeight(tile_shape, r, tile_y_adjust);
  const tile_x_offset = getTileXOffset(tile_shape, r, tile_x_adjust);
  const tile_y_offset = getTileYOffset(tile_shape, r, tile_y_adjust);
  
  // Get mosaic dimensions
  const tiles_in_mosaic_wide = tile_pattern.length;
  const tiles_in_mosaic_high = tile_pattern[0].length;
  
  // Calculate mosaic dimensions for screen tiling
  const mosaic_x_adjust = tile_options.mosaic_x_adjust || 0;
  const mosaic_y_adjust = tile_options.mosaic_y_adjust || 0;
  const mosaic_width = getMosaicWidth(tile_shape, tile_width, tiles_in_mosaic_wide, tile_x_offset, mosaic_x_adjust);
  const mosaic_height = getMosaicHeight(tile_shape, tile_height, tiles_in_mosaic_high, tile_y_offset, mosaic_y_adjust);
  const mosaics_wide = getMosaicsWide(p5, mosaic_width, tile_x_offset);
  const mosaics_high = getMosaicsHigh(p5, mosaic_height, tile_y_offset);

  // Unified tiling logic
  for (let i = 0; i < mosaics_wide; i++) {
    for (let j = 0; j < mosaics_high; j++) {
      let x_loc, y_loc;
      
      if (isPointyTop) {
        // Pointy-top positioning logic
        let column_increment, row_increment;
        
        if (i > 0) {
          if (tiles_in_mosaic_wide > 1) {
            column_increment = (mosaic_width * i) - (tile_x_offset * i);
          } else {
            column_increment = (mosaic_width * i);
          }    
        } else {
          column_increment = 0;
        }

        const mosaic_x_offset = (tiles_in_mosaic_high % 2 !== 0 && j % 2 !== 0) ? tile_x_offset : 0;
        const mosaic_y_offset = (tiles_in_mosaic_high % 2 !== 0 && j > 0) ? tile_y_offset * j : 0;

        if (j > 0) {
          if (tiles_in_mosaic_high % 2 === 0) {
            row_increment = (mosaic_height * j) - (tile_y_offset * j);
          } else {
            row_increment = (mosaic_height * j); 
          }
        } else {
          row_increment = 0;
        }

        x_loc = column_increment + mosaic_x_offset;
        y_loc = row_increment - mosaic_y_offset;
        
      } else {
        // Flat-top positioning logic
        const col_offset = (i % 2 !== 0) ? tile_y_offset : 0;
        x_loc = (mosaic_width * i) - tile_x_offset;
        y_loc = (mosaic_height * j) - tile_y_offset - col_offset;
      }

      draw_function(p5, tile_shape, x_loc, y_loc, r, tile_pattern, color_theme, tile_options, useGradient);
    }
  }
};

/**
 * Tiles the canvas with pointy-top hexagonal patterns
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type (should be 'pointyTopHexatile')
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
const tilePointyTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  
    // Calculate tile dimensions and offsets
    const tile_width = getTileWidth(tile_shape, r);
    const tile_height = getTileHeight(tile_shape, r);
    const tile_x_offset = getTileXOffset(tile_shape, r);
    const tile_y_offset = getTileYOffset(tile_shape, r);
    
    // Get mosaic dimensions
    const tiles_in_mosaic_wide = tile_pattern.length;
    const tiles_in_mosaic_high = tile_pattern[0].length;
    
    // Use single mosaic dimensions if requested, otherwise fill canvas
    const tiles_wide = tile_options.showSingleMosaic ? tiles_in_mosaic_wide : getTilesWide(p5, tile_width, tile_x_offset);
    const tiles_high = tile_options.showSingleMosaic ? tiles_in_mosaic_high : getTilesHigh(p5, tile_height, tile_y_offset);
    
  for (let i = 0; i < tiles_wide ; i++) {

    const x_pos = (i === 0) ? 0 : (tile_width * i);
    const tile_column = (i % (tiles_in_mosaic_wide));
  
    for (let j = 0; j < tiles_high; j++) {
      
      const tile_row = (j % (tiles_in_mosaic_high));
      const offset_x = (j % 2 !== 0) ?  tile_x_offset : 0
      const x_loc = x_pos + offset_x;
      const y_loc = (tile_height - tile_y_offset) * j;
      drawPointyTopHexatile(p5, x_loc, y_loc, r, tile_pattern [tile_column][tile_row], color_theme, tile_options, useGradient);
    }
  }
};

/**
 * Tiles the canvas with flat-top hexagonal patterns
 * 
 * @param {Object} p5 - The p5.js instance
 * @param {number} r - Radius of each hexagonal tile
 * @param {string} tile_shape - Shape type (should be flat-top hexagon)
 * @param {Array<Array>} tile_pattern - 2D array defining the tile pattern
 * @param {Object} color_theme - Color theme object containing color definitions
 * @param {Function} draw_function - Function to draw individual tile patterns
 * @param {Object} tile_options - Optional tile configuration
 * @param {boolean} useGradient - Whether to apply gradient effects
 */
const tileFlatTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  
  // Calculate tile dimensions and offsets
  const tile_width = getTileWidth(tile_shape, r);
  const tile_height = getTileHeight(tile_shape, r);
  const tile_x_offset = getTileXOffset(tile_shape, r);
  const tile_y_offset = getTileYOffset(tile_shape, r);
  
  // Get mosaic dimensions and number of tiles in mosaic
  const tiles_in_mosaic_wide = tile_pattern.length;
  const tiles_in_mosaic_high = tile_pattern[0].length;
  
  // Use single mosaic dimensions if requested, otherwise fill canvas
  const tiles_wide = tile_options.showSingleMosaic ? tiles_in_mosaic_wide : getTilesWide(p5, tile_width, tile_x_offset);
  const tiles_high = tile_options.showSingleMosaic ? tiles_in_mosaic_high : getTilesHigh(p5, tile_height, tile_y_offset);
    
  for (let i = 0; i < tiles_wide ; i++) {

    const x_pos = (i === 0) ? 0 : ((tile_width-tile_x_offset)*i);
    const tile_column = (i % (tiles_in_mosaic_wide));
    const offset_y = (i % 2 !== 0) ? tile_y_offset : 0;
  
    for (let j = 0; j < tiles_high; j++) {
      
      const tile_row = (j % (tiles_in_mosaic_high));
      
      const x_loc = x_pos;
      const y_loc = ((tile_height) * j) + offset_y;

      //const y_loc = y_start + y_adjust + (y_offset * j);
      drawHexatile(p5, x_loc, y_loc, r, tile_pattern [tile_column][tile_row], color_theme, tile_options, useGradient);
    }
  }
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

  const setup = useCallback((p5) => {
    console.log("Canvas created");
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noStroke();
    p5InstanceRef.current = p5;
    
    // Load texture if specified
    if (textureKey && textures[textureKey]) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        textureImageRef.current = img;
        p5.redraw();
      };
      img.onerror = (error) => {
        console.error('Failed to load texture:', textureKey, error);
      };
      img.src = textures[textureKey];
    }
  }, [textureKey]);

  const draw = useCallback((p5) => {
    try {
      p5.background(safeColorTheme.bg);

      // Update tile_options with current texture
      const updatedTileOptions = {
        ...tile_options,
        textureImg: textureImageRef.current
      };

      // Safety check for tile_pattern
      if (!safeTilePattern || !Array.isArray(safeTilePattern) || safeTilePattern.length === 0) {
        return;
      }

      if (single_tile === true) {
        drawCenteredHexatile(p5, safeTileShape, r, safeTilePattern, safeColorTheme, updatedTileOptions, useGradient);
      } else {
        fillWithTiles(p5, safeTileShape, r, safeTilePattern, safeColorTheme, updatedTileOptions, useGradient);
      }
      
      p5.noStroke();
      p5.noLoop(); // Stop after drawing once
      
    } catch (error) {
      console.error('Error in draw function:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r, safeTileShape, safeTilePattern, safeColorTheme, single_tile, tile_options, useGradient, textureKey]);

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



  





