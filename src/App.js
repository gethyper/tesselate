import React, { useState, useRef } from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import Tesselate from './components/Tesselate';
import TessellationControls from './components/TessellationControls';
import TileDesigns from './components/TileDesigns';
import ColorThemes from './components/ColorThemes';

// Main App component that handles state management
function AppContent() {
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

// Wrapper component to provide BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;