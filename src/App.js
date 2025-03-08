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
    t_pattern: 'hex',
    t_design: 'triangle',
    c_theme: 'gender_fluent'
  });

  // Group all handlers in an object
  const handlers = {
    handleSizeChange: (event, newValue) => {
      setState(prev => ({ ...prev, speed: newValue }));
    },

    handleColorThemeChange: (event) => {
      setState(prev => ({ ...prev, colorTheme: event.target.value }));
    },

    handlePatternChange: (event) => {
      setState(prev => ({ ...prev, t_pattern: event.target.value }));
    },

    handleDesignChange: (event) => {
      setState(prev => ({ ...prev, t_design: event.target.value }));
    },

    handleThemeChange: (event) => {
      setState(prev => ({ ...prev, c_theme: event.target.value }));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tesselate 
        pattern={{ tileDesign: 'drawPizzaHexatile', tileComponents: [] }}
        color_theme={{ bg: '#f5f5f5', primary: '#3f51b5' }}
        tile_width={120}
        tile_height={120}
        variant="full"
      />


      <Box sx={{ 
        position: 'fixed', 
        bottom: 16, 
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
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
        Tesselations
      </Typography>
        <Box sx={{ mb: 2 }}>
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

        <FormControl fullWidth>
          <InputLabel>Color Theme</InputLabel>
          <Select
            value={state.colorTheme}
            onChange={handlers.handleColorThemeChange}
            label="Background Color"
          >
            <MenuItem value="#000000">Black</MenuItem>
            <MenuItem value="#1976d2">Blue</MenuItem>
            <MenuItem value="#388e3c">Green</MenuItem>
            <MenuItem value="#d32f2f">Red</MenuItem>
          </Select>
        </FormControl>
        </Paper>
      </Box>
    </Box>
     
  );
}


// Paper elevation={3} sx={{ p: 3 }}>
      //</Container>P5Sketch backgroundColor={state.backgroundColor} speed={state.speed}  
       //</Paper -->
   

export default App;
