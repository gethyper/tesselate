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
    tile_design: TileDesigns["mosaicMitres"],
    tile_shape: TileDesigns["mosaicMitres"].tileShape,
    tile_pattern: TileDesigns["mosaicMitres"].tilePattern,
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
      {/* Example 1: Using all optional parameters with custom values */}
      <Tesselate 
        tile_shape={TileDesigns["pointyTop1x1"].tileShape}
        tile_pattern={TileDesigns["pointyTop1x1"].tilePattern}
        tile_offset={TileDesigns["pointyTop1x1"].tileOffset}
        color_theme={ColorThemes["basic_b"]}
        r={20}
        single_tile={false}
        width="100vw"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        zIndex={1}
        overflow="hidden"
      />

      {/* Example 2: Using minimal parameters (others will use defaults) */}
      {/* 
      <Tesselate 
        r={state.size}
        color_theme={ColorThemes[state.color_theme]}
      />
      */}

      {/* Example 3: Using state values */}
      {/*
      <Tesselate 
        tile_shape={state.tile_shape}
        tile_pattern={state.tile_pattern}
        color_theme={ColorThemes[state.color_theme]}
        r={state.size}
      />
      */}

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
