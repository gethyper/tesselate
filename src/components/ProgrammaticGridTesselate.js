import React, { useEffect, useRef, useDeferredValue, memo, useMemo } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { useP5ProgrammaticGrid } from '../hooks/useP5ProgrammaticGrid';

const ProgrammaticGridTesselateComponent = ({
  generatorName = 'perlinColors',
  color_theme,
  width = 100,
  height = 100,
  tileStyle = 'triangles',
  generatorOptions = {},
  containerWidth = '100vw',
  containerHeight = '100vh',
  position = 'fixed',
  top = 0,
  left = 0,
  zIndex = 1,
  overflow = 'hidden'
}) => {
  const componentId = useRef(Math.random().toString(36).substr(2, 9));
  const p5ContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  // Use deferred values to batch rapid updates
  const deferredGeneratorName = useDeferredValue(generatorName);
  const deferredColorTheme = useDeferredValue(color_theme);
  const deferredWidth = useDeferredValue(width);
  const deferredHeight = useDeferredValue(height);
  const deferredTileStyle = useDeferredValue(tileStyle);
  const deferredGeneratorOptions = useDeferredValue(generatorOptions);

  // Optimized tile_options memoization
  const tile_options = useMemo(() => ({
    tileStyle: deferredTileStyle,
    generatorOptions: deferredGeneratorOptions,
  }), [deferredTileStyle, deferredGeneratorOptions]);

  const { setup, draw } = useP5ProgrammaticGrid({
    generatorName: deferredGeneratorName,
    color_theme: deferredColorTheme,
    width: deferredWidth,
    height: deferredHeight,
    tile_options
  });

  // Create p5 instance once on mount
  useEffect(() => {
    const currentComponentId = componentId.current;
    console.log(`[PROG GRID ${currentComponentId}] CREATING P5 INSTANCE (MOUNT)`);
    const sketch = (p) => {
      p.setup = () => {
        setup(p);
        p.noLoop(); // Draw only when needed
      };
      p.draw = () => draw(p);
      p.windowResized = () => {
        console.log('PROG GRID WINDOW RESIZE - TRIGGERING REDRAW', {
          width: p.windowWidth,
          height: p.windowHeight,
          timestamp: Date.now()
        });
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.redraw();
      };
    };

    const p5Instance = new p5(sketch, p5ContainerRef.current);
    p5InstanceRef.current = p5Instance;

    return () => {
      console.log(`[PROG GRID ${currentComponentId}] CLEANING UP P5 INSTANCE`);
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced redraw on param changes
  const redrawTimeoutRef = useRef(null);

  useEffect(() => {
    console.log(`[PROG GRID ${componentId.current}] EFFECT - DEFERRED PARAMS CHANGED, SCHEDULING REDRAW`, {
      deferredGeneratorName,
      deferredWidth,
      deferredHeight,
      timestamp: Date.now()
    });

    if (redrawTimeoutRef.current) {
      clearTimeout(redrawTimeoutRef.current);
    }

    redrawTimeoutRef.current = setTimeout(() => {
      console.log(`[PROG GRID ${componentId.current}] EXECUTING DEBOUNCED REDRAW`);
      if (p5InstanceRef.current) {
        p5InstanceRef.current.redraw();
      }
      redrawTimeoutRef.current = null;
    }, 10);

    return () => {
      if (redrawTimeoutRef.current) {
        clearTimeout(redrawTimeoutRef.current);
        redrawTimeoutRef.current = null;
      }
    };
  }, [deferredGeneratorName, deferredColorTheme, deferredWidth, deferredHeight, deferredTileStyle, deferredGeneratorOptions]);

  return (
    <Box sx={{
      width: containerWidth,
      height: containerHeight,
      position,
      top,
      left,
      zIndex,
      overflow
    }}>
      <div
        className="sketch-container"
        ref={p5ContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      />
    </Box>
  );
};

const ProgrammaticGridTesselate = memo(ProgrammaticGridTesselateComponent);

export default ProgrammaticGridTesselate;
