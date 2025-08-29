import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import TileDesigns from './TileDesigns';
import ColorThemes from './ColorThemes';
import { fillWithTiles } from '../hooks/useP5Tesselation';

const Gallery = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p5) => {
      const tileDesignKeys = Object.keys(TileDesigns).filter(key => {
        const design = TileDesigns[key];
        return design && design.tilePattern && Array.isArray(design.tilePattern) && design.tilePattern.length > 0;
      });
      const colorThemeKeys = Object.keys(ColorThemes);
      const radius = 20;
      let currentY = 50;
      let scrollY = 0;
      const totalContentHeight = 100 + (tileDesignKeys.length * 230); // Title + patterns

      p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.background(255); // White background
        
        // Load Inter font
        p5.textFont('Inter', 24);
      };

      p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
      };

      p5.mouseWheel = (event) => {
        scrollY += event.delta * 0.5;
        // Clamp scroll between 0 and max scroll distance
        const maxScroll = p5.max(0, totalContentHeight - p5.windowHeight + 50);
        scrollY = p5.constrain(scrollY, 0, maxScroll);
        return false; // Prevent default
      };

      p5.draw = () => {
        p5.background(255);
        
        // Apply scroll offset
        p5.push();
        p5.translate(0, -scrollY);
        
        // Draw main title
        p5.fill(0);
        p5.textFont('Inter', 32);
        p5.textAlign(p5.LEFT);
        p5.text('Tile Designs', 50, 50);
        
        currentY = 100;

        tileDesignKeys.forEach((designKey, index) => {
          const design = TileDesigns[designKey];
          const colorTheme = ColorThemes[colorThemeKeys[index % colorThemeKeys.length]];
          
          // Additional safety check
          if (!design || !design.tilePattern || !Array.isArray(design.tilePattern) || design.tilePattern.length === 0) {
            return;
          }
          
          // Draw pattern title
          p5.fill(0);
          p5.textFont('Inter', 18);
          p5.textAlign(p5.LEFT);
          p5.text(designKey, 50, currentY);
          
          currentY += 30;

          // Save current transform
          p5.push();
          p5.translate(50, currentY);

          // Draw pattern with shadows on individual hexagons
          fillWithTiles(
            p5, 
            design.tileShape, 
            radius, 
            design.tilePattern, 
            colorTheme, 
            { showSingleMosaic: true, addShadows: true }, // Add shadow flag
            false
          );

          // Restore transform
          p5.pop();

          currentY += 200;
        });

        // Restore transform
        p5.pop();
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, []);

  return (
    <Box 
      ref={sketchRef} 
      sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }} 
    />
  );
};

export default Gallery;