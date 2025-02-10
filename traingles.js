function drawTri(x,y,h,w,color, stroke_color=null) {
  var x1,x2, y1, y2, x3, y3;
  x1 = x;
  y1 = y+h;
  x2 = x+(w/2);
  y2 = y;
  x3 = x+w;
  y3 = y+h;
  var t= triangle(x1, y1, x2, y2, x3, y3);
  noStroke();
  t.fill(color); 
  
  if (stroke_color) {
    line(x1, y1, x2, y2);
    stroke(stroke_color);
    line(x2, y2, x3, y3);
    stroke(stroke_color);
    line(x3, y3, x1, y1);
    stroke(stroke_color);
  }
}

function drawUpsideDownTri(x,y,h,w, color, stroke_color=null) {
  var x1,x2, y1, y2, x3, y3;
  x1 = x;
  y1 = y+h;
  x2 = x+(w/2);
  y2 = y;
  x3 = x+w;
  y3 = y+h;
  var t = triangle(x1, y2, x2, y1, x3, y2);
  noStroke();
  t.fill(color); 
  
  if (stroke_color) {
    console.log(stroke);
    line(x1, y2, x2, y1);
    stroke(stroke_color);
    line(x2, y1, x3, y2);
    stroke(stroke_color);
    line(x3, y2, x1, y2);
    stroke(stroke_color);
  }
}

function buildTile() {}

function draw2xHexatile(x, y, h, w, color_profile) {
  drawTri(x+(w/2), y, h, w, "#aaa");
  drawUpsideDownTri(x+w, y, h, w, "#aaa");
  drawTri(x+(w*1.5), y, h, w, "#ccc");
  
  drawTri(x, y+h, h, w, "#aaa");
  drawUpsideDownTri(x+(w/2), y+h, h, w, "#aaa");
  drawTri(x+w, y+h, h, w, "#ccc");
  drawUpsideDownTri(x+(w*1.5), y+h, h, w, "#aaa");
  drawTri(x+(w*2), y+h, h, w, "#ccc");

  drawUpsideDownTri(x, y+(h*2), h, w, "#aaa");
  drawTri(x+(w/2), y+(h*2), h, w, "#000");
  drawUpsideDownTri(x+w, y+(h*2), h, w, "#ccc");
  drawTri(x+(w*1.5), y+(h*2), h, w, "#000");
  drawUpsideDownTri(x+(w*2), y+(h*2), h, w, "#ccc");
  
  drawUpsideDownTri(x+(w/2), y+(h*3), h, w, "#aaa");
  drawTri(x+w, y+(h*3), h, w, "#000");
  drawUpsideDownTri(x+(w*1.5), y+(h*3), h, w, "#ccc");
  
}

function draw3xHexatile(x, y, h, w, color_profile) {
  
  drawTri(x+w, y, h, w, "#aaa");
  drawUpsideDownTri(x+(w*1.5), y, h, w, "#aaa");
  drawTri(x+(w*2), y, h, w, "#ccc");
  
  drawTri(x+(w/2), y+h, h, w, "#aaa");
  drawUpsideDownTri(x+w, y+h, h, w, "#aaa");
  drawTri(x+(w*1.5), y+h, h, w, "#ccc");
  drawUpsideDownTri(x+(w*2), y+h, h, w, "#aaa");
  drawTri(x+(w*2.5), y+h, h, w, "#ccc");
  
  drawTri(x, y+(h*2), h, w, "#aaa");
  drawUpsideDownTri(x+(w/2), y+(h*2), h, w, "#aaa");
  drawTri(x+w, y+(h*2), h, w, "#ccc");
  drawUpsideDownTri(x+(w*1.5), y+(h*2), h, w, "#aaa");
  drawTri(x+(w*2), y+(h*2), h, w, "#ccc");
  drawUpsideDownTri(x+(w*2.5), y+(h*2), h, w, "#aaa");
  drawTri(x+(w*3), y+(h*2), h, w, "#ccc");
  
  drawUpsideDownTri(x, y+(h*3), h, w, "#aaa");
  drawTri(x+(w/2), y+(h*3), h, w, "#000");
  drawUpsideDownTri(x+w, y+(h*3), h, w, "#ccc");
  drawTri(x+(w*1.5), y+(h*3), h, w, "#000");
  drawUpsideDownTri(x+(w*2), y+(h*3), h, w, "#ccc");
  drawTri(x+(w*2.5), y+(h*3), h, w, "#000");
  drawUpsideDownTri(x+(w*3), y+(h*3), h, w, "#ccc");
  
  drawUpsideDownTri(x+(w/2), y+(h*4), h, w, "#aaa");
  drawTri(x+w, y+(h*4), h, w, "#000");
  drawUpsideDownTri(x+(w*1.5), y+(h*4), h, w, "#ccc");
  drawTri(x+(w*2), y+(h*4), h, w, "#000");
  drawUpsideDownTri(x+(w*2.5), y+(h*4), h, w, "#ccc");
  
  drawUpsideDownTri(x+w, y+(h*5), h, w, "#aaa");
  drawTri(x+(w*1.5), y+(h*5), h, w, "#000");
  drawUpsideDownTri(x+(w*2), y+(h*5), h, w, "#ccc");
  
}


