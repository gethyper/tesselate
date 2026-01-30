import React, { useEffect, useRef, useDeferredValue, memo, useMemo } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { useP5SquareTesselation } from '../hooks/useP5SquareTesselation';

const SquareTesselateComponent = ({
  tile_pattern,
  color_theme,
  width = 100,
  height = 100,
  useGradient = false,
  tile_x_adjust = 0,
  tile_y_adjust = 0,
  tileStyle = 'triangles',
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
  const deferredTilePattern = useDeferredValue(tile_pattern);
  const deferredColorTheme = useDeferredValue(color_theme);
  const deferredWidth = useDeferredValue(width);
  const deferredHeight = useDeferredValue(height);
  const deferredUseGradient = useDeferredValue(useGradient);
  const deferredTileXAdjust = useDeferredValue(tile_x_adjust);
  const deferredTileYAdjust = useDeferredValue(tile_y_adjust);
  const deferredTileStyle = useDeferredValue(tileStyle);

  // Optimized tile_options memoization
  const tile_options = useMemo(() => ({
    tile_x_adjust: deferredTileXAdjust,
    tile_y_adjust: deferredTileYAdjust,
    tileStyle: deferredTileStyle,
  }), [deferredTileXAdjust, deferredTileYAdjust, deferredTileStyle]);

  const { setup, draw } = useP5SquareTesselation({
    tile_pattern: deferredTilePattern,
    color_theme: deferredColorTheme,
    width: deferredWidth,
    height: deferredHeight,
    useGradient: deferredUseGradient,
    tile_options
  });

  // Create p5 instance once on mount
  useEffect(() => {
    const currentComponentId = componentId.current;
    console.log(`[SQUARE ${currentComponentId}] CREATING P5 INSTANCE (MOUNT)`);
    const sketch = (p) => {
      p.setup = () => {
        setup(p);
        p.noLoop(); // Draw only when needed
      };
      p.draw = () => draw(p);
      p.windowResized = () => {
        console.log('SQUARE WINDOW RESIZE - TRIGGERING REDRAW', {
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
      console.log(`[SQUARE ${currentComponentId}] CLEANING UP P5 INSTANCE`);
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
    console.log(`[SQUARE ${componentId.current}] EFFECT - DEFERRED PARAMS CHANGED, SCHEDULING REDRAW`, {
      deferredWidth,
      deferredHeight,
      deferredTileXAdjust,
      deferredTileYAdjust,
      timestamp: Date.now()
    });

    if (redrawTimeoutRef.current) {
      clearTimeout(redrawTimeoutRef.current);
    }

    redrawTimeoutRef.current = setTimeout(() => {
      console.log(`[SQUARE ${componentId.current}] EXECUTING DEBOUNCED REDRAW`);
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
  }, [deferredTilePattern, deferredColorTheme, deferredWidth, deferredHeight, deferredUseGradient, deferredTileXAdjust, deferredTileYAdjust, deferredTileStyle]);

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

const SquareTesselate = memo(SquareTesselateComponent);

export default SquareTesselate;
