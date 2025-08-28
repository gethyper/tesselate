import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Sketch from 'react-p5';
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
  const sketchRef = useRef(null);
  const [mounted, setMounted] = useState(false);
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
  
  // Simple mount/unmount effect
  useEffect(() => {
    setMounted(true);
    
    // Log container dimensions
    if (sketchRef.current) {
      console.log('Container dimensions:', {
        width: sketchRef.current.offsetWidth,
        height: sketchRef.current.offsetHeight,
        clientWidth: sketchRef.current.clientWidth,
        clientHeight: sketchRef.current.clientHeight
      });
    }
    
    return () => {
      setMounted(false);
    };
  }, []);

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
        ref={sketchRef}
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        {mounted && (
          <Sketch 
            key={`${tile_shape}-${JSON.stringify(tile_pattern)}-${JSON.stringify(color_theme)}-${r}-${textureKey}`}
            setup={setup} 
            draw={draw}
            windowResized={(p5) => {
              p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />
        )}
      </div>
    </Box>
  );
};

export default Tesselate;