function drawShadowBoxes(x, y, h, w, color_a, color_b, color_c) {
  
  //three colors
  drawTri(x+w, y, h, w, color_a);
  drawUpsideDownTri(x+(w*1.5), y, h, w, color_a);
  drawTri(x+(w*2), y, h, w, color_a);
  
  drawTri(x+(w/2), y+h, h, w, color_a);
  drawUpsideDownTri(x+w, y+h, h, w, color_a);
  drawTri(x+(w*1.5), y+h, h, w, color_a);
  drawUpsideDownTri(x+(w*2), y+h, h, w, color_a);
  drawTri(x+(w*2.5), y+h, h, w, color_a);
  
  drawTri(x, y+(h*2), h, w, color_a);
  drawUpsideDownTri(x+(w/2), y+(h*2), h, w, color_a);
  drawTri(x+w, y+(h*2), h, w, color_a);
  drawUpsideDownTri(x+(w*1.5), y+(h*2), h, w, color_b);
  drawTri(x+(w*2), y+(h*2), h, w, color_c);
  drawUpsideDownTri(x+(w*2.5), y+(h*2), h, w, color_c);
  drawTri(x+(w*3), y+(h*2), h, w, color_c);
  
  drawUpsideDownTri(x, y+(h*3), h, w, color_a);
  drawTri(x+(w/2), y+(h*3), h, w, color_a);
  drawUpsideDownTri(x+w, y+(h*3), h, w, color_a);
  drawTri(x+(w*1.5), y+(h*3), h, w, color_c);
  drawUpsideDownTri(x+(w*2), y+(h*3), h, w, color_b);
  drawTri(x+(w*2.5), y+(h*3), h, w, color_b);
  drawUpsideDownTri(x+(w*3), y+(h*3), h, w, color_b);
  
  drawUpsideDownTri(x+(w/2), y+(h*4), h, w, color_a);
  drawTri(x+w, y+(h*4), h, w, color_a);
  drawUpsideDownTri(x+(w*1.5), y+(h*4), h, w, color_a);
  drawTri(x+(w*2), y+(h*4), h, w, "#000");
  drawUpsideDownTri(x+(w*2.5), y+(h*4), h, w, color_a);
  
  drawUpsideDownTri(x+w, y+(h*5), h, w, color_a);
  drawTri(x+(w*1.5), y+(h*5), h, w, color_a);
  drawUpsideDownTri(x+(w*2), y+(h*5), h, w, color_a);
  
}

function drawHexatile(x, y, h, w, color_profile) { 
  
  drawTri(x, y, h, w, "#aaa");
  drawUpsideDownTri(x+(w/2), y, h, w, "#aaa");
  drawTri(x+w, y, h, w, "#ccc");
  
  drawUpsideDownTri(x, y+h, h, w, "#aaa");
  drawTri(x+(w/2), y+h, h, w, "#000");
  drawUpsideDownTri(x+w, y+h, h, w, "#ccc");
}


