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
import P5Sketch from './components/P5Sketch';
import Tesselate from './components/Tesselate';


function App() {
  const [speed, setSpeed] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState('#000000');

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };

  const handleColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 4 }}>
        P5.js with Material-UI
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Speed Control</Typography>
          <Slider
            value={speed}
            onChange={handleSpeedChange}
            min={-5}
            max={5}
            step={0.1}
            valueLabelDisplay="auto"
            marks={[
              { value: -5, label: '-5' },
              { value: 0, label: '0' },
              { value: 5, label: '5' },
            ]}
          />
        </Box>

        <FormControl fullWidth>
          <InputLabel>Background Color</InputLabel>
          <Select
            value={backgroundColor}
            onChange={handleColorChange}
            label="Background Color"
          >
            <MenuItem value="#000000">Black</MenuItem>
            <MenuItem value="#1976d2">Blue</MenuItem>
            <MenuItem value="#388e3c">Green</MenuItem>
            <MenuItem value="#d32f2f">Red</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <P5Sketch backgroundColor={backgroundColor} speed={speed} />
      </Paper>
    </Container>
  );
}

export default App;
