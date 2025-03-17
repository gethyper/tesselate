import { useState, useCallback, useMemo } from 'react';
import TileDesigns from '../components/TileDesigns';
import ColorThemes  from '../components/ColorThemes';
// Import tile pattern functions or define your pattern mapping

/*
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

      'drawSingleHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_components) => {
        let tile_a_components = tile_components['a'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
    
        if (tile_shape == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
        }
      },
    
    'drawDoubleHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_components) => {
    
        let tile_a_components = tile_components['a'];
        let tile_b_components = tile_components['b'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        let tile_b_x = pos_x + tile_w/2;
        let tile_b_y = pos_y + tile_h/2;
    
        if (tile_shape == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawDiamondHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
        }
      },
    
    'drawTripleHexatile':  (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_components) => {
    
        let tile_a_components = tile_components['a'];
        let tile_b_components = tile_components['b'];
        let tile_c_components = tile_components['c'];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        let tile_b_x = pos_x + tile_w;
        let tile_b_y = pos_y;
        let tile_c_x = pos_x + tile_w/2;
        let tile_c_y = pos_y + tile_h/2;
    
        if (tile_shape == "pizza") {
            this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawPizzaHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
        } else {
            this.drawDiamondHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
            this.drawDiamondHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
            this.drawDiamondHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
        }
      },

     'drawQuadHexatile': (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_components) => {

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
    
        if (tile_shape == "pizza") {
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

      'drawSingleTile': (p5, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

        //this.pattern = pattern;
        //this.color_theme = colors;
        //this.tile_shape = pattern.tileDesign;
        //console.log(this)
        let x_loc = p5.width/2 - tile_w/2;
        let y_loc = p5.height/2 - tile_h/2;
        //let tile_fn = tile_shape == ("diamond") ? this.drawDiamondHexatile : this.drawPizzaHexatile;
        
    
        p5.noStroke(); 
    
        this.drawSingleHexatile(x_loc, y_loc, tile_w, tile_h, tile_pattern, color_theme);
    },

      'fillWithTiles': (p5, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {
        //this.pattern = pattern;
        //this.color_theme = colors;
        //this.tile_shape = pattern.tileDesign;

        let x_loc = 0;
        let y_loc = 0;
        let tiles_wide = 1;
        let tiles_high = 1;
        let tile_fn = this.drawSingleHexatile;
    
        if (tile_pattern.length == 4) {
            tile_fn = this.drawQuadHexatile
        } else if (tile_pattern.tileComponents.length == 3){
            tile_fn = this.drawTripleHexatile
        } else if  (tile_pattern.tileComponents.length == 2){
            tile_fn = this.drawDoubleHexatile
        } 
    
        tiles_wide = Math.round(p5.width/tile_w) + 1;
        tiles_high = Math.round(p5.height/tile_w) + 1;
    
        p5.noStroke(); //sets stroke default
        //createCanvas(doc_w, doc_h);
        //background(this.color_theme.bg);
    
        for (let j = 0; j < tiles_wide; j++) {
          for (let i = 0; i < tiles_high; i++) {
            x_loc = (tile_w * j) - (tile_w/2);
            y_loc = (tile_h * i) - (tile_h/2);
            let tiles = tile_pattern;
    
            this[this.tile_shape](x_loc, y_loc, tile_w, tile_h, tiles, color_theme);
    
            //this[this.tile_shape](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
            //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatiles
          }
        }
      }
*/
/*
export const drawTri = (p5, x, y, w, h, tri_orientation, tri_color, tri_stroke=false) => {

    let x1, x2, y1, y2, x3, y3;

    console.log(tri_orientation)

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
      y2 = y+h;
      x3 = x+w;
      y3 = y;
    } else if (tri_orientation === "down") {
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
}; */

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

    /*console.log("x1="+x1)
    console.log("y1="+y1)
    console.log("x2="+x2)
    console.log("y2="+y2)
    console.log("x3="+x3)
    console.log("y3="+y3)
    console.log("--------")*/
    p5.triangle(x1, y1, x2, y2, x3, y3);
    p5.noStroke(); 
}; 

