import React, { useEffect, useRef, useDeferredValue, memo, useMemo } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { useP5Tesselation } from '../hooks/useP5Tesselation';

const TesselateComponent = ({
  tile_shape,
  tile_pattern,
  color_theme,
  r,
  single_tile = false,
  useGradient = false,
  textureKey = null,
  tile_x_adjust = 0,
  tile_y_adjust = 0,
  shadowOptions = null,
  width = '100vw',
  height = '100vh',
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
  const deferredTileShape = useDeferredValue(tile_shape);
  const deferredTilePattern = useDeferredValue(tile_pattern);
  const deferredColorTheme = useDeferredValue(color_theme);
  const deferredR = useDeferredValue(r);
  const deferredSingleTile = useDeferredValue(single_tile);
  const deferredUseGradient = useDeferredValue(useGradient);
  const deferredTextureKey = useDeferredValue(textureKey);
  const deferredTileXAdjust = useDeferredValue(tile_x_adjust);
  const deferredTileYAdjust = useDeferredValue(tile_y_adjust);
  const deferredShadowOptions = useDeferredValue(shadowOptions);
  
  // Optimized tile_options memoization with deep comparison
  const tile_options = useMemo(() => ({
    tile_x_adjust: deferredTileXAdjust,
    tile_y_adjust: deferredTileYAdjust,
    shadowOptions: deferredShadowOptions,
  }), [deferredTileXAdjust, deferredTileYAdjust, deferredShadowOptions]);

  const { setup, draw } = useP5Tesselation({
    tile_shape: deferredTileShape,
    tile_pattern: deferredTilePattern,
    color_theme: deferredColorTheme,
    r: deferredR,
    single_tile: deferredSingleTile,
    useGradient: deferredUseGradient,
    textureKey: deferredTextureKey,
    tile_options
  });
  
  // Create p5 instance once on mount
  useEffect(() => {
    const currentComponentId = componentId.current;
    console.log(`🔄 [COMPONENT ${currentComponentId}] CREATING P5 INSTANCE (MOUNT)`);
    const sketch = (p) => {
      p.setup = () => {
        setup(p);
        p.noLoop(); // Animations disabled - draw only when needed
      };
      p.draw = () => draw(p);
      p.windowResized = () => {
        console.log('🖼️ WINDOW RESIZE - TRIGGERING REDRAW', {
          width: p.windowWidth,
          height: p.windowHeight,
          timestamp: Date.now()
        });
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.redraw(); // Redraw after resize since animations are disabled
      };
    };

    const p5Instance = new p5(sketch, p5ContainerRef.current);
    p5InstanceRef.current = p5Instance;

    return () => {
      console.log(`🗑️ [COMPONENT ${currentComponentId}] CLEANING UP P5 INSTANCE`);
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount/unmount - setup and draw are stable refs

  // Use timeout-based debounce to prevent double redraws
  const redrawTimeoutRef = useRef(null);
  
  useEffect(() => {
    console.log(`🎯 [COMPONENT ${componentId.current}] EFFECT - DEFERRED PARAMS CHANGED, SCHEDULING REDRAW`, {
      deferredTileShape, 
      deferredR, 
      deferredTileXAdjust, 
      deferredTileYAdjust,
      timestamp: Date.now()
    });
    
    // Clear any existing timeout
    if (redrawTimeoutRef.current) {
      clearTimeout(redrawTimeoutRef.current);
    }
    
    // Schedule redraw with small delay to batch multiple changes
    redrawTimeoutRef.current = setTimeout(() => {
      console.log(`▶️ [COMPONENT ${componentId.current}] EXECUTING DEBOUNCED REDRAW`);
      if (p5InstanceRef.current) {
        p5InstanceRef.current.redraw();
      }
      redrawTimeoutRef.current = null;
    }, 10);
    
    // Cleanup timeout on unmount
    return () => {
      if (redrawTimeoutRef.current) {
        clearTimeout(redrawTimeoutRef.current);
        redrawTimeoutRef.current = null;
      }
    };
  }, [deferredTileShape, deferredTilePattern, deferredColorTheme, deferredR, deferredSingleTile, deferredUseGradient, deferredTextureKey, deferredTileXAdjust, deferredTileYAdjust]);

  // React Strict Mode is enabled - may cause double effects in development
  
  return (
    <Box sx={{ 
      width, 
      height, 
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
          height: '100%',
          display: 'block'
        }}
      />
    </Box>
  );
};

// Memoized component to prevent unnecessary re-renders
const Tesselate = memo(TesselateComponent, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.tile_shape === nextProps.tile_shape &&
    prevProps.tile_pattern === nextProps.tile_pattern &&
    prevProps.color_theme === nextProps.color_theme &&
    prevProps.r === nextProps.r &&
    prevProps.single_tile === nextProps.single_tile &&
    prevProps.useGradient === nextProps.useGradient &&
    prevProps.textureKey === nextProps.textureKey &&
    prevProps.tile_x_adjust === nextProps.tile_x_adjust &&
    prevProps.tile_y_adjust === nextProps.tile_y_adjust &&
    JSON.stringify(prevProps.shadowOptions) === JSON.stringify(nextProps.shadowOptions)
  );
});

export default Tesselate;