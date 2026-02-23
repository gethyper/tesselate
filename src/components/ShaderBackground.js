import React, { useEffect, useRef, memo } from 'react';
import { Box } from '@mui/material';
import p5 from 'p5';
import { getShader, defaultVertexShader } from '../utils/shaders';

/**
 * ShaderBackground component
 * Renders an animated GLSL shader as a background using p5.js WEBGL renderer
 */
const ShaderBackgroundComponent = ({
  shaderKey = 'none',
  colorTheme = null,
  opacity = 1.0,
  width = '100vw',
  height = '100vh',
  position = 'fixed',
  top = 0,
  left = 0,
  zIndex = 0
}) => {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const shaderRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (shaderKey === 'none') {
      console.log('ShaderBackground: shaderKey is none, not rendering');
      return;
    }

    const shader = getShader(shaderKey);
    if (!shader.fragmentShader) {
      console.log('ShaderBackground: no fragment shader found for key:', shaderKey);
      return;
    }

    console.log('ShaderBackground: Creating shader canvas for', shaderKey);

    const sketch = (p) => {
      p.setup = () => {
        console.log('ShaderBackground: p5 setup started');
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        console.log('ShaderBackground: Canvas created', canvas);
        p.pixelDensity(1); // Optimize performance

        // Create shader from fragment and vertex shader code
        try {
          shaderRef.current = p.createShader(defaultVertexShader, shader.fragmentShader);
          console.log('ShaderBackground: Shader compiled successfully');
        } catch (error) {
          console.error('ShaderBackground: Error creating shader:', error);
        }
      };

      p.draw = () => {
        if (!shaderRef.current) return;

        try {
          // Use the shader
          p.shader(shaderRef.current);

          // Pass uniforms to shader
          const elapsedTime = (Date.now() - startTimeRef.current) / 1000.0;
          shaderRef.current.setUniform('u_resolution', [p.width, p.height]);
          shaderRef.current.setUniform('u_time', elapsedTime);
          shaderRef.current.setUniform('u_mouse', [p.mouseX, p.height - p.mouseY]);

          // Pass color theme to shader if available
          if (colorTheme) {
            // Convert hex colors to RGB arrays (0-1 range)
            const hexToRgb = (hex) => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? [
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255
              ] : [0.5, 0.5, 0.5];
            };

            shaderRef.current.setUniform('u_color_light', hexToRgb(colorTheme.light));
            shaderRef.current.setUniform('u_color_medium', hexToRgb(colorTheme.medium));
            shaderRef.current.setUniform('u_color_dark', hexToRgb(colorTheme.dark));
            shaderRef.current.setUniform('u_color_accent', hexToRgb(colorTheme.accent));
            shaderRef.current.setUniform('u_color_bg', hexToRgb(colorTheme.bg));
          }

          // Draw a full-screen quad
          // In WEBGL mode, we use a rect that covers the entire viewport
          p.noStroke();
          p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
        } catch (error) {
          console.error('Error rendering shader:', error);
        }
      };

      p.windowResized = () => {
        console.log('ShaderBackground: Window resized, updating canvas', p.windowWidth, p.windowHeight);
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch, containerRef.current);
    p5InstanceRef.current = p5Instance;

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [shaderKey]);

  // Don't render anything if shader is 'none'
  if (shaderKey === 'none') {
    console.log('ShaderBackground: Rendering null (shaderKey is none)');
    return null;
  }

  console.log('ShaderBackground: Rendering container with opacity:', opacity);

  return (
    <Box
      sx={{
        width,
        height,
        position,
        top,
        left,
        zIndex,
        opacity,
        pointerEvents: 'none' // Allow clicks to pass through to tessellation
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          overflow: 'hidden'
        }}
      />
    </Box>
  );
};

const ShaderBackground = memo(ShaderBackgroundComponent, (prevProps, nextProps) => {
  return (
    prevProps.shaderKey === nextProps.shaderKey &&
    prevProps.opacity === nextProps.opacity &&
    prevProps.colorTheme === nextProps.colorTheme
  );
});

export default ShaderBackground;