function invertTile (h,w) {
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      if (j % 2 == 0) {
        drawUpsideDownTri(i*w-50, j*h, 100, 100);
        drawTri(i*w, j*h, 100, 100);
      }
      else {
        drawUpsideDownTri(i*w, j*h, 100, 100);
        drawTri(i*w-50, j*h, 100, 100);
      }
    }
  }
}

function shelfTile (h, w) {
  var h = 100;
  var w = 100;
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      drawUpsideDownTri(i*w-50, j*h, 100, 100);
      drawTri(i*w, j*h, 100, 100);
    }
  }
}

var Tiler = function () {
  
  
  
}


function alternateTwoHexatiles (x, y, h, w, hex_a_style, hex_b_style) {
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      if (i% 2 == 0) {
        drawHexatile((w*i*3)-(w), h*j*2, h, w, hex_a_style);
        drawHexatile((w*i*3)+w/2,(h*j*2)-(h), h, w, hex_b_style);
      } else {
        drawHexatile((w*i*3)-(w), h*j*2, h, w, hex_b_style);
        drawHexatile((w*i*3)+w/2,(h*j*2)-(h), h, w, hex_a_style);    
      }
    }
  }
}


function alternateHexatiles(x, y, h, w) {
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      if (j % 2 == 0) {
        drawUpsideDownTri(i*w-50, j*h, h, w);
        drawTri(i*w, j*h, h, w);
      }
      else {
        drawUpsideDownTri(i*w, j*h, h, w);
        drawTri(i*w-50, j*h, h, w);
      }
    }
  }
}



function invertTile (h,w) {
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      if (j % 2 == 0) {
        drawUpsideDownTri(i*w-50, j*h, 100, 100);
        drawTri(i*w, j*h, 100, 100);
      }
      else {
        drawUpsideDownTri(i*w, j*h, 100, 100);
        drawTri(i*w-50, j*h, 100, 100);
      }
    }
  }
}

function shelfTile (h, w) {
  var h = 100;
  var w = 100;
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      drawUpsideDownTri(i*w-50, j*h, 100, 100);
      drawTri(i*w, j*h, 100, 100);
    }
  }
}


function tileHexatiles(x, y, h, w, scale, color_a, color_b, color_c) {
  
  var doc_w = window.document.body.offsetWidth;
  var doc_h = window.document.body.offsetHeight;
  var tiles_wide = Math.round(doc_w/w) + 1;
  var tiles_high = Math.round(doc_h/h) + 1;
  var draw_fn = drawHexatile;
  
  var total_w = (scale+1) * w;
  var total_h = (scale*2) * h;
  
  var offset_x = total_w/2;
  var offset_y = total_h/2;
  
  if (scale == 2) {
    draw_fn = draw2xHexatile;
  } else if (scale == 3){
    draw_fn = drawShadowBoxes;
  } 

  
  for (let j = 0; j < tiles_high; j++) {
    for (let i = 0; i < 10; i++) {
      var x1 = (i*total_w)+(w*i)-offset_x;
      var x2 = (i*total_w)+(w*i)+(offset_x/2-w/2);
      var y1 = total_h * j;
      var y2 = (total_h * j-(total_h/2));
      draw_fn(x1, y1, h, w, color_a, color_b, color_c);
      draw_fn(x2, y2, h, w, color_a, color_b, color_c);
    }
  }
}

function getHexatileX(w, scale, pos, offset){
  var total_w = ((scale*2)+1) * w;
  var offset_x = total_w/2;
  return (pos*total_w)+(w*pos)-offset_x;
}

function getHexatileY(w, scale, pos, offset=false){
  var total_h = scale*2*w;
  var offset_y = (offset) ? total_h/2 : 0;
  return (pos*total_h)+(h*pos)-offset_y;
}

function setup() {
  var w = window.document.body.offsetWidth;
  var h = /*window.document.body.offsetHeight;*/document.documentElement.clientHeight;
  createCanvas(w, h);
  background(255, 204, 0);
}

  
function draw() {
  tileHexatiles(0, 0, 16, 20, 3, "#fff", "#ccc", "#000");
  //draw3xHexatile(0, 0, 15, 19)
}