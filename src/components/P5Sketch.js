import React from 'react';
import Sketch from 'react-p5';
import { Box } from '@mui/material';

const P5Sketch = ({ backgroundColor, speed }) => {
  let x = 0;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(600, 400).parent(canvasParentRef);
  };

  const draw = (p5) => {
    p5.background(backgroundColor);
    
    // Draw a moving circle
    p5.fill(255);
    p5.ellipse(x, p5.height / 2, 50, 50);
    
    // Update position
    x = (x + speed) % p5.width;
    if (x < 0) x = p5.width;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <Sketch setup={setup} draw={draw} />
    </Box>
  );
};

export default P5Sketch; 