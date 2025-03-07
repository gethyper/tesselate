import { useCallback } from 'react';

// Import tile pattern functions or define your pattern mapping

const drawingFunctions = {

  'drawDiamondHexatile': (pos_x, pos_y, tile_w, tile_h, tile_components) => {

    let tri_w = tile_w/2;
    let tri_h = tile_h/Math.round(tile_components.length/2);

    this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
    this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
    this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "right", tile_components[2]);
    this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "left", tile_components[3]);
    this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "left", tile_components[4]);
    this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "right", tile_components[5]);
},

'drawPizzaHexatile'(pos_x, pos_y, tile_w, tile_h, tile_components) {

    let tri_w = tile_w/2;
    let tri_h = tile_h/Math.round(tile_components.length/2);

    this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
    this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
    this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "down", tile_components[2]);
    this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "up", tile_components[3]);
    this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "up", tile_components[4]);
    this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "down", tile_components[5]);
}, 

'drawDoubleHexatile': (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {


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

  'drawTripleHexatile': (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {

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

  'drawQuadHexatile': (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {

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

  'fillWithTiles': (pattern, colors, tile_w, tile_h) => {

    this.pattern = pattern;
    this.color_theme = colors;
    this.tile_design = pattern.tileDesign;

    if(pattern.tileDesign.length == 3) {

    } else if (pattern.tileDesign.length == 2){

    } else {
      pattern.tileDesign == 1
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
  },

  'drawSingleTile': (pattern, colors, tile_w, tile_h) => {

    this.pattern = pattern;
    this.color_theme = colors;
    this.tile_design = pattern.tileDesign;

    let doc_w = window.document.body.offsetWidth;
    let doc_h = window.document.body.offsetHeight;
    let x_loc = doc_w/2 - tile_w/2;
    let y_loc = doc_h/2 - tile_h/2;

    noStroke(); //sets stroke default
    createCanvas(doc_w, doc_h);
    background(this.color_theme.bg);

    this[this.tile_design](x_loc, y_loc, tile_w, tile_h, pattern.tileDesign, pattern.tileComponents);

  },

  'drawTriangle': (x, y, w, h, tri_orientation, tri_style) => {

    let x1,x2, y1, y2, x3, y3;

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

    if(typeof tri_style === "string"){
      fill(this.color_theme[tri_style]); 
    } else {
      //add forEach
      fill(this.color_theme[tri_style.color]); 
      if(this.color_theme[tri_style.stroke]) {
        //this.drawStroke(this.color_theme[tri_style.stroke], x1, y1, x2, y2, x3);
        stroke(this.color_theme[tri_style.stroke]);
        
     }
    }
    p5.triangle(x1, y1, x2, y2, x3, y3);
    p5.noStroke(); 
  }
};

export function useP5Tesselation({
  pattern = { tileDesign: 'drawPizzaHexatile', tileComponents: [] },
  color_theme = { bg: '#ffffff', primary: '#000000' },
  tile_width = 20,
  tile_height = 20,
  single_tile = false
}) {
  const setup = useCallback((p5, canvasParentRef) => {
    // Calculate canvas size based on variant
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    
    if (single_tile === false) {
      
    } 
    
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.noStroke(); // sets stroke default
  }, [variant, tile_width, tile_height]);

  const draw = useCallback((p5) => {
    // Background color
    p5.background(color_theme.bg);
    
    // Calculate tiles needed based on variant
    const tiles_wide = variant === 'single' ? 1 : 
                      variant === 'centered' ? 3 : 
                      Math.round(window.innerWidth/tile_width) + 1;
    
    const tiles_high = variant === 'single' ? 1 : 
                      variant === 'centered' ? 3 : 
                      Math.round(window.innerHeight/tile_height) + 1;
    
    // Draw the appropriate pattern
    if (variant === 'single') {
      // Draw a single tile
      drawTile(p5, 0, 0, tile_width, tile_height);
    } else if (variant === 'centered') {
      // Draw centered pattern
      for (let j = 0; j < tiles_high; j++) {
        for (let i = 0; i < tiles_wide; i++) {
          drawTile(p5, i * tile_width, j * tile_height, tile_width, tile_height);
        }
      }
    } else { // 'full'
      // Fill screen with tiles
      for (let j = 0; j < tiles_high; j++) {
        for (let i = 0; i < tiles_wide; i++) {
          const x_loc = (tile_width * i) - (tile_width/2);
          const y_loc = (tile_height * j) - (tile_height/2);
          drawTile(p5, x_loc, y_loc, tile_width, tile_height);
        }
      }
    }
  }, [pattern, color_theme, tile_width, tile_height, variant]);

  // Helper function to draw a single tile
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
  };

  return { setup, draw };
} 