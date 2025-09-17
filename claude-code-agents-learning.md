# Claude Code Agents Learning

## Overview
This document captures key learnings and best practices discovered while working with Claude Code agents on the tessellation project.

## Key Learnings

### 1. Debugging Complex NaN Issues
**Challenge**: Persistent NaN errors in tessellation calculations, particularly with wobble effects.

**Approach Taken**:
- Added comprehensive validation at every calculation stage
- Implemented detailed debugging with stack traces
- Used progressive debugging (starting broad, narrowing focus)
- Added fallback mechanisms for invalid calculations

**Key Discovery**: Multiple tessellation systems existed in the codebase:
- Modern unified system (`tileUnified`) - well-protected
- Legacy system (`drawMultiHexatiles`) - source of NaN errors

**Learning**: When debugging complex issues, map out all code paths that could lead to the problem, not just the obvious ones.

### 2. URL Parameter Parsing Robustness
**Challenge**: URLs with encoded characters and extreme values causing calculation failures.

**Solutions Implemented**:
- URL decoding with error handling
- Input validation and bounds checking
- Value clamping to prevent extreme inputs
- Graceful fallbacks for malformed parameters

**Code Example**:
```javascript
// Before: Basic parsing
const numValue = Number(param);

// After: Robust parsing
const numValue = parseFloat(decodeURIComponent(param));
if (isNaN(numValue) || !isFinite(numValue)) {
  console.warn(`Invalid parameter: ${param}`);
  return defaultValue;
}
return Math.max(minValue, Math.min(maxValue, numValue));
```

### 3. Progressive Enhancement of User Controls
**Challenge**: Adding negative multipliers to existing positive-only system.

**Approach**:
- Extended existing dropdown with negative options (-1x, -2x, -5x, -10x)
- Updated calculation logic to handle negative values
- Maintained backward compatibility with existing functionality

**Learning**: When enhancing existing features, ensure all related calculation and validation logic supports the new functionality.

### 4. Error Handling Strategies

#### Validation Layers
1. **Input Validation**: At parameter parsing stage
2. **Calculation Validation**: At intermediate calculation steps
3. **Output Validation**: Before drawing/rendering
4. **Fallback Mechanisms**: When errors occur

#### Debugging Strategies
1. **Targeted Debugging**: Focus on specific problematic values/positions
2. **Component Breakdown**: Debug each calculation component separately
3. **Stack Trace Analysis**: Use `new Error().stack` to trace call origins
4. **Cache-Busting**: Add version identifiers to force browser updates

### 5. Managing Multiple Code Paths
**Discovery**: The tessellation system had two separate rendering paths:
- `tileUnified()` - Modern system with better error handling
- `drawMultiHexatiles()` - Legacy system prone to NaN errors

**Strategy**: 
- Added validation to both systems
- Maintained backward compatibility
- Documented which effects use which system

### 6. Todo List Management
**Best Practice**: Use TodoWrite tool to track progress on complex, multi-step debugging:

```javascript
// Example todo structure for debugging
[
  {"content": "Identify NaN source in wobble effect", "status": "in_progress"},
  {"content": "Add validation to legacy tessellation system", "status": "pending"},
  {"content": "Test wobble effect without crashes", "status": "pending"}
]
```

### 7. Showcase Management
**Learning**: When adding new tessellation combinations to the showcase:
- Use descriptive titles that capture the visual effect
- Include technical details in descriptions
- Set appropriate featured status
- Test URLs before adding to ensure they work properly

## Technical Patterns

### Robust Number Parsing
```javascript
const parseRobustNumber = (value, defaultValue = 0, min = -1000, max = 1000) => {
  if (!value || value === 'null' || value === 'undefined') return defaultValue;
  
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch (e) {
    decoded = value;
  }
  
  const num = parseFloat(decoded);
  if (isNaN(num) || !isFinite(num)) return defaultValue;
  
  return Math.max(min, Math.min(max, num));
};
```

### Safe Mathematical Operations
```javascript
const safeCalculation = (a, b, operation) => {
  if (!isFinite(a) || !isFinite(b) || isNaN(a) || isNaN(b)) {
    console.warn(`Invalid inputs for calculation: a=${a}, b=${b}`);
    return 0;
  }
  
  const result = operation(a, b);
  
  if (!isFinite(result) || isNaN(result)) {
    console.warn(`Calculation produced invalid result: ${result}`);
    return 0;
  }
  
  return result;
};
```

### Comprehensive Error Logging
```javascript
const logCalculationError = (context, inputs, result) => {
  console.error(`🚨 Calculation Error in ${context}:`);
  console.error(`  Inputs:`, inputs);
  console.error(`  Result: ${result}`);
  console.error(`  Stack:`, new Error().stack);
};
```

## Future Improvements

### Code Organization
- Consider refactoring to use only the unified tessellation system
- Deprecated legacy functions with clear migration path
- Centralize all mathematical operations with built-in validation

### Enhanced Debugging
- Add runtime switches to enable/disable detailed debugging
- Create visual debugging overlays for tessellation calculations
- Implement performance monitoring for complex calculations

### User Experience
- Add loading states for complex tessellation calculations
- Provide user feedback when invalid parameters are corrected
- Create parameter validation UI to prevent invalid inputs

## Conclusion
Working on the tessellation project revealed the importance of:
1. **Defensive Programming**: Validate inputs at every stage
2. **Progressive Debugging**: Start broad, narrow focus systematically  
3. **Documentation**: Track discoveries and solutions for future reference
4. **Multiple Code Paths**: Always consider legacy systems and alternative implementations
5. **User Experience**: Handle errors gracefully without breaking functionality

These learnings can be applied to future Claude Code agent collaborations to improve efficiency and code quality.