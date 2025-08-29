import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import Tesselate from './components/Tesselate';
import TessellationControls from './components/TessellationControls';
import Gallery from './components/Gallery';
import TileDesigns from './components/TileDesigns';
import ColorThemes from './components/ColorThemes';

// Tessellation page component
function TessellationPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State management with URL and localStorage persistence
  const [selectedPattern, setSelectedPattern] = useState(() => {
    return searchParams.get('pattern') || 
           localStorage.getItem('tessellation-pattern') || 
           'shadowBoxes';
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return searchParams.get('theme') || 
           localStorage.getItem('tessellation-theme') || 
           'basicBee';
  });

  const [tileSize, setTileSize] = useState(() => {
    const urlSize = searchParams.get('size');
    const storageSize = localStorage.getItem('tessellation-size');
    return Number(urlSize) || Number(storageSize) || 20;
  });

  // Check for secret parameter to hide controls
  const hideControls = searchParams.get('secret') === 'true';
  
  // Check for gradient parameter
  const useGradient = searchParams.get('gradient') === 'true';

  // Check for texture parameter
  const textureKey = searchParams.get('texture') || null;

  // Check for mosaic offset parameters
  const mosaicXOffset = Number(searchParams.get('mosaic_x_offset')) || 0;
  const mosaicYOffset = Number(searchParams.get('mosaic_y_offset')) || 0;

  // Check for tile offset parameters
  const tileXOffset = Number(searchParams.get('tile_x_offset')) || 0;
  const tileYOffset = Number(searchParams.get('tile_y_offset')) || 0;

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
        mosaic_x_adjust={mosaicXOffset}
        mosaic_y_adjust={mosaicYOffset}
        tile_x_adjust={tileXOffset}
        tile_y_adjust={tileYOffset}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;