export const drawHexatile = (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

    let tri_w, tri_h;

    //let tri_h = tile_h/2;
    //let tri_w = /*tile_w/2;*/ tile_w/Math.round(tile_pattern.width/2);
    //let tri_h = tile_h/Math.round(tile_pattern.length/2);

    //console.log(color_theme[tile_pattern[0]['stroke']])
   
    if (tile_shape === 'flatTopHexagon') {

        tri_w = tile_w/2;
        tri_h = tile_h/2;

        //tri_w = tile_w/2;
        //tri_h = tile_h/Math.round(tile_pattern.length/2);
        drawTri(p5, pos_x, pos_y, tri_w, tri_h, "up", color_theme[tile_pattern[0]['color']], color_theme[tile_pattern[0]['stroke']]);
        drawTri(p5, pos_x + tri_w/2, pos_y-tri_h, tri_w, tri_h, "down", color_theme[tile_pattern[1]['color']], color_theme[tile_pattern[1]['stroke']]);
        drawTri(p5, pos_x + tri_w, pos_y, tri_w, tri_h, "up", color_theme[tile_pattern[1]['color']], color_theme[tile_pattern[2]['stroke']]);
        drawTri(p5, pos_x, pos_y, tri_w, tri_h, "down", color_theme[tile_pattern[2]['color']], color_theme[tile_pattern[3]['stroke']]);
        drawTri(p5, pos_x + tri_w/2, pos_y+tri_h, tri_w, tri_h, "up", color_theme[tile_pattern[3]['color']], color_theme[tile_pattern[4]['stroke']]);
        drawTri(p5, pos_x + tri_w, pos_y, tri_w, tri_h, "down", color_theme[tile_pattern[5]['color']], color_theme[tile_pattern[5]['stroke']]);

   } else if (tile_shape === 'pointyTopHexagon') {

        //let tri_w = /*tile_w/2;*/ tile_w/Math.round(tile_pattern.width/2);

        
        tri_w = tile_w/2 * .866;
        tri_h = tile_h/2 
    //let tri_h = tile_h/Math.round(tile_pattern.length/2);

        drawTri(p5, pos_x, pos_y, tri_w, tri_h, "left", color_theme[tile_pattern[0]['color']], color_theme[tile_pattern[0]['stroke']]);
        drawTri(p5, pos_x + tri_w, pos_y, tri_w, tri_h, "right", color_theme[tile_pattern[1]['color']], color_theme[tile_pattern[1]['stroke']]);
        drawTri(p5, pos_x, pos_y+(tri_h/2), tri_w, tri_h, "right", color_theme[tile_pattern[2]['color']], color_theme[tile_pattern[2]['stroke']]);
        drawTri(p5, pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "left", color_theme[tile_pattern[3]['color']], color_theme[tile_pattern[3]['stroke']]);
        drawTri(p5, pos_x, pos_y+(tri_h), tri_w, tri_h, "left", color_theme[tile_pattern[4]['color']], color_theme[tile_pattern[4]['stroke']]);
        drawTri(p5, pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "right", color_theme[tile_pattern[5]['color']], color_theme[tile_pattern[5]['stroke']]);
   }

};

