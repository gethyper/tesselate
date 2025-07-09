import React, { useState } from 'react';
import {
  Container,
  Paper,
  Slider,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Tesselate from './components/Tesselate';
import TileDesigns from './components/TileDesigns';
import ColorThemes  from './components/ColorThemes';

function App() {
  // Group all state in a single object
  const [state, setState] = useState({
    size: 20,
    tile_design: TileDesigns["mosaicMitre"],
    tile_shape: TileDesigns["mosaicMitre"].tileShape,
    tile_pattern: TileDesigns["mosaicMitre"].tilePattern,
    color_theme: 'basic_b'
  });



  // Group all handlers in an object
  const handlers = {
    handleTileSizeChange: (event, newValue) => {
      setState(prev => ({ ...prev, size: newValue }));
    },

    handleColorThemeChange: (themeName) => {
      setState(prev => ({ ...prev, color_theme: themeName }));
    },


    handleTileDesignChange: (event) => {
      setState(prev => ({ ...prev, t_design: event.target.value }));
    }

  };

  return (
    <>
      <Tesselate 
        tile_shape={TileDesigns["monoTile"].tileShape}
        tile_pattern={TileDesigns["monoTile"].tilePattern}
        tile_offset={TileDesigns["monoTile"].tileOffset}
        color_theme={ColorThemes["basic_b"]}
        r={10}
        single_tile={false}
      />


      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center'
      }}>
      </Box>
    </>
     
  );
}

   

export default App;
