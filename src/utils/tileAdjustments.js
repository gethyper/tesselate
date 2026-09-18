/**
 * Tile position adjustment effects.
 *
 * Shared by every renderer so the palette's Adjust control behaves identically
 * whichever renderer is active. The 2D and brush renderers both resolve a tile's
 * offset from its column/row index through `createAdjustmentFunction`.
 */

/**
 * Calculate tile adjustment effects based on position and effect type
 * 
 * @param {Object} adjustment - Adjustment object from URL parsing
 * @param {number} i - Column index
 * @param {number} j - Row index
 * @param {number} r - Tile radius
 * @returns {number} Calculated adjustment value
 */
export const calculateTileAdjustment = (adjustment, i, j, r) => {
  if (!adjustment || adjustment.type === 'numeric') {
    return adjustment?.value || 0;
  }

  // Debug logging for troubleshooting
  if (adjustment.type === 'random' && (isNaN(i) || isNaN(j) || isNaN(r))) {
    console.warn(`Invalid parameters for random adjustment: i=${i}, j=${j}, r=${r}, adjustment=`, adjustment);
    return 0;
  }

  switch (adjustment.type) {
    case 'wave':
    case 'sine':
      // wave:amplitude:frequency (optimized calculation with safety checks)
      const amplitude = adjustment.values[0] || 10;
      const frequency = adjustment.values[1] || 1;
      
      // Validate wave parameters
      if (!isFinite(amplitude) || isNaN(amplitude) || !isFinite(frequency) || isNaN(frequency)) {
        return 0;
      }
      
      const waveInput = (i + j) * frequency * 0.1;
      const waveResult = amplitude * Math.sin(waveInput);
      return isFinite(waveResult) && !isNaN(waveResult) ? waveResult : 0;
    
    case 'random':
      // Simplified random calculation - much faster
      const intensity = adjustment.values[0] || 5;
      
      // Fast hash-based pseudorandom (no overflow concerns)
      const hash = ((i * 73) ^ (j * 79)) & 0x7fffffff; // Keep positive with bitwise AND
      const pseudoRandom = (hash % 10000) / 10000; // Normalize to 0-1
      
      return (pseudoRandom - 0.5) * intensity * 2;
    
    case 'alt':
      // alt:value1:value2
      const value1 = adjustment.values[0] || 0;
      const value2 = adjustment.values[1] || 0;
      return (i + j) % 2 === 0 ? value1 : value2;
    
    case 'shiftx':
      // shiftx:offset:interval - shift every Nth column by offset amount
      // Example: shiftx:20:2 = shift every 2nd column by 20 pixels
      const xOffset = adjustment.values[0] || 10;
      const xInterval = Math.max(1, adjustment.values[1] || 2); // Default to every 2nd column, minimum 1
      return (i % xInterval === 0) ? 0 : xOffset;
    
    case 'shifty':
      // shifty:offset:interval - shift every Nth row by offset amount  
      // Example: shifty:15:3 = shift every 3rd row by 15 pixels
      const yOffset = adjustment.values[0] || 10;
      const yInterval = Math.max(1, adjustment.values[1] || 2); // Default to every 2nd row, minimum 1
      return (j % yInterval === 0) ? 0 : yOffset;
    
    default:
      return 0;
  }
};

/**
 * Extracts numeric value from adjustment parameter (object or primitive)
 * 
 * @param {number|Object} adjustment - Adjustment value or object
 * @returns {number} Numeric value (guaranteed to be finite)
 */
export const getNumericValue = (adjustment) => {
  let value;
  if (typeof adjustment === 'object') {
    value = adjustment?.value || 0;
  } else {
    value = adjustment || 0;
  }
  
  // Ensure we return a finite number
  return (isFinite(value) && !isNaN(value)) ? value : 0;
};

/**
 * Creates optimized adjustment function for X or Y coordinate without caching
 * Direct calculation is faster than Map lookups for most use cases
 * 
 * @param {number|Object} adjustment - X or Y adjustment value/object
 * @param {number} r - Tile radius
 * @param {string} axis - 'x' or 'y' for legacy behavior
 * @returns {Function} Function that takes (i, j) and returns adjustment value
 */
export const createAdjustmentFunction = (adjustment, r, axis) => {
  // For numeric adjustments
  if (typeof adjustment !== 'object' || adjustment.type === 'numeric') {
    const numericValue = getNumericValue(adjustment);
    return (i, j) => numericValue * (axis === 'x' ? i : j);
  }

  // For complex adjustments, calculate directly (faster than caching)
  return (i, j) => calculateTileAdjustment(adjustment, i, j, r);
};
