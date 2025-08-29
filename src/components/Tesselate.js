import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { useP5Tesselation } from '../hooks/useP5Tesselation';

const Tesselate = ({
  tile_shape,
  tile_pattern,
  color_theme,
  r,
  single_tile = false,
  useGradient = false,
  textureKey = null,
  tile_x_adjust = 0,
  tile_y_adjust = 0,
  mosaic_x_adjust = 0,
  mosaic_y_adjust = 0,
  width = '100vw',
  height = '100vh',
  position = 'fixed',
  top = 0,
  left = 0,
  zIndex = 1,
  overflow = 'hidden'
}) => {
  const p5ContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const { setup, draw } = useP5Tesselation({
    tile_shape,
    tile_pattern,
    color_theme,
    r,
    single_tile,
    useGradient,
    textureKey,
    tile_options: {
      tile_x_adjust,
      tile_y_adjust,
      mosaic_x_adjust,
      mosaic_y_adjust
    }
  });
  
  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => setup(p);
      p.draw = () => draw(p);
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch, p5ContainerRef.current);
    p5InstanceRef.current = p5Instance;

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [tile_shape, tile_pattern, color_theme, r, single_tile, useGradient, textureKey, tile_x_adjust, tile_y_adjust, mosaic_x_adjust, mosaic_y_adjust, setup, draw]);

  // No longer needed since we removed noLoop()
  
  // Disable Strict Mode
  // Either wrap your component with:
  // <React.StrictMode> <Your App /> </React.StrictMode>
  // in index.js, or remove StrictMode entirely for production
  
  return (
    <Box sx={{ 
      width, 
      height, 
      position, 
      top, 
      left, 
      zIndex,
      overflow
    }}>
      <div 
        className="sketch-container" 
        ref={p5ContainerRef}
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </Box>
  );
};

export default Tesselate;