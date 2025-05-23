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

const Tesselate = (props) => {
  const sketchRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const { setup, draw, remove } = useP5Tesselation(props);
  
  // Handle mounting
  useEffect(() => {
    setMounted(true);
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
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <div className="sketch-container" ref={sketchRef}>
        {mounted && <Sketch setup={setup} draw={draw} />}
      </div>
    </Box>
  );
};

export default Tesselate;
  
  