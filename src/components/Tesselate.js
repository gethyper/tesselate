//const animation_themes = {};
const Tesselate = ({ t_pattern, t_design, c_theme }) => {

    const color_theme = {};
    const pattern = {};
    const tile_design = {};
    const tiles_wide = 1;
    const tiles_high = 1;

    const setup = (p5, canvasParentRef) => {
       // p5.createCanvas(600, 400).parent(canvasParentRef);
    };

    const draw = (p5) => {
        //p5.background(backgroundColor);
        
        // Draw a moving circle
        //p5.fill(255);
        //p5.ellipse(x, p5.height / 2, 50, 50);
        
        // Update position
        //x = (x + speed) % p5.width;
        //if (x < 0) x = p5.width;
      };
    
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Sketch setup={setup} draw={draw} />
        </Box>
      );
    }
  
    const fillWithTiles = ( pattern, colors, tile_w, tile_h ) => {
  
      this.pattern = pattern;
      this.color_theme = colors;
      this.tile_design = pattern.tileDesign;
  
      if(pattern.tileComponents.length == 3) {
  
      } else if (pattern.tileComponents.length == 2){
  
      } else {
        pattern.tileComponents_length == 1
      }
  
  
      let doc_w = window.document.body.offsetWidth;
      let doc_h = window.document.body.offsetHeight;
      let x_loc = 0;
      let y_loc = 0;
      let tiles_wide = Math.round(doc_w/tile_w) + 1;
      let tiles_high = Math.round(doc_h/tile_w) + 1;
  
      noStroke(); //sets stroke default
      createCanvas(doc_w, doc_h);
      background(this.color_theme.bg);
  
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
    }
  
  
    const drawCenteredTile = (pattern, colors, tile_w, tile_h) => {
  
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
  
    }
  
    const drawRhomboidHexatile = () => {}
  
  
    const getTilesWide = (tile_w) => {
      return Math.round(window.document.body.offsetWidth/tile_w) + 1;
    }
  
    const getTilesHigh = (tile_h, is_offset=true) => {
      return Math.round(window.document.body.offsetHeight/ (tile_h/2) + 1);
    }
  
  
    const tileHexatiles = (x, y, tri_h, tri_w, pattern, colors) => {
  
      //let tiles_wide = Math.round(doc_w/tri_w) + 1;
      //let tiles_high = Math.round(doc_h/tri_h) + 1;
  
      let tile_design = pattern.tileDesign;
      let tile_columns = pattern.tileColumns;
      let tile_rows = pattern.tileRows;
      let tile = pattern.Tiles
      let tile_w = tile_columns*tri_w; //pattern
      let tile_h = tile_rows*tri_h; //pattern
  
  
      this.color_theme = colors;
  
      createCanvas(doc_w, doc_h);
      background(this.color_theme.bg);
  
      this[pattern.tilePattern]();
    };
  
  
    const regularTilingHexatile = () => {
      for (let j = 0; j < 1; j++) {
        for (let i = 0; i < tiles_wide; i++) {
          let x1 = ((tile_w * i)-offset_x);
          let x2 = (tile_w * i-(tile_w/2)+offset_x);
          let y1 = tile_h * j;
          let y2 = (tile_h * j-(tile_h/2));
          let tiles = pattern.tiles;
  
          this[pattern.tileDesign](x1, y1, tri_h, tri_w, tiles, tile_columns);
          this[pattern.tileDesign](x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatiles
        }
      }
    };
  
    const regularTilingGrid = (x, y, tile_w, tile_h, tiles, tile_columns) => {
      for (let j = 0; j < 1; j++) {
        for (let i = 0; i < tiles_wide; i++) {
          let x1 = ((tile_w * i)-offset_x);
          let x2 = (tile_w * i-(tile_w/2)+offset_x);
          let y1 = tile_h * j;
          let y2 = (tile_h * j-(tile_h/2));
          let tiles = pattern.tiles;
  
          this[pattern.tileDesign](tiles. x1, y1, tri_h, tri_w, tiles, tile_columns);
          //this[pattern.tileDesign](tiles, x2, y2, tri_h, tri_w, tiles, tile_columns); //TODO: Add alternating Hexatiles
        }
      }
    };
  
  
    const regularTilingDiamond = (tile_w, tile_h, tile_design, tile_components, tile_columns, pos_x, pos_y) => {
  
      let row, row_x, row_y, tile_x;
      let row_offset_x = tile_w/2;
      let row_offset_y = tile_h/2;
      let tiles_wide = this.getTilesWide(tile_w);
      let tiles_high = this.getTilesHigh(tile_h);
  
      for (let j = 0; j < tiles_high; j++) {
  
        row_x = pos_x;
        row_y = pos_y + (tile_h/2 * j) - row_offset_y;
  
        if(j % 2 == 0) {
          row_x = row_x - row_offset_x;
        } 
  
        for (let i = 0; i < tiles_wide; i++) {
          tile_x = row_x + (tile_w * i);
          this[tile_design](tile_w, tile_h, tile_design, tile_components, tile_columns, tile_x, row_y);
        }
      }
    }
  
    const drawDiamondTriangleTile = (tile_w, tile_h, tile_design, tile_components, tile_columns, pos_x, pos_y) => {
  
      let row, row_x, row_y, row_offset_x, tri_offset_x, tri_style, tri_orientation;
      let tri_w = tile_w/tile_columns;
      let tri_h = tile_h/Math.round(tile_components.length/2);
  
  
      for (let j = 0; j < tile_components.length; j++) {
  
        row = tile_components[j]; //reverse can have cool effects
        row_offset_x = (tile_columns-row.length) * tri_w/2;
        row_x = pos_x;
        row_y = pos_y + (tri_h/2*j);
  
        for (let i = 0; i < row.length; i++) {
  
          tri_style = row[i];
          tri_offset_x = row_offset_x + (i*tri_w);
          
          if(i % 2 == 0) {
            tri_orientation = "left";
          } else {
            tri_orientation = "right";
          }
  
          this.drawHorizontalTri(row_x + tri_offset_x, row_y, tri_w, tri_h, tri_orientation, tri_style);
        }
      }
    }
  
  
    const drawAlternatingPizzaHexatile = (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
  
  
      let tile_a_components = tile_components['a'];
      let tile_b_components = tile_components['b'];
      let tile_a_x = pos_x;
      let tile_a_y = pos_y;
      let tile_b_x = pos_x + tile_w/2;
      let tile_b_y = pos_y + tile_h/2;
  
      this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
      this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
    }
  
    const drawTripleHexatile = (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
  
      let tile_a_components = tile_components['a'];
      let tile_b_components = tile_components['b'];
      let tile_c_components = tile_components['c'];
      let tile_a_x = pos_x;
      let tile_a_y = pos_y;
      let tile_b_x = pos_x + tile_w;
      let tile_b_y = pos_y;
      let tile_c_x = pos_x + tile_w/2;
      let tile_c_y = pos_y + tile_h/2;
  
      this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
      this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
      this.drawPizzaHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
    }
  
    const drawQuadHexatile = (pos_x, pos_y, tile_w, tile_h, tile_design, tile_components) => {
  
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
  
  
      this.drawPizzaHexatile(tile_a_x, tile_a_y, tile_w, tile_h, tile_a_components);
      this.drawPizzaHexatile(tile_b_x, tile_b_y, tile_w, tile_h, tile_b_components);
      this.drawPizzaHexatile(tile_c_x, tile_c_y, tile_w, tile_h, tile_c_components);
      this.drawPizzaHexatile(tile_d_x, tile_d_y, tile_w, tile_h, tile_d_components);
    }
  
   const drawChamferedHexatile = (tile_w, tile_h, tile_design, tile_components, tile_columns, pos_x, pos_y) => {
      
      let tile_a_components = tile_components.a;
      let tile_b_components = tile_components.b;
      let tile_a_x = pos_x;
      let tile_a_y = pos_y;
      let tile_b_x = pos_x + tile_w;
      let tile_b_y = pos_y;
      let tile_c_x = pos_x + tile_w/2;
      let tile_c_y = pos_y + tile_h/2;
      let tile_d_x = pos_x;
      let tile_d_y = pos_y + tile_h2;
  
  
      this[tile_design](tile_a_x, tile_a_y, tile_design, tile_components.a, tile_columns, pos_x, pos_y);
      this[tile_design](tile_b_x, tile_b_y, tile_design, tile_components.b, tile_columns, pos_x, pos_y);
      this[tile_design](tile_c_x, tile_c_y, tile_design, tile_components.b, tile_columns, pos_x, pos_y);
      this[tile_design](tile_d_x, tile_d_y, tile_design, tile_components.b, tile_columns, pos_x, pos_y);
  
    }
  
  
    const drawDiamondHexatile = (pos_x, pos_y, tile_w, tile_h, tile_components) => {
  
  
  
      let tri_w = tile_w/2;
      let tri_h = tile_h/Math.round(tile_components.length/2);
  
      this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
      this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
      this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "right", tile_components[2]);
      this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "left", tile_components[3]);
      this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "left", tile_components[4]);
      this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "right", tile_components[5]);
  }
  
  
    const drawPizzaHexatile = (pos_x, pos_y, tile_w, tile_h, tile_components) => {
  
  
  
      let tri_w = tile_w/2;
      let tri_h = tile_h/Math.round(tile_components.length/2);
  
      this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
      this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[1]);
      this.drawTri(pos_x, pos_y+(tri_h/2), tri_w, tri_h, "down", tile_components[2]);
      this.drawTri(pos_x + tri_w, pos_y+(tri_h/2), tri_w, tri_h, "up", tile_components[3]);
      this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "up", tile_components[4]);
      this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "down", tile_components[5]);
  }
  
  /*
  const drawVerticalTriangleHexatile = (pos_x, pos_y, tile_w, tile_h, tile_components) => {
  
  
  
      let tri_w = tile_w/2;
      let tri_h = tile_h/Math.round(tile_components.length/2);
  
      this.drawTri(pos_x, pos_y, tri_w, tri_h, "up", tile_components[0]);
      this.drawTri(pos_x + (tri_w/2), pos_y, tri_w, tri_h, "down", tile_components[1]);
      this.drawTri(pos_x + tri_w, pos_y, tri_w, tri_h, "down", tile_components[2]);
      this.drawTri(pos_x, pos_y+tri_h, tri_w, tri_h, "up", tile_components[3]);
      this.drawTri(pos_x, pos_y+(tri_h), tri_w, tri_h, "up", tile_components[4]);
      this.drawTri(pos_x + tri_w, pos_y+(tri_h), tri_w, tri_h, "down", tile_components[5]);
  } */
  
   const drawVerticalTriangleHexatile = (x, y, tile_w, tile_h, tiles, tile_columns) => {
  
      let row, tri, x_loc, y_loc, tri_style;
      let start_upside_down = false;
      let offset;
      let tile_rows = tiles.length;
      console.log(tiles)
  
      for (let j = 0; j < tile_rows; j++) {
        row = tiles[j]; //reverse can have cool effects
        y_loc = y + (tri_h * j);
        start_upside_down = false;
        offset = ((tile_columns - Math.round(row.length/2)) * .5);
        if (j >= tile_rows/2) {
          start_upside_down = true;
        }
  
        for (let i = 0; i < row.length; i++) {
  
          tri_style = row[i];
          x_loc = x+(tri_w*offset);
          //console.log("x_loc="+x_loc+" y_loc="+y_loc);
          offset = offset +.5;
  
          if (!start_upside_down) {
            if(i % 2 == 0) {
              this.drawTri(x_loc, y_loc, tri_h, tri_w, "up", tri_style);
            } else {
              this.drawTri(x_loc, y_loc, tri_h, tri_w, "down", tri_style);
            }
          } else {
            if(i % 2 == 0) {
              this.drawTri(x_loc, y_loc, tri_h, tri_w, "down", tri_style);
            } else {
              this.drawTri(x_loc, y_loc, tri_h, tri_w, "up", tri_style);
            }
          }
        }
      }
    }
  
    /*drawTri(x, y, h, w, tri_orientation, tri_style) {
  
      let x1,x2, y1, y2, x3, y3;
  
      if (tri_orientation == "down") {
        x1 = x;
        y1 = y+h;
        x2 = x+(w/2);
        y2 = y;
        x3 = x+w;
      } else {
        x1 = x;
        y1 = y; 
        x2 = x+(w/2);
        y2 = y+h;
        x3 = x+w;
      }
  
      if(typeof tri_style === "string") {
          fill(this.color_theme[tri_style]); 
      } else {
        //add forEarch
        if(stroke) {
          this.drawStroke(stroke, triangle_orientation);
        }
      }
      triangle(x1, y1, x2, y2, x3, y1);
    }*/
  
    const drawChamferedHexagon = () => {
  
    }
  
    const drawHorizontalTri = (x, y, w, h, tri_orientation, tri_style) => {
  
  
        let x1,x2, y1, y2, x3, y3;
  
        if (tri_orientation == "left") {
          x1 = x;
          y1 = y + h/2;
          x2 = x+w;
          y2 = y;
          x3 = x+w
          y3 = y+h;
        } else {
          x1 = x;
          y1 = y; 
          x2 = x+w;
          y2 = y+(h/2);
          x3 = x;
          y3 = y+h;
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
        triangle(x1, y1, x2, y2, x3, y3);
        noStroke(); 
      }
  
    const drawTri = (x, y, w, h, tri_orientation, tri_style) => {
  
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
        triangle(x1, y1, x2, y2, x3, y3);
        noStroke(); 
      }
  
    //Utility functions
  
    const drawStroke = (stroke, x1, y1, x2, y2, x3) => {
      if (stroke && Array.isArray(stroke)) {
   
  
  
  
      if (stroke(stroke["a"])) {
          line(x1, y1, x2, y2);
          stroke(stroke[1]);
        } 
        if (stroke(stroke["b"])) {
          line(x2, y2, x3, y3);
          stroke(stroke[1]);
        } 
        if (stroke(stroke["c"])) {
          line(x1, y1, x2, y2);
          line(x3, y3, x1, y1);
        }   
      } else if (typeof stroke === 'string') {
        console.log("s")
        //stroke(stroke);
      } 
      noStroke(); //always return to no stroke
    }
  

export default Tesselate;
  
  