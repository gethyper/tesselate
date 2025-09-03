import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Tesselate from './components/Tesselate';
import TessellationControls from './components/TessellationControls';
import Gallery from './components/Gallery';
import TileDesigns from './components/TileDesigns';
import ColorThemes from './components/ColorThemes';
import PresentationPage from './components/PresentationPage';
import LearningPage from './components/LearningPage';
import { getFeaturedShowcase } from './components/Showcase';

// Tessellation page component
function TessellationPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a fresh random featured showcase on every page load/refresh
  const getInitialShowcase = (() => {
    const featured = getFeaturedShowcase();
    const keys = Object.keys(featured);
    if (keys.length === 0) return null;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return featured[randomKey];
  })();

  // State to track if user has manually interacted with controls
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  
  // Auto-rotation state
  const autoRotationTimer = useRef(null);
  const lastAutoRotationTime = useRef(Date.now());

  // State management with URL and localStorage persistence
  const [selectedPattern, setSelectedPattern] = useState(() => {
    const urlPattern = searchParams.get('pattern');
    
    // If URL pattern exists, use it (we'll mark user interaction in useEffect)
    if (urlPattern) {
      return urlPattern;
    }
    
    // If no URL pattern, always use random featured showcase for fresh experience
    return getInitialShowcase ? getInitialShowcase.tilePattern : 'shadowBoxes';
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const urlTheme = searchParams.get('theme');
    
    // If URL theme exists, use it (we'll mark user interaction in useEffect)
    if (urlTheme) {
      return urlTheme;
    }
    
    // If no URL theme, always use random featured showcase for fresh experience
    return getInitialShowcase ? getInitialShowcase.colorTheme : 'basicBee';
  });

  const [tileSize, setTileSize] = useState(() => {
    const urlSize = searchParams.get('size');
    
    // If URL size exists, parse it safely (we'll mark user interaction in useEffect)
    if (urlSize) {
      const parsedSize = parseFloat(urlSize);
      // Validate the parsed size is a reasonable number
      if (!isNaN(parsedSize) && isFinite(parsedSize) && parsedSize > 0 && parsedSize <= 200) {
        return parsedSize;
      }
      console.warn(`Invalid size parameter in URL: ${urlSize}, using default`);
    }
    
    // If no URL size or invalid size, use random featured showcase for fresh experience
    return getInitialShowcase ? getInitialShowcase.tileSize : 20;
  });

  // Check for secret parameter to hide controls
  const hideControls = searchParams.get('secret') === 'true';
  
  // Check for gradient parameter
  const useGradient = searchParams.get('gradient') === 'true';

  // Check for texture parameter
  const textureKey = searchParams.get('texture') || null;

  // Check for settings parameter to auto-open settings pane
  const autoOpenSettings = searchParams.get('settings') === 'true';

  // Parse tile adjustment parameters (support both numeric and effect patterns)
  const parseAdjustment = (param) => {
    if (!param || param === 'null' || param === 'undefined') {
      return { type: 'numeric', value: 0 };
    }
    
    // Decode URL encoding if present
    let decodedParam;
    try {
      decodedParam = decodeURIComponent(param);
    } catch (e) {
      console.warn(`Failed to decode URL parameter: ${param}, using raw value`);
      decodedParam = param;
    }
    
    // Check if it's an effect pattern (contains colons)
    if (decodedParam.includes(':')) {
      const parts = decodedParam.split(':');
      const effectType = parts[0].toLowerCase(); // Normalize effect type
      const values = parts.slice(1).map(val => {
        const num = parseFloat(val);
        // More strict validation for effect parameters
        if (isNaN(num) || !isFinite(num)) {
          console.warn(`Invalid effect parameter: ${val} in ${decodedParam}`);
          return 0;
        }
        // Cap extreme values to prevent calculation issues
        return Math.max(-1000, Math.min(1000, num));
      });
      
      return {
        type: effectType,
        values: values,
        raw: param
      };
    }
    
    // Plain numeric value
    const numValue = parseFloat(decodedParam);
    if (isNaN(numValue) || !isFinite(numValue)) {
      console.warn(`Invalid numeric adjustment parameter: ${decodedParam}`);
      return { type: 'numeric', value: 0, raw: param };
    }
    
    // Cap extreme values
    const clampedValue = Math.max(-1000, Math.min(1000, numValue));
    return {
      type: 'numeric',
      value: clampedValue,
      raw: param
    };
  };

  // Handle tile adjustments - URL parameters first, then initial showcase defaults
  const tileXAdjust = parseAdjustment(
    searchParams.get('tile_x_adjust') || 
    (getInitialShowcase && !searchParams.get('pattern') ? getInitialShowcase.tileXAdjust : null)
  );
  const tileYAdjust = parseAdjustment(
    searchParams.get('tile_y_adjust') || 
    (getInitialShowcase && !searchParams.get('pattern') ? getInitialShowcase.tileYAdjust : null)
  );

  // Function to rotate to the next featured design
  const rotateToNextDesign = () => {
    const featured = getFeaturedShowcase();
    const featuredKeys = Object.keys(featured);
    if (featuredKeys.length === 0) return;
    
    const randomKey = featuredKeys[Math.floor(Math.random() * featuredKeys.length)];
    const nextDesign = featured[randomKey];
    
    // Update all states without marking as user interaction
    setSelectedPattern(nextDesign.tilePattern);
    setSelectedTheme(nextDesign.colorTheme);
    setTileSize(nextDesign.tileSize);
    
    // Update URL without marking as user interaction
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pattern', nextDesign.tilePattern);
    newParams.set('theme', nextDesign.colorTheme);
    newParams.set('size', nextDesign.tileSize.toString());
    
    // Handle tile adjustments if they exist
    if (nextDesign.tileXAdjust) {
      newParams.set('tile_x_adjust', nextDesign.tileXAdjust);
    } else {
      newParams.delete('tile_x_adjust');
    }
    
    if (nextDesign.tileYAdjust) {
      newParams.set('tile_y_adjust', nextDesign.tileYAdjust);
    } else {
      newParams.delete('tile_y_adjust');
    }
    
    setSearchParams(newParams);
    lastAutoRotationTime.current = Date.now();
  };

  // Effect to detect if URL has parameters indicating user interaction
  useEffect(() => {
    const hasUrlParams = searchParams.get('pattern') || 
                         searchParams.get('theme') || 
                         searchParams.get('size') || 
                         searchParams.get('tile_x_adjust') || 
                         searchParams.get('tile_y_adjust') ||
                         searchParams.get('gradient') ||
                         searchParams.get('texture') ||
                         searchParams.get('settings');
    
    if (hasUrlParams && !userHasInteracted) {
      setUserHasInteracted(true);
    }
  }, []); // Run once on mount

  // Auto-rotation effect
  useEffect(() => {
    if (userHasInteracted || hideControls) {
      // Clear any existing timer if user has interacted
      if (autoRotationTimer.current) {
        clearInterval(autoRotationTimer.current);
        autoRotationTimer.current = null;
      }
      return;
    }

    // Start auto-rotation timer
    autoRotationTimer.current = setInterval(rotateToNextDesign, 10000); // 10 seconds

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoRotationTimer.current) {
        clearInterval(autoRotationTimer.current);
        autoRotationTimer.current = null;
      }
    };
  }, [userHasInteracted, hideControls]);

  // Update URL and localStorage when state changes
  const updatePattern = (pattern) => {
    setUserHasInteracted(true); // Mark user interaction
    setSelectedPattern(pattern);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pattern', pattern);
    setSearchParams(newParams);
    localStorage.setItem('tessellation-pattern', pattern);
  };

  const updateTheme = (theme) => {
    setUserHasInteracted(true); // Mark user interaction
    setSelectedTheme(theme);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('theme', theme);
    setSearchParams(newParams);
    localStorage.setItem('tessellation-theme', theme);
  };

  const debounceTimerRef = useRef(null);
  
  const updateSize = (size) => {
    setUserHasInteracted(true); // Mark user interaction
    // Update the UI immediately for responsiveness
    setTileSize(size);
    
    // Debounce the URL and localStorage updates
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('size', size.toString());
      setSearchParams(newParams);
      localStorage.setItem('tessellation-size', size.toString());
    }, 300); // 300ms delay
  };

  const updateAdjustments = (xValue, yValue) => {
    setUserHasInteracted(true); // Mark user interaction
    // Sanitize values to prevent NaN in URL
    const safeXValue = (xValue && xValue !== 'NaN' && !xValue.includes('NaN')) ? xValue : '0';
    const safeYValue = (yValue && yValue !== 'NaN' && !yValue.includes('NaN')) ? yValue : '0';
    
    const newParams = new URLSearchParams(searchParams);
    
    if (safeXValue === '0' && safeYValue === '0') {
      // Remove adjustment parameters when set to none
      newParams.delete('tile_x_adjust');
      newParams.delete('tile_y_adjust');
    } else {
      if (safeXValue !== '0') newParams.set('tile_x_adjust', safeXValue);
      else newParams.delete('tile_x_adjust');
      
      if (safeYValue !== '0') newParams.set('tile_y_adjust', safeYValue);
      else newParams.delete('tile_y_adjust');
    }
    
    setSearchParams(newParams);
  };

  // This useEffect was causing the bounce - we already sync from localStorage on mount

  // Get the current design and theme objects
  const currentDesign = TileDesigns[selectedPattern];
  const currentTheme = ColorThemes[selectedTheme];

  // Fallback to defaults if selected items are invalid
  const safeDesign = currentDesign || TileDesigns['shadowBoxes'];
  const safeTheme = currentTheme || ColorThemes['basicBee'];

  return (
    <>
      <Tesselate 
        tile_shape={safeDesign.tileShape}
        tile_pattern={safeDesign.tilePattern}
        color_theme={safeTheme}
        r={tileSize}
        single_tile={false}
        useGradient={useGradient}
        textureKey={textureKey}
        tile_x_adjust={tileXAdjust}
        tile_y_adjust={tileYAdjust}
        width="100vw"
        height="100vh"
        position="fixed"
        top={0}
        left={0}
        zIndex={1}
        overflow="hidden"
      />

      {!hideControls && (
        <TessellationControls
          selectedPattern={selectedPattern}
          selectedTheme={selectedTheme}
          tileSize={tileSize}
          onPatternChange={updatePattern}
          onThemeChange={updateTheme}
          onSizeChange={updateSize}
          useGradient={useGradient}
          textureKey={textureKey}
          tileXAdjust={tileXAdjust}
          tileYAdjust={tileYAdjust}
          onAdjustChange={updateAdjustments}
          autoOpenSettings={autoOpenSettings}
        />
      )}
    </>
  );
}

// Main App component with routing 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TessellationPage />} />
        <Route path="/tesselate" element={<TessellationPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/claude-code-learning.html" element={<LearningPage />} />
        <Route path="/learning" element={<LearningPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;