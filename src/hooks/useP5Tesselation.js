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

export const drawHexagon3 = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = 0; a < p5.TAU; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

  export const drawHexagon2 = (p5, cX, cY, r) => {
    p5.beginShape()
    for(let a = p5.TAU/12; a < p5.TAU + p5.TAU/12; a+=p5.TAU/6){
      p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
    }
    p5.endShape(p5.CLOSE)
  }

  export const drawHexatile = (p5, cX, cY, r, tile_components, color_theme) => {


    let vertices = [];
    let x1, y1, x2, y2, x3, y3, tri, tri_color, tri_stroke;

    for(let a = 0; a < p5.TAU; a+=p5.TAU/6){
      vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
    }

    drawHexagon(p5, cX, cY, r);


    
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

    drawHexagon2(p5, cX, cY, r);


    
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


  for (let i = 0; i < tile_pattern.length; i++) {
    for (let j = 0; j < tile_pattern[i].length; j++) {
      console.log(tile_pattern[i][j])

    }
  }
  
  if (tile_pattern.length >= 1) {
      let tile_a_pattern = tile_pattern[0];
      let tile_a_x = pos_x;
      let tile_a_y = pos_y;
      drawPointyTopHexatile(p5, tile_a_x, tile_a_y, radius, tile_a_pattern, color_theme);
  }

  if (tile_pattern.length >= 2) {
      let tile_b_pattern = tile_pattern[1];
      let tile_b_x = pos_x + radius*.866*2;
      let tile_b_y = pos_y;
      drawPointyTopHexatile(p5, tile_b_x, tile_b_y, radius, tile_b_pattern, color_theme);
  }

  if (tile_pattern.length >= 3) {
      let tile_c_pattern = tile_pattern[2];
      let tile_c_x = pos_x + radius*.866;
      let tile_c_y = (pos_y + radius*1.5);
      drawPointyTopHexatile(p5, tile_c_x, tile_c_y, radius, tile_c_pattern, color_theme);
  }

  if (tile_pattern.length >= 4) {
      let tile_d_pattern = tile_pattern[3];
      let tile_d_x = pos_x + radius*.866*3;
      let tile_d_y = (pos_y + radius*1.5);
      drawPointyTopHexatile(p5, tile_d_x, tile_d_y, radius, tile_d_pattern, color_theme);
  }
};

export const drawMultiHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {

  let tiles_high = tile_pattern.length;
  let tiles_wide = tile_pattern[0].length;
  let x_start = pos_x;
  let y_start = pos_y;
  let x_offset = radius * 3; //add stroke
  let y_offset = (radius * 2 * .8666);
  let x_loc, y_loc;

  for (let i = 0; i < tiles_high; i++) { // tiles high is the number of rows
   
    if (i % 2 == 0) {  
      x_loc = x_start;
      y_loc = y_start + y_offset * i/2;
    } else {  
      //x_loc = x_start - (x_offset/2);
      x_loc = x_start + (x_offset/2);
      y_loc = y_start + (y_offset * i) /2;
    }
    

    for (let j = 0; j < tiles_wide; j++) {
      x_loc += (x_offset * j);
 
      drawHexatile(p5, x_loc, y_loc, radius, tile_pattern[i][j], color_theme);
    }
  }
  };

  export const drawCenteredHexatile = (p5, tile_shape, r, tile_pattern, color_theme) => {

    let x_loc = 0
    let y_loc = 0;

    p5.noStroke(); 
    
    if (tile_shape === 'pointyTopHexagon') {
        drawMultiPointyTopHexatile(p5, x_loc, y_loc, r, tile_pattern, color_theme);
    } else {
        drawMultiHexatile(p5, x_loc, y_loc, r, tile_pattern, color_theme);
    }
  };

  const fillWithTiles = (p5, tile_shape, r, tile_pattern, color_theme)  => {

    let multi_tiles_wide, multi_tiles_high, multi_tile_width, multi_tile_height, x_offset, y_offset;
    let x_loc = 0;
    let y_loc = 0;

    let draw_fn = drawMultiHexatile;

    if (tile_shape === 'pointyTopHexagon') {

      draw_fn = drawMultiPointyTopHexatile;/*
      multi_tile_width = r * tile_pattern[0][0].length * 2 * .8666;
      multi_tile_height = r * tile_pattern[0].length/2 * 1.5;
      sections_wide = Math.round(p5.width/((tile_width/2)*.866)) + 1;
      sections_high = Math.round(p5.height/tile_height) + 1;
      x_offset = tile_width/2;
      y_offset = tile_height;*/
    } else {

      /*  let x_offset = radius * 3 * .8666 + 4; //add stroke
  let y_offset = (radius * 1.5)+ 4;*/

      multi_tile_width = tile_pattern[0][0].length * r;
      multi_tile_height = r * tile_pattern[0].length * 2 * .8666;
      console.log(p5.width, p5.height)

      multi_tiles_wide = Math.round(p5.width/multi_tile_width) + 1;
      multi_tiles_high = Math.round(p5.height/((multi_tile_height/2)*.866)) + 1;
      x_offset = multi_tile_width /2;
      y_offset = multi_tile_height /2;



      //x_loc = x_loc - tile_width/2;
      //y_loc = y_loc - tile_height/2;
    }

    
    p5.noStroke(); //sets stroke default

    for (let j = 0; j < multi_tiles_wide; j++) {
      y_loc = (y_offset * j); 
      //console.log(y_loc);//- (r/2);
      for (let i = 0; i < multi_tiles_high; i++) {
        x_loc = (multi_tile_width * i); 
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



  





