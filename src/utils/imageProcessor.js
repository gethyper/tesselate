/**
 * Image processing utilities for tessellation pattern generation
 * Extracts brightness/density information from images to drive pattern complexity
 */

/**
 * Loads an image file and creates a brightness map
 *
 * @param {File} file - Image file to process
 * @returns {Promise<Object>} Object containing imageData, canvas, and getBrightness function
 */
export const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Create canvas to extract pixel data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Create brightness map for faster lookups
        const brightnessMap = new Float32Array(canvas.width * canvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];

          // Calculate brightness using perceived luminance formula
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          brightnessMap[i / 4] = brightness;
        }

        /**
         * Get brightness at normalized coordinates (0-1 range)
         * @param {number} normalizedX - X coordinate (0-1)
         * @param {number} normalizedY - Y coordinate (0-1)
         * @returns {number} Brightness value (0-1)
         */
        const getBrightness = (normalizedX, normalizedY) => {
          // Clamp coordinates to 0-1 range
          const x = Math.max(0, Math.min(1, normalizedX));
          const y = Math.max(0, Math.min(1, normalizedY));

          // Map to pixel coordinates
          const pixelX = Math.floor(x * (canvas.width - 1));
          const pixelY = Math.floor(y * (canvas.height - 1));

          // Get brightness from map
          const index = pixelY * canvas.width + pixelX;
          return brightnessMap[index];
        };

        /**
         * Get average brightness in a region
         * @param {number} normalizedX - Center X coordinate (0-1)
         * @param {number} normalizedY - Center Y coordinate (0-1)
         * @param {number} radius - Sample radius in normalized coords (default 0.01)
         * @returns {number} Average brightness (0-1)
         */
        const getAverageBrightness = (normalizedX, normalizedY, radius = 0.01) => {
          const samples = 5; // Sample points in the region
          let sum = 0;
          let count = 0;

          for (let dx = -radius; dx <= radius; dx += radius / (samples - 1)) {
            for (let dy = -radius; dy <= radius; dy += radius / (samples - 1)) {
              const x = normalizedX + dx;
              const y = normalizedY + dy;

              // Only sample if within bounds
              if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
                sum += getBrightness(x, y);
                count++;
              }
            }
          }

          return count > 0 ? sum / count : 0;
        };

        resolve({
          canvas,
          imageData,
          width: canvas.width,
          height: canvas.height,
          getBrightness,
          getAverageBrightness,
          // Preview URL for display
          previewUrl: canvas.toDataURL()
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Map brightness to pattern complexity (0-1 scale)
 * Bright areas = simple (low complexity), Dark areas = complex (high complexity)
 *
 * @param {number} brightness - Brightness value (0-1)
 * @param {boolean} invert - Invert mapping (bright=complex, dark=simple)
 * @returns {number} Complexity value (0-1)
 */
export const brightnessToComplexity = (brightness, invert = false) => {
  // Bright (1.0) → Simple (0.0), Dark (0.0) → Complex (1.0)
  const complexity = 1 - brightness;
  return invert ? 1 - complexity : complexity;
};

/**
 * Map brightness to alt color frequency (0-100 scale)
 *
 * @param {number} brightness - Brightness value (0-1)
 * @param {number} maxFrequency - Maximum frequency value (default 99)
 * @param {boolean} invert - Invert mapping (bright=high frequency)
 * @returns {number} Alt color frequency (0-maxFrequency)
 */
export const brightnessToAltColorFrequency = (brightness, maxFrequency = 99, invert = false) => {
  const value = invert ? brightness : (1 - brightness);
  return Math.round(value * maxFrequency);
};

/**
 * Map brightness to a discrete pattern index from a pattern array
 *
 * @param {number} brightness - Brightness value (0-1)
 * @param {number} patternCount - Number of patterns available
 * @param {boolean} invert - Invert mapping
 * @returns {number} Pattern index (0 to patternCount-1)
 */
export const brightnessToPatternIndex = (brightness, patternCount, invert = false) => {
  const value = invert ? brightness : (1 - brightness);
  return Math.min(Math.floor(value * patternCount), patternCount - 1);
};
