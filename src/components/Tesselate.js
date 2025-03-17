import { Box } from '@mui/material';
import Sketch from 'react-p5';
import TileDesigns from './TileDesigns';
import ColorThemes  from './ColorThemes';
import { useP5Tesselation } from '../hooks/useP5Tesselation';
import { useEffect, useRef } from 'react';

// Default values (you can define these based on your needs)
const defaultPattern = TileDesigns['doubleHexatile'];
const defaultColorTheme = ColorThemes['basic_b'];
const defaultTileSize = 20;

const Tesselate = (props) => {
  const sketchRef = useRef(null);
  const { setup, draw, remove } = useP5Tesselation(props);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (sketchRef.current?.p5) {
          sketchRef.current.p5.remove();
        }
      };
    }, []);

  return (
    <Sketch setup={setup} draw={draw} />
  );
};

export default Tesselate;
  
  