import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
        //p5.vertex(cX + r * p5.cos(a), cY + r * p5.sin(a))
        vertices.push([cX + r * p5.cos(a), cY + r * p5.sin(a)]);
    }

    //drawHexagon(p5, cX, cY, r);


    
    for (let i = 0; i < vertices.length-1; i++) {
        
        tri = tile_components[i];
        tri_color = color_theme[tri['color']];  
        tri_stroke = color_theme[tri['stroke']];

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
        tri_color = color_theme[tri['color']];  
        tri_stroke = color_theme[tri['stroke']];

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



export const drawMultHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {

    if (tile_pattern.length >= 1) {
        let tile_a_pattern = tile_pattern[0];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        drawHexatile(p5, tile_a_x, tile_a_y, radius, tile_a_pattern, color_theme);
    }

    if (tile_pattern.length >= 2) {
        let tile_b_pattern = tile_pattern[1];
        let tile_b_x = pos_x + radius*.866*2;
        let tile_b_y = pos_y;
        drawHexatile(p5, tile_b_x, tile_b_y, radius, tile_b_pattern, color_theme);
    }

    if (tile_pattern.length >= 3) {
        let tile_c_pattern = tile_pattern[2];
        let tile_c_x = pos_x + radius*.866;
        let tile_c_y = (pos_y + radius*1.5);
        drawHexatile(p5, tile_c_x, tile_c_y, radius, tile_c_pattern, color_theme);
    }

    if (tile_pattern.length >= 4) {
        let tile_d_pattern = tile_pattern[3];
        let tile_d_x = pos_x + radius*.866*3;
        let tile_d_y = (pos_y + radius*1.5);
        drawHexatile(p5, tile_d_x, tile_d_y, radius, tile_d_pattern, color_theme);
    }

  };

export const drawHexatileOld = (p5, pos_x, pos_y, tile_w, tile_h, tile_shape, tile_pattern, color_theme) => {

    let tri_w, tri_h;

   
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

export const drawMultiPointyTopHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {


  for (let i = 0; i < tile_pattern.length; i++) {
    for (let j = 0; j < tile_pattern[i].length; j++) {
      console.log(tile_pattern[i][j])
    }
  }
/*
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
    }*/

  };

export const drawMultiHexatile = (p5, pos_x, pos_y, radius, tile_pattern, color_theme) => {

  let x_loc = pos_x;
  let y_loc = pos_y;
  let x_offset = radius * tile_pattern[0].length * 2 * .8666;
  let y_offset = radius * tile_pattern.length/2 * 1.5;


  for (let j = 0; j < sections_high; j++) {
    y_loc = (y_offset * j); 
    console.log(y_loc);//- (r/2);
    for (let i = 0; i < sections_wide; i++) {
      x_loc = (x_offset * i); //- (r/2);
      drawHexatile(p5, x_loc, y_loc, r, tile_pattern, color_theme);
    }
  }

  //drawHexatile(p5, tile_d_x, tile_d_y, radius, tile_d_pattern, color_theme);
  /*

    if (tile_pattern.length >= 1) {
        let tile_a_pattern = tile_pattern[0];
        let tile_a_x = pos_x;
        let tile_a_y = pos_y;
        drawHexatile(p5, tile_a_x, tile_a_y, radius, tile_a_pattern, color_theme);
    }

    if (tile_pattern.length >= 2) {
        let tile_b_pattern = tile_pattern[1];
        let tile_b_x = pos_x + radius * 1.5;   
        let tile_b_y = pos_y + radius * .866;
        console.log(p5.cos("30"))
        drawHexatile(p5, tile_b_x, tile_b_y, radius, tile_b_pattern, color_theme);
    }

    if (tile_pattern.length >= 3) {
        let tile_c_pattern = tile_pattern[2];
        let tile_c_x = pos_x;
        let tile_c_y = pos_y + radius * 2 * .866
        drawHexatile(p5, tile_c_x, tile_c_y, radius, tile_c_pattern, color_theme);
    }

    if (tile_pattern.length >= 4) {
        let tile_d_pattern = tile_pattern[3];
        let tile_d_x = pos_x + radius * 1.5;   
        let tile_d_y = pos_y + radius*.866*3
        drawHexatile(p5, tile_d_x, tile_d_y, radius, tile_d_pattern, color_theme);
    }
  */
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

    let section_width, section_height, sections_wide, sections_high, x_offset, y_offset;
    let x_loc = 0;
    let y_loc = 0;
    let draw_fn = drawMultiHexatile;

    if (tile_shape === 'pointyTopHexagon') {

      draw_fn = drawMultiPointyTopHexatile;
      section_width = r * tile_pattern[0].length * 2 * .8666;
      section_height = r * tile_pattern.length/2 * 1.5;
      sections_wide = Math.round(p5.width/((tile_width/2)*.866)) + 1;
      sections_high = Math.round(p5.height/tile_height) + 1;
      x_offset = tile_width/2;
      y_offset = tile_height;
    } else {
      section_width = r * tile_pattern[0].length/2 * 1.5;
      section_height = r * tile_pattern.length * 2 * .8666;

      sections_wide = Math.round(p5.width/tile_width) + 1;
      sections_high = Math.round(p5.height/((tile_height/2)*.866)) + 1;
      x_offset = tile_width;
      y_offset = tile_height/2;


      //x_loc = x_loc - tile_width/2;
      //y_loc = y_loc - tile_height/2;
    }

    
    p5.noStroke(); //sets stroke default

    for (let j = 0; j < sections_high; j++) {
      y_loc = (y_offset * j); 
      console.log(y_loc);//- (r/2);
      for (let i = 0; i < sections_wide; i++) {
        x_loc = (x_offset * i); //- (r/2);
        draw_fn(p5, x_loc, y_loc, r, tile_pattern, color_theme);
      }
    }
  };

export function useP5Tesselation({
  tile_shape = TileDesigns['test'].tileShape,
  tile_pattern = TileDesigns['test'].tilePattern,
  color_theme = ColorThemes['basic_b'],
  r = 100,
  single_tile = false,
}) {

  const p5InstanceRef = useRef(null);  

  const setup = useCallback((p5, canvasParentRef) => {
    // Calculate canvas size based on variant
    setTimeout(() => {
        if (canvasParentRef.getElementsByTagName('canvas').length === 0) {
            let canvasWidth = window.innerWidth;
            let canvasHeight = window.innerHeight;
            p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
            p5.noStroke();
        }
    }, 10);


  }, [tile_pattern, color_theme, single_tile]);

  const draw = useCallback((p5) => {

   
    p5.background(color_theme.bg);

    if (single_tile == true) {
       drawCenteredHexatile(p5, tile_shape, r, tile_pattern, color_theme);

    } else {
        fillWithTiles(p5, tile_shape, r, tile_pattern, color_theme);

    }
    p5.noLoop();
    p5.noStroke(); // sets stroke default
        //this[this.tile_shape](tile_w, tile_h, pattern.tileDesign, pattern.tileComponents, pattern.tileColumns, x_loc, y_loc);
        //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatil}
  }, [r, tile_shape, tile_pattern, color_theme, single_tile]);


  const windowResized = useCallback((p5, canvasParentRef) => {
    console.log("resized")
    p5.remove();
    //setup();

  }, [r, tile_pattern, color_theme, single_tile]);

  // Add a proper cleanup function
  const remove = useCallback(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
  }, []);
  
  // Cleanup on unmount or dependencies change
  useEffect(() => {
    return () => {
      remove();
    };
  }, [remove]);

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



  





