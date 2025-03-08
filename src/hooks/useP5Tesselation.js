import { useState, useCallback, useMemo } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
// Import tile pattern functions or define your pattern mapping

const tileUtilities = {
    'drawTriangle': (p5, x, y, w, h, tri_orientation, tri_color, tri_stroke=false) => {

        let x1, x2, y1, y2, x3, y3;
    
        if (tri_orientation == "left") {
          x1 = x;
          y1 = y+(h/2);
          x2 = x+w;
          y2 = y;
          x3 = x+w
          y3 = y+h;
        } else if (tri_orientation == "right") {
          x1 = x;
          y1 = y; 
          x2 = x+w;
          y2 = y+(h/2);
          x3 = x;
          y3 = y+h;
        } else if (tri_orientation == "up") {
          x1 = x;
          y1 = y; 
          x2 = x+(w/2);
          y2 = y+h;
          x3 = x+w;
          y3 = y;
        } else if (tri_orientation == "down") {
          x1 = x;
          y1 = y; 
          x2 = x+(w/2);
          y2 = y-h;
          x3 = x+w;
          y3 = y;
        }
        p5.fill(tri_color);
        if (tri_stroke) {
            p5.stroke(tri_stroke);
        }
        p5.triangle(x1, y1, x2, y2, x3, y3);
        p5.noStroke(); 
      },

     'drawDiamondHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_components) => {

        let tri_w = tile_w/2;
        let tri_h = tile_h/Math.round(tile_components.length/2);
    
        this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
        this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
        this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "right", tile_components[2]);
        this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "left", tile_components[3]);
        this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "left", tile_components[4]);
        this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "right", tile_components[5]);
      },
    
     'drawPizzaHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_components) => {
        console.log("hi")
        let tri_w = tile_w/2;
        let tri_h = tile_h/Math.round(tile_components.length/2);
    
        this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
        this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
        this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "down", tile_components[2]);
        this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "up", tile_components[3]);
        this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "up", tile_components[4]);
        this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "down", tile_components[5]);
      },

      'drawSingleHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
        let tile_a_components = tile_components['a'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
    
        if (tile_design == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
        }
      },
    
    'drawDoubleHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
    
        let tile_a_components = tile_components['a'];
        let tile_b_components = tile_components['b'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        let tile_b_x = pos_x + tile_w/2;
        let tile_b_y = pos_y + tile_h/2;
    
        if (tile_design == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawDiamondHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
        }
      },
    
    'drawTripleHexatile':  (p5, pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
    
        let tile_a_components = tile_components['a'];
        let tile_b_components = tile_components['b'];
        let tile_c_components = tile_components['c'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        let tile_b_x = pos_x + tile_w;
        let tile_b_y = pos_y;
        let tile_c_x = pos_x + tile_w/2;
        let tile_c_y = pos_y + tile_h/2;
    
        if (tile_design == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawPizzaHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawDiamondHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawDiamondHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
        }
      },

     'drawQuadHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {

        let tile_a_components = tile_components['a'];
        let tile_b_components = tile_components['b'];
        let tile_c_components = tile_components['c'];
        let tile_d_components = tile_components['d'];
    
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        let tile_b_x = pos_x + tile_w;
        let tile_b_y = pos_y;
        let tile_c_x = pos_x + tile_w/2;
        let tile_c_y = pos_y + tile_h/2;
        let tile_d_x = pos_x + tile_w*1.5;
        let tile_d_y = pos_y + tile_h/2;
    
        if (tile_design == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawPizzaHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
            this.drawPizzaHexatile(tile_d_x, tile_d_y, tile_w, tile_h, tile_d_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawDiamondHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawDiamondHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
            this.drawDiamondHexatile(tile_d_x, tile_d_y, tile_w, tile_h, tile_d_components);
        }
      },

};

export function useP5Tesselation({
  pattern = TileDesigns['doubleHexatile'],
  color_theme = ColorThemes['basic_b'],
  tile_width = 20,
  tile_height = 20,
  single_tile = false
}) {
  const setup = useCallback((p5, canvasParentRef) => {
    // Calculate canvas size based on variant
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    
    if (single_tile === false) {
        this.drawSingleTile();
    } 
    
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.noStroke(); // sets stroke default
  }, [single_tile, tile_width, tile_height]);

  const draw = useCallback((p5) => {
    // Background color
    p5.background(color_theme.bg);
    
    // Calculate tiles needed based on variant
    const tiles_wide = Math.round(window.innerWidth/tile_width) + 1;
    const tiles_high = Math.round(window.innerHeight/tile_height) + 1;
    console.log(p5)
    if (single_tile === true) {
      //drawSingleTile(p5, 0, 0, tile_width, tile_height);


    } else {
      fillWithTiles(p5, pattern, color_theme, tile_width, tile_height);
    }
  }, [pattern, color_theme, tile_width, tile_height]);

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



  



  const fillWithTiles = useCallback((p5) => {

    this.tile_design = "diamond"
    this.tile_pattern = pattern.tilePattern;
    this.color_theme = color_theme;
    this.drawFunction = this.drawSingleHexatile;

    if (pattern.tileDesign === "pizza") {
        this.tile_design = "pizza";
    } 


    if(this.tile_pattern.length == 4) {
        this.drawFunction = this.drawQuadrupleHexatile;

    } else if (this.tile_pattern.length == 3){
        this.drawFunction = this.drawingFunctions.drawTripleHexatile;

    } else if (this.tile_pattern.length == 2){
        this.drawFunction = this.drawingFunctions.drawDoubleHexatile;
    }


    let doc_w = window.document.body.offsetWidth;
    let doc_h = window.document.body.offsetHeight;
    let x_loc = 0;
    let y_loc = 0;
    let tiles_wide = Math.round(doc_w/tile_w) + 1;
    let tiles_high = Math.round(doc_h/tile_w) + 1;

    //p5.noStroke(); //sets stroke default
    //p5.createCanvas(doc_w, doc_h);
    //p5.background(this.color_theme.bg);

    for (let j = 0; j < tiles_wide; j++) {
      for (let i = 0; i < tiles_high; i++) {
        x_loc = (tile_w * j) - (tile_w/2);
        y_loc = (tile_h * i) - (tile_h/2);
        let tiles = pattern.tiles;

            this[this.tile_design](x_loc, y_loc, tile_w, tile_h, pattern.tileDesign, pattern.tileComponents);

        //this[this.tile_design](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
        //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatiles
      }
    }

    //this[pattern.tilePattern](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
  }, [pattern, color_theme, tile_w, tile_h]);

  const drawSingleTile = useCallback((p5) => {

    this.pattern = pattern;
    this.color_theme = colors;
    this.tile_design = pattern.tileDesign;

    let doc_w = window.document.body.offsetWidth;
    let doc_h = window.document.body.offsetHeight;
    let x_loc = doc_w/2 - tile_w/2;
    let y_loc = doc_h/2 - tile_h/2;

    //p5.noStroke(); //sets stroke default
    //parent.createCanvas(doc_w, doc_h);
    //parent.background(this.color_theme.bg);

    this[this.tile_design](x_loc, y_loc, tile_w, tile_h, pattern.tileDesign, pattern.tileComponents);

  }, [pattern, color_theme, tile_w, tile_h]);



  return { setup, draw };
} 