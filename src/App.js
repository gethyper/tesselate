import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Tesselate from './components/Tesselate';
import TessellationControls from './components/TessellationControls';
import Gallery from './components/Gallery';
import TileDesigns from './components/TileDesigns';
import ColorThemes from './components/ColorThemes';
import PresentationPage from './components/PresentationPage';
import { getFeaturedShowcase } from './components/Showcase';

// Tessellation page component
function TessellationPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a stable random featured showcase for initial defaults (only called once)
  const getInitialShowcase = React.useMemo(() => {
    const featured = getFeaturedShowcase();
    const keys = Object.keys(featured);
    if (keys.length === 0) return null;
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return featured[randomKey];
  }, []); // Empty dependency array ensures this only runs once

  // State management with URL and localStorage persistence
  const [selectedPattern, setSelectedPattern] = useState(() => {
    const urlPattern = searchParams.get('pattern');
    const storagePattern = localStorage.getItem('tessellation-pattern');
    
    if (urlPattern || storagePattern) {
      return urlPattern || storagePattern;
    }
    
    // If no URL or storage pattern, use random featured showcase
    return getInitialShowcase ? getInitialShowcase.tilePattern : 'shadowBoxes';
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    const urlTheme = searchParams.get('theme');
    const storageTheme = localStorage.getItem('tessellation-theme');
    
    if (urlTheme || storageTheme) {
      return urlTheme || storageTheme;
    }
    
    // If no URL or storage theme, use random featured showcase
    return getInitialShowcase ? getInitialShowcase.colorTheme : 'basicBee';
  });

  const [tileSize, setTileSize] = useState(() => {
    const urlSize = searchParams.get('size');
    const storageSize = localStorage.getItem('tessellation-size');
    
    if (urlSize || storageSize) {
      return Number(urlSize) || Number(storageSize);
    }
    
    // If no URL or storage size, use random featured showcase
    return getInitialShowcase ? getInitialShowcase.tileSize : 20;
  });

  // Check for secret parameter to hide controls
  const hideControls = searchParams.get('secret') === 'true';
  
  // Check for gradient parameter
  const useGradient = searchParams.get('gradient') === 'true';

  // Check for texture parameter
  const textureKey = searchParams.get('texture') || null;

  // Parse tile adjustment parameters (support both numeric and effect patterns)
  const parseAdjustment = (param) => {
    if (!param) return { type: 'numeric', value: 0 };
    
    // Check if it's an effect pattern (contains colons)
    if (param.includes(':')) {
      const parts = param.split(':');
      const effectType = parts[0];
      const values = parts.slice(1).map(val => {
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      });
      
      return {
        type: effectType,
        values: values,
        raw: param
      };
    }
    
    // Plain numeric value
    const numValue = Number(param);
    return {
      type: 'numeric',
      value: isNaN(numValue) ? 0 : numValue,
      raw: param
    };
  };

  // Handle tile adjustments - URL parameters first, then initial showcase defaults
  const tileXAdjust = parseAdjustment(
    searchParams.get('tile_x_adjust') || 
    (getInitialShowcase && !searchParams.get('pattern') && !localStorage.getItem('tessellation-pattern') ? getInitialShowcase.tileXAdjust : null)
  );
  const tileYAdjust = parseAdjustment(
    searchParams.get('tile_y_adjust') || 
    (getInitialShowcase && !searchParams.get('pattern') && !localStorage.getItem('tessellation-pattern') ? getInitialShowcase.tileYAdjust : null)
  );

  // Update URL and localStorage when state changes
  const updatePattern = (pattern) => {
    setSelectedPattern(pattern);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('pattern', pattern);
    setSearchParams(newParams);
    localStorage.setItem('tessellation-pattern', pattern);
  };

  const updateTheme = (theme) => {
    setSelectedTheme(theme);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('theme', theme);
    setSearchParams(newParams);
    localStorage.setItem('tessellation-theme', theme);
  };

  const debounceTimerRef = useRef(null);
  
  const updateSize = (size) => {
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
    const newParams = new URLSearchParams(searchParams);
    
    if (xValue === '0' && yValue === '0') {
      // Remove adjustment parameters when set to none
      newParams.delete('tile_x_adjust');
      newParams.delete('tile_y_adjust');
    } else {
      if (xValue !== '0') newParams.set('tile_x_adjust', xValue);
      else newParams.delete('tile_x_adjust');
      
      if (yValue !== '0') newParams.set('tile_y_adjust', yValue);
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;