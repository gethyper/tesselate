import React, { useEffect, useRef, memo } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { useP5BrushTesselation } from '../hooks/useP5BrushTesselation';

/**
 * Mounts a WEBGL p5 sketch that renders a p5.brush-textured tessellation.
 *
 * The sketch keeps looping, but each frame only draws as many tiles as fit in a
 * small time budget, so a full repaint streams in instead of freezing the page.
 */
const BrushTesselateComponent = ({
  tile_pattern,
  color_theme,
  isPointyTop = true,
  brushOptions,
  containerWidth = '100vw',
  containerHeight = '100vh',
  position = 'fixed',
  top = 0,
  left = 0,
  zIndex = 1,
  onProgress,
  registerSave
}) => {
  const p5ContainerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const invalidateTimeoutRef = useRef(null);
  const registerSaveRef = useRef(registerSave);
  registerSaveRef.current = registerSave;

  const { setup, draw, invalidate, teardown, save, job } = useP5BrushTesselation({
    tile_pattern,
    color_theme,
    isPointyTop,
    brushOptions
  });

  // Progress is reported from the render loop, so route it through the job ref
  // rather than re-creating the sketch whenever the callback identity changes.
  useEffect(() => {
    const currentJob = job.current;
    currentJob.onProgress = onProgress;
    return () => {
      currentJob.onProgress = null;
    };
  }, [job, onProgress]);

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => setup(p);
      p.draw = () => draw(p);

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        invalidate();
      };
    };

    const instance = new p5(sketch, p5ContainerRef.current);
    p5InstanceRef.current = instance;

    // A WEBGL canvas reads back as fully transparent once the frame is composited,
    // so the export is deferred into the draw loop instead of grabbing it here.
    registerSaveRef.current?.(save);

    return () => {
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = null;
      }
      registerSaveRef.current?.(null);
      instance.remove();
      teardown();
      p5InstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Coalesce rapid slider changes so one drag does not queue many full repaints.
  useEffect(() => {
    if (invalidateTimeoutRef.current) {
      clearTimeout(invalidateTimeoutRef.current);
    }
    invalidateTimeoutRef.current = setTimeout(() => {
      invalidate();
      invalidateTimeoutRef.current = null;
    }, 200);

    return () => {
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
        invalidateTimeoutRef.current = null;
      }
    };
  }, [tile_pattern, color_theme, isPointyTop, brushOptions, invalidate]);

  return (
    <Box sx={{ width: containerWidth, height: containerHeight, position, top, left, zIndex, overflow: 'hidden' }}>
      <div
        className="sketch-container"
        ref={p5ContainerRef}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default memo(BrushTesselateComponent);
