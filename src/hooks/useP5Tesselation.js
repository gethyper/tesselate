import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
// Import tile pattern functions or define your pattern mapping

export const drawHexagon = (p5, centerX, centerY, radius, numSides) => { 

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

  export const drawHexatile = (p5, cX, cY, r, tile_components, color_theme) => {
    //console.log("tile_components=", tile_components);

    let vertices = [];
    let x1, y1, x2, y2, x3, y3, tri, tri_color, tri_stroke;

    for(let a = 0; a < p5.TAU; a+=p5.TAU/6){
      vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
    }
    //console.log(vertices);
    drawFlatTopHexagon(p5, cX, cY, r);
    
    for (let i = 0; i < vertices.length-1; i++) {

        tri = tile_components[i];
        tri_color = color_theme[tri['c']];  
        tri_stroke = color_theme[tri['s']];
        x1 = vertices[i][0];
        y1 = vertices[i][1];
        x2 = vertices[i+1][0];
        y2 = vertices[i+1][1];
        x3 = cX;
        y3 = cY;
        p5.fill(tri_color);

        if (tri_stroke != null) {
           p5.stroke(tri_stroke);
        }
        p5.triangle(x1, y1, x2, y2, x3, y3);
        p5.noStroke(); 
      }

    }

export const drawPointyTopHexatile = (p5, cX, cY, r, tile_components, color_theme) => {

    let vertices = [];
    let x1, y1, x2, y2, x3, y3, tri, tri_color, tri_stroke;

    for(let a = p5.TAU/12; a < p5.TAU + p5.TAU/12; a+=p5.TAU/6){
      vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
    }

    drawPointyTopHexagon(p5, cX, cY, r);


    
    for (let i = 0; i < vertices.length-1; i++) {
        
        tri = tile_components[i];
        tri_color = color_theme[tri['color'] || tri['c']];  
        tri_stroke = color_theme[tri['stroke'] || tri['s']];

        x1 = vertices[i][0];
        y1 = vertices[i][1];
        x2 = vertices[i+1][0];
        y2 = vertices[i+1][1];
        x3 = cX;
        y3 = cY;

        p5.fill(tri_color);

        if (tri_stroke != null) {
           p5.stroke(tri_stroke);
        }
        p5.triangle(x1, y1, x2, y2, x3, y3);
        p5.noStroke(); 
      }

    }
  

export const drawTri = (p5, x, y, w, h, tri_orientation, tri_color, tri_stroke=false) => {

    let x1, x2, y1, y2, x3, y3;


    if (tri_orientation === "left") {
      x1 = x;
      y1 = y+(h/2);
      x2 = x+w;
      y2 = y;
      x3 = x+w
      y3 = y+h;
    } else if (tri_orientation === "right") {
      x1 = x;
      y1 = y; 
      x2 = x+w;
      y2 = y+(h/2);
      x3 = x;
      y3 = y+h;
    } else if (tri_orientation === "up") {

      x1 = x;
      y1 = y; 
      x2 = x+(w/2);
      y2 = y-h;
      x3 = x+w;
      y3 = y;

    } else if (tri_orientation === "down") {
        x1 = x; 
        y1 = y; 
        x2 = x+(w/2); 
        y2 = y+h; 
        x3 = x+w; 
        y3 = y; 
    }

    p5.fill(tri_color);

    if (tri_stroke) {
       p5.stroke(tri_stroke);
    }

    p5.triangle(x1, y1, x2, y2, x3, y3);
    p5.noStroke(); 
}; 



export const drawMultiPointyTopHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {


  let tiles_wide = tile_pattern.length;
  let tiles_high = tile_pattern[0].length;


  let x_start = pos_x;
  let y_start = pos_y;
  let x_offset = (radius * 2 * .8666);
  let y_offset = radius * 3;
  let x_loc, y_loc, y_adjust, x_adjust;

  for (let i = 0; i < tiles_wide; i++) { // tiles high is the number of rows
    x_loc = x_start + (x_offset * i);
  
    if (i % 2 != 0) {  
      y_adjust = y_offset/2;
    } else {  
      y_adjust = 0;
    } 
    for (let j = 0; j < tiles_high; j++) {
      y_loc = y_start + y_adjust + (y_offset * j);

      drawPointyTopHexatile(p5, x_loc, y_loc, radius, tile_pattern[i][j], color_theme);
    }
  }

  /*

  for (let i = 0; i < tiles_wide; i++) { // tiles high is the number of rows
    if (i % 2 == 0) {  
      x_loc = x_start;
      y_loc = y_start + y_offset * i/2;
    } else {  
      x_loc = x_start + (x_offset/2);
      y_loc = y_start + (y_offset * i) /2;
    }
    for (let j = 0; j < tiles_high; j++) {
      x_loc += (x_offset * j);

      drawPointyTopHexatile(p5, x_loc, y_loc, radius, tile_pattern[i][j], color_theme);
    }
  }*/
};

export const drawMultiHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {


  let tiles_wide = tile_pattern.length;
  let tiles_high = tile_pattern[0].length;

  let x_start = pos_x;
  let y_start = pos_y;
  let x_offset = (radius * 3)/2;
  let y_offset = (radius * 2 * .8666);
  let x_loc, y_loc, y_adjust;

  for (let i = 0; i < tiles_wide; i++) { // tiles high is the number of rows
    x_loc = x_start + (x_offset * i);
  
    if (i % 2 != 0) {  
      y_adjust = y_offset/2;
    } else {  
      y_adjust = 0;
    } 
    for (let j = 0; j < tiles_high; j++) {
      y_loc = y_start + y_adjust + (y_offset * j);

      drawHexatile(p5, x_loc, y_loc, radius, tile_pattern[i][j], color_theme);
    }
  }
  };

  export const drawCenteredHexatile = (p5, tile_shape, r, tile_pattern, color_theme) => {

    let x_loc = 0
    let y_loc = 0;

    p5.noStroke(); 
    
    if (tile_shape === 'pointyTopHexatile') {
        drawMultiPointyTopHexatile(p5, x_loc, y_loc, r, tile_pattern, color_theme);
    } else {
        drawMultiHexatile(p5, x_loc, y_loc, r, tile_pattern, color_theme);
    }
  };




const getTileWidth = (tile_shape, r) => {
  let tile_width;
  if (tile_shape === 'pointyTopHexatile') {
    tile_width = r * 2 * .8666;
  } else {
    tile_width = r * 2;
  }
  return tile_width;
};

const getTileHeight = ( tile_shape, r) => {
  let tile_height;
  if (tile_shape === 'pointyTopHexatile') {
    tile_height = r * 2;
  } else {
    tile_height = r * 2 * .8666;
  }
  return tile_height;
};

const getTileXOffset = (tile_shape, r) => {
  let tile_x_offset;
  if (tile_shape === 'pointyTopHexatile') {
    tile_x_offset = r * .8666;
  } else {
    tile_x_offset = r/2;
  }
  return tile_x_offset;
};

const getTileYOffset = (tile_shape, r) => {
  let tile_y_offset;
  if (tile_shape === 'pointyTopHexatile') {
    tile_y_offset = r/2;
    } else {
    tile_y_offset = r * .8666;
  }
  return tile_y_offset;
};


const getMosaicWidth = (tile_width, tiles_in_mosaic_wide, tile_x_offset, options={}) => {

  //if one tile wide, then the width is the tile width
  //if two  or more tiles wide, then the width is two tiles width minus the tile x offse
  let mosaic_width;
  mosaic_width = ((tiles_in_mosaic_wide-1) * (tile_width-tile_x_offset)) + tile_width;
  return mosaic_width;
};

const getMosaicHeight = (tile_height, tiles_in_mosaic_wide, tiles_in_mosaic_high, tile_y_offset, options={}) => {

  let mosaic_height;
  if (tiles_in_mosaic_high === 1 || tiles_in_mosaic_wide === 1) {
    mosaic_height = tile_height * tiles_in_mosaic_high;
  } else {
    mosaic_height = (tiles_in_mosaic_high * tile_height) + tile_y_offset;
  }
  return mosaic_height;
};

const getMosaicsWide = (p5, mosaic_width, tile_x_offset) => {

  let mosaics_wide;
  mosaics_wide = Math.round(p5.width/(mosaic_width-tile_x_offset)) + 1;
  return mosaics_wide;
};

const getMosaicsHigh = (p5, mosaic_height, tile_y_offset) => {

  let mosaics_high;
  console.log(p5.height, mosaic_height, tile_y_offset);
  mosaics_high = Math.round(p5.height/(mosaic_height-tile_y_offset)) + 1;
  return mosaics_high;
};

const getMosaicXLocForOddRows= (mosaic_width, tile_x_offset, counter, options={}) => {
  let x_loc;
  x_loc = (mosaic_width - tile_x_offset)* counter ;
  return x_loc;
};

const getMosaicYLoc= (mosaic_height, tile_y_offset, j, y_adjust) => {

  let y_loc;
  y_loc = ((mosaic_height) * j) + y_adjust;
  return y_loc;
};

//scenarios

//flat top 1x1
//flat top 2x1
//flat top 2x2
//pointy top 1x1
//pointy top 2x1
//pointy top 2x2




  const fillWithTiles = (p5, tile_shape, r, tile_pattern, color_theme)  => {

    let tile_width, tile_height, tiles_in_mosaic_wide, tiles_in_mosaic_high, mosaic_width, mosaic_height, mosaics_wide, mosaics_high, x_offset, y_offset, x_adjust, y_adjust , tile_x_offset, tile_y_offset;
    let x_loc = 0;
    let y_loc = 0;

    let draw_fn = drawMultiHexatile;

  

    if (tile_shape === 'pointyTopHexatile') {
      draw_fn = drawMultiPointyTopHexatile;
    } 

      tile_width = getTileWidth(tile_shape, r);
      tile_height = getTileHeight(tile_shape, r);
      tile_x_offset = getTileXOffset(tile_shape, r);
      tile_y_offset = getTileYOffset(tile_shape, r);
      console.log(tile_width, tile_height);
      console.log(tile_x_offset, tile_y_offset);
      tiles_in_mosaic_wide = tile_pattern.length;
      tiles_in_mosaic_high = tile_pattern[0].length;
      console.log(tiles_in_mosaic_wide, tiles_in_mosaic_high);


      mosaic_width = getMosaicWidth(tile_width, tiles_in_mosaic_wide, tile_x_offset);
      mosaic_height = getMosaicHeight(tile_height, tiles_in_mosaic_wide, tiles_in_mosaic_high, tile_y_offset);
console.log(mosaic_width, mosaic_height);
      mosaics_wide = getMosaicsWide(p5, mosaic_width, tile_y_offset);
      mosaics_high = getMosaicsHigh(p5, mosaic_height, tile_x_offset);
      console.log(mosaics_wide, mosaics_high);
      //x_offset = tile_width/2
      //y_offset = tile_height;
    
      /*
      multi_tile_width = ((tile_pattern[0].length-1) * hex_width/2) + (tile_pattern[0].length/2 % 2 != 0 ? hex_width/2 : 0) + 185;
      multi_tile_height = ((tile_pattern[0][0].length-1) * hex_height/2) - (tile_pattern[0][0].length/2 % 2 != 0 ? hex_height : 0) +60;
      multi_tiles_wide = Math.round(p5.width/multi_tile_width) + 1;
      multi_tiles_high = Math.round(p5.height/multi_tile_height) + 1;
      x_offset = multi_tile_width;
      y_offset = multi_tile_height + hex_height*1.5;*/

    

    
    p5.noStroke(); //sets stroke default

    for (let i = 0; i < mosaics_wide; i++) {

      if (i % 2 != 0) {  
        y_adjust = tile_y_offset;
      } else {  
        y_adjust = 0;
      } 

      if (i > 0) {
        x_loc = (mosaic_width - tile_x_offset)*i ;
      } else {
        x_loc = 0;
      }

      for (let j = 0; j < mosaics_high; j++) {
        //console.log(y_adjust);
        
        //y_loc = (mosaic_height-tile_y_offset) * j;
        y_loc = (mosaic_height) * j - y_adjust;
        draw_fn(p5, x_loc, y_loc, r, tile_pattern, color_theme);
      }
    }
  };

// Global refs to track canvas state
const globalCanvasRef = { current: null };
const globalP5Ref = { current: null };
const globalParentRef = { current: null };

export function useP5Tesselation({
  tile_shape = TileDesigns['tripleHex'].tileShape,
  tile_pattern = TileDesigns['tripleHex'].tilePattern,
  color_theme = ColorThemes['basic_b'],
  r = 100,
  single_tile = false,
}) {
  const p5InstanceRef = useRef(null);
  const canvasRef = useRef(null);

  const setup = useCallback((p5, canvasParentRef) => {
    // If a canvas already exists, don't create a new one
    if (globalCanvasRef.current) {
      return;
    }

    // Store the p5 instance
    p5InstanceRef.current = p5;
    console.log('Window dimensions:', window.innerWidth, window.innerHeight);
    
    // Create canvas and store reference
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    
    // Ensure canvas fills its container
    canvas.style('width', '100%');
    canvas.style('height', '100%');
    canvas.style('display', 'block');
    
    // Manually append the canvas to the parent element
    if (canvasParentRef && canvasParentRef.current) {
      canvasParentRef.current.appendChild(canvas.elt);
    }
    
    canvasRef.current = canvas;
    globalCanvasRef.current = canvas;
    globalP5Ref.current = p5;
    globalParentRef.current = canvasParentRef?.current;
    p5.noStroke();
    
    // Handle window resize
    const handleResize = () => {
      if (globalP5Ref.current && globalCanvasRef.current) {
        console.log('Resizing canvas to:', window.innerWidth, window.innerHeight);
        globalP5Ref.current.resizeCanvas(window.innerWidth, window.innerHeight);
        globalCanvasRef.current.style('width', '100%');
        globalCanvasRef.current.style('height', '100%');
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup resize listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const draw = useCallback((p5) => {
    // Only draw if we have a valid canvas
    if (!globalCanvasRef.current) return;

    console.log('Canvas dimensions in draw:', p5.width, p5.height);
    p5.background(color_theme.bg);

    if (single_tile === true) {
      drawCenteredHexatile(p5, tile_shape, r, tile_pattern, color_theme);
    } else {
      fillWithTiles(p5, tile_shape, r, tile_pattern, color_theme);
    }
    p5.noLoop();
    p5.noStroke();
  }, [r, tile_shape, tile_pattern, color_theme, single_tile]);

  // Proper cleanup function
  const remove = useCallback(() => {
    if (globalP5Ref.current) {
      globalP5Ref.current.remove();
      globalP5Ref.current = null;
    }
    if (globalCanvasRef.current) {
      if (globalParentRef.current && globalCanvasRef.current.parentNode === globalParentRef.current) {
        globalParentRef.current.removeChild(globalCanvasRef.current);
      }
      globalCanvasRef.current = null;
      globalParentRef.current = null;
    }
    p5InstanceRef.current = null;
    canvasRef.current = null;
  }, []);

  // Simple cleanup on unmount
  useEffect(() => {
    return remove;
  }, [remove]);

  return { setup, draw, remove };
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



  





