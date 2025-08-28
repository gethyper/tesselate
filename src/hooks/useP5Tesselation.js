import { useCallback, useRef } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
import { textures } from '../components/textures';
// Import tile pattern functions or define your pattern mapping

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

export const getHexagonVertices = (p5, cX, cY, r) => {
  const vertices = [];
  for (let a = 0; a < p5.TAU; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
  }
  return vertices;
}

// Helper function to lighten/darken a color
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

// Create gradient fill for a shape
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

export const drawFlatTopHexagon = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = 0; a < p5.TAU; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

  export const drawPointyTopHexagon = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = p5.TAU/12; a < p5.TAU + p5.TAU/12; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

export const drawHexatile = (p5, cX, cY, r, tile_components, color_theme, tile_options = {}, useGradient = false) => {
  const vertices = [];
  
  // Generate hexagon vertices
  for (let a = 0; a < p5.TAU; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
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

export const drawPointyTopHexatile = (p5, cX, cY, r, tile_components, color_theme, tile_options = {}, useGradient = false) => {
  const vertices = [];
  
  // Generate pointy-top hexagon vertices (rotated by 30 degrees)
  for (let a = p5.TAU / 12; a < p5.TAU + p5.TAU / 12; a += p5.TAU / 6) {
    vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
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

// Draw textured triangle using manual canvas drawing (works in 2D mode)
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

// Helper function to parse color strings
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



export const drawMultiPointyTopHexatile = (p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {

  const tile_x_adjust = tile_options.tile_x_adjust || 0;
  const tile_y_adjust = tile_options.tile_y_adjust || 0;


  let tiles_wide = tile_pattern.length;
  let tiles_high = tile_pattern[0].length;

      // Calculate tile dimensions and offsets
  const tile_width = getTileWidth(tile_shape, radius, tile_x_adjust);
  const tile_height = getTileHeight(tile_shape, radius, tile_y_adjust);
  const tile_x_offset = getTileXOffset(tile_shape, radius);
  const tile_y_offset = getTileYOffset(tile_shape, radius);


  let x_start = pos_x;
  let y_start = pos_y;
  // let r = radius;
  let x_loc, y_loc, x_adjust; //x_adjust is the offset for the x position of the tile


  for (let i = 0; i < tiles_wide; i++) { // tiles high is the number of rows
    x_loc = x_start + ((tile_width * i) - tile_x_offset) + tile_x_adjust;

    for (let j = 0; j < tiles_high; j++) {

      if ( j % 2 === 0) {  
        // y_adjust = 0;
        x_adjust = 0;
      } else {  
        // y_adjust = tile_y_offset;
        x_adjust = tile_x_offset;
      } 

      // Try adding instead of subtracting y_adjust
      y_loc = y_start + ((tile_height - tile_y_offset) * j) + tile_y_adjust;

      //y_loc = y_start + y_adjust + (r/2 * j);
      drawPointyTopHexatile(p5, x_loc+x_adjust, y_loc, radius, tile_pattern[i][j], color_theme, tile_options, useGradient);
    }
  }
};

export const drawMultiHexatile = (p5, tile_shape, pos_x, pos_y, radius, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {

  const tile_x_adjust = tile_options.tile_x_adjust || 0;
  // const tile_y_adjust = tile_options.tile_y_adjust || 0;


  let tiles_wide = tile_pattern.length;
  let tiles_high = tile_pattern[0].length;

  let x_start = pos_x;
  let y_start = pos_y;
  let x_offset = (radius * 3)/2;
  let y_offset = (radius * 2 * .8666);
  let x_loc, y_loc, y_adjust;


  for (let i = 0; i < tiles_wide; i++) { // tiles high is the number of rows
    x_loc = x_start + (x_offset * i) + tile_x_adjust;
  
    if (i % 2 !== 0) {  
      y_adjust = y_offset/2;
    } else {  
      y_adjust = 0;
    } 
    for (let j = 0; j < tiles_high; j++) {
      y_loc = y_start + y_adjust + (y_offset * j);

      drawHexatile(p5, x_loc, y_loc, radius, tile_pattern[i][j], color_theme, tile_options, useGradient);
    }
  }
  };

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

const getTileWidth = (tile_shape, r, tile_x_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2 * 0.8666) + tile_x_adjust : (r * 2) + tile_x_adjust;
};

const getTileHeight = (tile_shape, r, tile_y_adjust = 0) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? (r * 2) + tile_y_adjust : (r * 2 * 0.8666) + tile_y_adjust;
};

const getTileXOffset = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? r * 0.8666 : r / 2;
};

const getTileYOffset = (tile_shape, r) => {
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  return isPointyTop ? r / 2 : r * 0.8666;
};

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

const getMosaicsWide = (p5, mosaic_width, tile_x_offset) => {
  return Math.round(p5.width / (mosaic_width - tile_x_offset)) + 1;
};

const getMosaicsHigh = (p5, mosaic_height, tile_y_offset) => {
  return Math.round(p5.height / (mosaic_height - tile_y_offset)) + 1;
};




const fillWithTiles = (p5, tile_shape, r, tile_pattern, color_theme, tile_options = {}, useGradient = false) => {
  // Determine which drawing function to use
  const isPointyTop = tile_shape === 'pointyTopHexatile';
  const drawFunction = isPointyTop ? drawMultiPointyTopHexatile : drawMultiHexatile;
  const tileFunction = isPointyTop ? tilePointyTopHexatile : tileFlatTopHexatile;
  
  tileFunction(p5, r, tile_shape, tile_pattern, color_theme, drawFunction, tile_options, useGradient);

};


const tilePointyTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  
    // Calculate tile dimensions and offsets
    const tile_width = getTileWidth(tile_shape, r);
    const tile_height = getTileHeight(tile_shape, r);
    const tile_x_offset = getTileXOffset(tile_shape, r);
    const tile_y_offset = getTileYOffset(tile_shape, r);
    
    // Get mosaic dimensions
    const tiles_in_mosaic_wide = tile_pattern.length;
    const tiles_in_mosaic_high = tile_pattern[0].length;
    
    // Calculate how many complete mosaics fit on screen
    const mosaic_width = getMosaicWidth(tile_shape, tile_width, tiles_in_mosaic_wide, tile_x_offset);
    const mosaic_height = getMosaicHeight(tile_shape, tile_height, tiles_in_mosaic_high, tile_y_offset);
    const mosaics_wide = getMosaicsWide(p5, mosaic_width, tile_x_offset);
    const mosaics_high = getMosaicsHigh(p5, mosaic_height, tile_y_offset);
  
  
  for (let i = 0; i < mosaics_wide; i++) {


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

    
    for (let j = 0; j < mosaics_high; j++) {

      //Additional tiling adjustments for pointy top tiles
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

      //Calcluate X/Y position of mosaic
      const x_loc = column_increment + mosaic_x_offset;
      const y_loc = row_increment - mosaic_y_offset;


      draw_function(p5, tile_shape, x_loc, y_loc, r, tile_pattern, color_theme, tile_options, useGradient);
    }
  }
};

const tileFlatTopHexatile = (p5, r, tile_shape, tile_pattern, color_theme, draw_function, tile_options = {}, useGradient = false) => {
  
  // Calculate tile dimensions and offsets
  const tile_width = getTileWidth(tile_shape, r);
  const tile_height = getTileHeight(tile_shape, r);
  const tile_x_offset = getTileXOffset(tile_shape, r);
  const tile_y_offset = getTileYOffset(tile_shape, r);
  
  // Get mosaic dimensions and number of tiles in mosaic
  const tiles_in_mosaic_wide = tile_pattern.length;
  const tiles_in_mosaic_high = tile_pattern[0].length;
  const mosaic_width = getMosaicWidth(tile_shape, tile_width, tiles_in_mosaic_wide, tile_x_offset);
  const mosaic_height = getMosaicHeight(tile_shape, tile_height, tiles_in_mosaic_high, tile_y_offset);

   // Calculate how many mosaics fit on screen
  const mosaics_wide = getMosaicsWide(p5, mosaic_width, tile_x_offset);
  const mosaics_high = getMosaicsHigh(p5, mosaic_height, tile_y_offset);

  for (let i = 0; i < mosaics_wide; i++) {

    // Calculate Y offset for alternating columns (for proper tessellation)
    const col_offset = (i % 2 !== 0 && tiles_in_mosaic_wide % 2) ? tile_y_offset : 0;
    const x_loc = (mosaic_width - tile_x_offset)* i;

    for (let j = 0; j < mosaics_high; j++) {

      const y_loc =  (mosaic_height * j) - tile_y_offset - col_offset;
      draw_function(p5, tile_shape, x_loc, y_loc, r, tile_pattern, color_theme, tile_options, useGradient);

    }
  }
};


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

  const setup = useCallback((p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
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



  





