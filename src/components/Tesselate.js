import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import Sketch from 'react-p5';
import TileDesigns from './TileDesigns';
import ColorThemes  from './ColorThemes';
import { useP5Tesselation } from '../hooks/useP5Tesselation';

// Default values (you can define these based on your needs)
const defaultPattern = TileDesigns['doubleHexatile'];
const defaultColorTheme = ColorThemes['basic_b'];
const defaultTileSize = 20;

const Tesselate = ({
  tile_shape = defaultPattern.tileShape,
  tile_pattern = defaultPattern.tilePattern,
  tile_offset = defaultPattern.tileOffset,
  color_theme = defaultColorTheme,
  r = defaultTileSize,
  single_tile = false,
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
  const { setup, draw, remove } = useP5Tesselation({
    tile_shape,
    tile_pattern,
    color_theme,
    r,
    single_tile
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
      remove();
    };
  }, [remove]);
  
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
            setup={setup} 
            draw={draw}
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