export const drawMultiPointyTopHexatile = (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

    console.log(tile_pattern)

    if (tile_pattern.length >= 1) {
        let tile_a_pattern = tile_pattern[0];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        drawHexatile(p5, tile_a_x, tile_a_y, tile_w, tile_h, tile_shape, tile_a_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 2) {
        let tile_b_pattern = tile_pattern[1];
        let tile_b_x = pos_x + tile_w;
        let tile_b_y = pos_y;
        drawHexatile(p5, tile_b_x, tile_b_y, tile_w, tile_h, tile_shape, tile_b_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 3) {
        let tile_c_pattern = tile_pattern[2];
        let tile_c_x = pos_x + tile_w/2;
        let tile_c_y = (pos_y + tile_h) - tile_h/4;
        drawHexatile(p5, tile_c_x, tile_c_y, tile_w, tile_h, tile_shape, tile_c_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 4) {
        let tile_d_pattern = tile_pattern[3];
        let tile_d_x = pos_x + tile_w * 1.5;
        let tile_d_y = (pos_y + tile_h) - tile_h/4;
        drawHexatile(p5, tile_d_x, tile_d_y, tile_w, tile_h, tile_shape, tile_d_pattern, color_theme);
        console.log("===========");
    }

  };

export const drawMultiHexatile = (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {
    console.log(tile_h, tile_w)

    if (tile_pattern.length >= 1) {
        let tile_a_pattern = tile_pattern[0];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        console.log("tile_pos_x="+tile_a_x);
        drawHexatile(p5, tile_a_x, tile_a_y, tile_w, tile_h, tile_shape, tile_a_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 2) {
        let tile_b_pattern = tile_pattern[1];
        let tile_b_x = pos_x + tile_w - (tile_w/4);    
        let tile_b_y = pos_y + tile_h/2;
        console.log("tile_pos_x="+tile_b_x);
        drawHexatile(p5, tile_b_x, tile_b_y, tile_w, tile_h, tile_shape, tile_b_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 3) {
        let tile_c_pattern = tile_pattern[2];
        let tile_c_x = pos_x;
        let tile_c_y = pos_y + tile_h;
        console.log("tile_pos_x="+tile_c_x);
        drawHexatile(p5, tile_c_x, tile_c_y, tile_w, tile_h, tile_shape, tile_c_pattern, color_theme);
        console.log("===========");
    }

    if (tile_pattern.length >= 4) {
        let tile_d_pattern = tile_pattern[3];
        let tile_d_x = pos_x + tile_w - (tile_w/4);
        let tile_d_y = pos_y + tile_h* 1.5;
        console.log("tile_pos_x="+tile_d_x);
        drawHexatile(p5, tile_d_x, tile_d_y, tile_w, tile_h, tile_shape, tile_d_pattern, color_theme);
        console.log("===========");
    }

  };

  export const drawCenteredHexatile = (p5, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

    let x_loc = p5.width/2 - tile_w/2;
    let y_loc = p5.height/2 - tile_h/2;

    p5.noStroke(); 
    console.log(tile_shape)
    if (tile_shape === 'pointyTopHexagon') {
        drawMultiPointyTopHexatile(p5, x_loc, y_loc, tile_w, tile_h, tile_shape, tile_pattern, color_theme);
    } else {
        drawMultiHexatile(p5, x_loc, y_loc, tile_w, tile_h, tile_shape, tile_pattern, color_theme);
    }
  };

  const fillWithTiles = (p5, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

    let x_loc = 0;
    let y_loc = 0;
    let tiles_wide = Math.round(p5.width/tile_w) + 1;
    let tiles_high = Math.round(p5.height/tile_w) + 1;
    
    
    p5.noStroke(); //sets stroke default

    for (let j = 0; j < tiles_wide; j++) {
      for (let i = 0; i < tiles_high; i++) {
        x_loc = (tile_w * j) - (tile_w/2);
        y_loc = (tile_h * i) - (tile_h/2);
        let tiles = tile_pattern;

        drawMultiHexatile(p5, x_loc, y_loc, tile_w, tile_h, tile_shape, tile_pattern, color_theme);

        //this[this.tile_shape](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
        //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatiles
      }
    }


  };

export function useP5Tesselation({
  tile_shape = TileDesigns['test'].tileShape,
  tile_pattern = TileDesigns['test'].tilePattern,
  color_theme = ColorThemes['basic_b'],
  tile_size = 100,
  single_tile = true,
}) {

    
  const setup = useCallback((p5, canvasParentRef) => {
    // Calculate canvas size based on variant
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    p5.noLoop();
    p5.noStroke(); // sets stroke default
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);

  }, [tile_size, tile_pattern, color_theme, single_tile]);

  const draw = useCallback((p5) => {


    let tile_width, tile_height;

    if (tile_shape == "pointyTopHexagon") {
        tile_height = (tile_size * .866);
        tile_width = tile_size;   
        
        
    } else if (tile_shape == "flatTopHexagon") {
        tile_height = tile_size;
        tile_width = (tile_size * .866);

        tile_height = (tile_size * .866);
        tile_width = tile_size;  
    }

    const tiles_wide = Math.round(window.innerWidth/tile_width) + 1;
    const tiles_high = Math.round(window.innerHeight/tile_height) + 1;
   
    p5.background(color_theme.bg);

    if (single_tile == true) {
       drawCenteredHexatile(p5, tile_width, tile_height, tile_shape, tile_pattern, color_theme);
       
       //drawTri(p5, 50, 50, 100, 100, "up", "#fff") 

    } else {
        //fillWithTiles(p5, tile_width, tile_height, tile_shape, tile_pattern, color_theme);
        
    }

        //this[this.tile_shape](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
        //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatil}
  }, [tile_size, tile_shape, tile_pattern, color_theme, single_tile]);


  const windowResized = useCallback((p5, canvasParentRef) => {
    p5.remove();
    //setup();

  }, [tile_size, tile_pattern, color_theme, single_tile]);

  const remove = useCallback((p5) => {
    p5.remove(); // This properly cleans up the p5 instance
  }, []);
   return { setup, draw, remove };
  };

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



  





