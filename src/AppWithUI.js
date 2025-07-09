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
        tile_shape={TileDesigns["mosaicMitre"].tileShape}
        tile_pattern={TileDesigns["mosaicMitre"].tilePattern}
        tile_offset={TileDesigns["mosaicMitre"].tileOffset}
        color_theme={ColorThemes["basic_b"]}
        r={50}
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
      
        <Paper elevation={3} sx={{ 
          p: 3, 
          width: { xs: '95%', sm: '80%', md: '60%' }, 
          maxWidth: '800px'
        }}>
          <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
        Tesselations
      </Typography>
        <Box sx={{ width: 210 }}>
          <Typography gutterBottom>Size Control</Typography>
          <Slider
            value={state.size}
            onChange={handlers.Size}
            min={10}
            max={100}
            step={10}
            valueLabelDisplay="auto"
            marks={[
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
            ]}
          />
        </Box>
        <FormControl sx={{ width: 210 }}>
          <InputLabel>Tile Designs Theme</InputLabel>
          <Select
            value={state.color_theme}
            onChange={(event) => handlers.handleTileDesignChange(event.target.value)}
            label="Color Theme"
          >
            {Object.keys(TileDesigns).map((designName) => (
              <MenuItem key={designName} value={designName}>
                {designName.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: 210 }}>
          <InputLabel>Color Theme</InputLabel>
          <Select
            value={state.color_theme}
            onChange={(event) => handlers.handleColorThemeChange(event.target.value)}
            label="Color Theme"
          >
            {Object.keys(ColorThemes).map((themeName) => (
              <MenuItem key={themeName} value={themeName}>
                {themeName.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Paper>
      </Box>
    </>
     
  );
}

   

export default App;
