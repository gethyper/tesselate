import { Box } from '@mui/material';
import Sketch from 'react-p5';
import TileDesigns from './TileDesigns';
import ColorThemes  from './ColorThemes';
import { useP5Tesselation } from '../hooks/useP5Tesselation';

// Default values (you can define these based on your needs)
const defaultPattern = TileDesigns['doubleHexatile'];
const defaultColorTheme = ColorThemes['basic_b'];
const defaultTileHeight = 20;
const defaultTileWidth = 20;

const Tesselate = (props) => {
  const { setup, draw } = useP5Tesselation(props);

  return (
    <Sketch setup={setup} draw={draw} onchange={draw}/>
  );
};

export default Tesselate;
  
  