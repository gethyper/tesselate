import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Menu, Close, Upload, Delete } from '@mui/icons-material';
import TileDesigns from './TileDesigns';
import ColorThemes from './ColorThemes';
import { shaders } from '../utils/shaders';

const TessellationControls = ({
  selectedPattern,
  selectedTheme,
  tileSize,
  onPatternChange,
  onThemeChange,
  onSizeChange,
  useGradient = false,
  textureKey = null,
  tileXAdjust = { type: 'numeric', value: 0 },
  tileYAdjust = { type: 'numeric', value: 0 },
  onAdjustChange,
  shadowOptions = null,
  onShadowChange,
  altColorFrequency = 0,
  onAltColorChange,
  altColorGradient = 'none',
  onAltColorGradientChange,
  altColorGradientIntensity = 1.0,
  onAltColorGradientIntensityChange,
  imageData = null,
  onImageUpload,
  onImageClear,
  imageDrivenMode = false,
  onImageDrivenModeChange,
  imageIntensity = 100,
  onImageIntensityChange,
  imageInvert = false,
  onImageInvertChange,
  shaderMode = false,
  onShaderModeChange,
  selectedShader = 'plasma',
  onShaderChange,
  shaderOpacity = 1.0,
  onShaderOpacityChange,
  autoOpenSettings = false
}) => {
  const [isOpen, setIsOpen] = useState(autoOpenSettings);
  const [previewSize, setPreviewSize] = useState(tileSize);
  const [sizeTimeout, setSizeTimeout] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(autoOpenSettings);
  const [adjustAmount, setAdjustAmount] = useState('1x');

  // Download functions
  const downloadImage = (format = '1920x1080') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    let filename, dataUrl, width, height;
    
    // Clean pattern and theme names (replace spaces with underscores)
    const cleanPattern = selectedPattern.replace(/\s+/g, '_');
    const cleanTheme = selectedTheme.replace(/\s+/g, '_');
    
    // Define format dimensions
    switch (format) {
      case '1920x1080':
        width = 1920;
        height = 1080;
        filename = `tessellation_1920x1080_${cleanPattern}_${cleanTheme}.png`;
        break;
      case '1024x768':
        width = 1024;
        height = 768;
        filename = `tessellation_1024x768_${cleanPattern}_${cleanTheme}.png`;
        break;
      case '1080x1080':
        width = 1080;
        height = 1080;
        filename = `tessellation_1080x1080_${cleanPattern}_${cleanTheme}.png`;
        break;
      default:
        width = 1920;
        height = 1080;
        filename = `tessellation_1920x1080_${cleanPattern}_${cleanTheme}.png`;
    }

    // Create temporary canvas with specified dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    
    // Scale to fill entire canvas while maintaining aspect ratio (like CSS background-size: cover)
    const scale = Math.max(width / canvas.width, height / canvas.height);
    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const x = (width - scaledWidth) / 2;
    const y = (height - scaledHeight) / 2;
    
    ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
    
    dataUrl = tempCanvas.toDataURL('image/png');

    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    // Close the dialog
    setDownloadDialogOpen(false);
  };

  const handleDownloadDialogOpen = () => {
    setDownloadDialogOpen(true);
  };

  const handleDownloadDialogClose = () => {
    setDownloadDialogOpen(false);
    setShowSettings(false); // Reset settings visibility when closing
  };

  // Keyboard shortcut for showing settings (Spacebar)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (downloadDialogOpen && event.code === 'Space') {
        event.preventDefault();
        setShowSettings(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [downloadDialogOpen]);

  // Sync preview size when tileSize changes externally, but not while typing
  useEffect(() => {
    if (!sizeTimeout) {
      setPreviewSize(tileSize);
    }
  }, [tileSize, sizeTimeout]);

  // Filter out empty or incomplete themes
  const validThemes = Object.entries(ColorThemes).filter(([key, theme]) => 
    theme && 
    theme.light && 
    theme.medium && 
    theme.dark && 
    theme.accent &&
    theme.light !== "" && 
    theme.medium !== "" && 
    theme.dark !== "" && 
    theme.accent !== ""
  );

  // Filter out empty tile patterns
  const validPatterns = Object.entries(TileDesigns).filter(([key, design]) => 
    design && 
    design.tilePattern && 
    design.tilePattern.length > 0
  );

  // Get the current theme's dark color
  const currentTheme = ColorThemes[selectedTheme];
  const themeColor = currentTheme?.dark || 'rgba(25, 118, 210, 0.8)';

  // Get multiplier from amount
  const getMultiplier = () => {
    return parseInt(adjustAmount.replace('x', ''));
  };

  // Greatest hits adjust tile options (base values, will be multiplied by amount)
  const adjustOptions = [
    { label: 'None', value: 'none', baseX: '0', baseY: '0' },
    { label: 'Shift X', value: 'shift_x', baseX: '5', baseY: '0' },
    { label: 'Shift Y', value: 'shift_y', baseX: '0', baseY: '5' },
    { label: 'Shift X & Y', value: 'shift_xy', baseX: '5', baseY: '5' },
    { label: 'Alt Columns', value: 'alt_columns', baseX: 'shiftx:10:2', baseY: '0' },
    { label: 'Alt Rows', value: 'alt_rows', baseX: '0', baseY: 'shifty:10:2' },
    { label: 'Alt Columns & Rows', value: 'alt_both', baseX: 'shiftx:10:2', baseY: 'shifty:10:2' },
    { label: 'Wave X', value: 'wave_x', baseX: 'wave:10:2', baseY: '0' },
    { label: 'Wave Y', value: 'wave_y', baseX: '0', baseY: 'wave:10:2' },
    { label: 'Wave X & Y', value: 'wave_xy', baseX: 'wave:10:2', baseY: 'wave:10:2' },
    { label: 'Wobble', value: 'wobble', baseX: 'random:10', baseY: 'random:10' }
    /*
    { label: 'Wave Y', value: 'wave_y', baseX: '0', baseY: 'wave:10:0.1' },
    { label: 'Wave X & Y', value: 'wave_xy', baseX: 'wave:10:0.1', baseY: 'wave:10:0.1' },
    { label: 'Spiral', value: 'spiral', baseX: 'spiral:5:0.05', baseY: 'spiral:5:0.05' },
    { label: 'Ripple', value: 'ripple', baseX: 'ripple:15:0.08', baseY: 'ripple:15:0.08' },
    { label: 'Wobble', value: 'wobble', baseX: 'random:10', baseY: 'random:10' }
     */
  ];

  // Apply multiplier to adjustment values
  const getAdjustedValues = (option) => {
    const multiplier = getMultiplier();
    
    if (option.value === 'none') {
      return { x: '0', y: '0' };
    }

    const applyMultiplier = (value) => {
      if (value === '0') return '0';
      
      if (value.includes(':')) {
        // Handle effect patterns like "wave:10:0.1" or "random:3"
        const parts = value.split(':');
        const effectType = parts[0];
        const param1 = parseFloat(parts[1]) * multiplier;
        
        // Check for NaN values and fallback to defaults
        const safeParam1 = isNaN(param1) ? 0 : param1;
        
        // Handle different effect types
        if (effectType === 'random') {
          // Random effects use single parameter (intensity)
          return `${effectType}:${safeParam1}`;
        } else if (effectType === 'shiftx' || effectType === 'shifty') {
          // Shift effects use two parameters (offset:interval)
          // For shift effects, only multiply the offset (first parameter), keep interval unchanged
          const interval = parts[2] || 2; // Default interval of 2
          return `${effectType}:${safeParam1}:${interval}`;
        } else {
          // Wave and other effects use two parameters (both multiplied)
          const param2 = parseFloat(parts[2]) * multiplier;
          const safeParam2 = isNaN(param2) ? 0 : param2;
          return `${effectType}:${safeParam1}:${safeParam2}`;
        }
      } else {
        // Handle simple numeric values
        const numValue = parseFloat(value) * multiplier;
        return isNaN(numValue) ? '0' : numValue.toString();
      }
    };

    return {
      x: applyMultiplier(option.baseX),
      y: applyMultiplier(option.baseY)
    };
  };

  // Get current adjust option
  const getCurrentAdjustOption = () => {
    const xRaw = tileXAdjust.raw || '0';
    const yRaw = tileYAdjust.raw || '0';
    
    // Debug: Log the raw values we're trying to match
    console.log('Matching against raw values:', { xRaw, yRaw });
    
    // Check if current values match any option at any multiplier level
    for (const option of adjustOptions) {
      for (const mult of [1, 2, 3, 5, 10, 20, -1, -2, -5, -10]) {
        // Calculate adjusted values using the specific multiplier being tested
        const applyTestMultiplier = (value) => {
          if (value === '0') return '0';
          
          if (value.includes(':')) {
            const parts = value.split(':');
            const effectType = parts[0];
            const param1 = parseFloat(parts[1]) * mult;
            
            // Handle random effects (single parameter) vs wave effects (two parameters)
            if (effectType === 'random') {
              return `${effectType}:${param1}`;
            } else {
              const param2 = parseFloat(parts[2]) * mult;
              return `${effectType}:${param1}:${param2}`;
            }
          } else {
            return (parseFloat(value) * mult).toString();
          }
        };

        const testValues = {
          x: applyTestMultiplier(option.baseX),
          y: applyTestMultiplier(option.baseY)
        };
        
        // Debug: Log test values for wobble option
        if (option.value === 'wobble') {
          console.log(`Testing wobble with ${mult}x:`, testValues, 'vs raw:', { xRaw, yRaw });
        }
        
        // More robust comparison that handles floating point precision
        const valuesMatch = (testValues.x === xRaw && testValues.y === yRaw) ||
                           (testValues.x.toString() === xRaw && testValues.y.toString() === yRaw);
        
        if (valuesMatch) {
          // Update amount state to match the multiplier found
          if (adjustAmount !== `${mult}x`) {
            setAdjustAmount(`${mult}x`);
          }
          console.log(`Matched ${option.value} with ${mult}x multiplier`);
          return option.value;
        }
      }
    }
    return 'custom';
  };

  // Generate current URL for sharing
  const generateCurrentUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('pattern', selectedPattern);
    url.searchParams.set('theme', selectedTheme);
    url.searchParams.set('size', tileSize.toString());
    
    if (useGradient) url.searchParams.set('gradient', 'true');
    if (textureKey) url.searchParams.set('texture', textureKey);
    if (tileXAdjust.raw && tileXAdjust.raw !== '0') url.searchParams.set('tile_x_adjust', tileXAdjust.raw);
    if (tileYAdjust.raw && tileYAdjust.raw !== '0') url.searchParams.set('tile_y_adjust', tileYAdjust.raw);
    
    if (shadowOptions) {
      url.searchParams.set('shadow', 'true');
    }
    
    return url.toString();
  };

  const ColorPreview = ({ theme, isFirstItem = false }) => (
    <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
      <Box 
        sx={{ 
          width: 16, 
          height: 16, 
          bgcolor: theme.light, 
          border: '1px solid #ccc',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1000,
            position: 'relative',
            '&::after': {
              content: `"Light: ${theme.light}"`,
              position: 'absolute',
              top: isFirstItem ? '25px' : '-30px',
              left: '12px',
              transform: 'none',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }
          }
        }} 
      />
      <Box 
        sx={{ 
          width: 16, 
          height: 16, 
          bgcolor: theme.medium, 
          border: '1px solid #ccc',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1000,
            position: 'relative',
            '&::after': {
              content: `"Medium: ${theme.medium}"`,
              position: 'absolute',
              top: isFirstItem ? '25px' : '-30px',
              left: '12px',
              transform: 'none',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }
          }
        }} 
      />
      <Box 
        sx={{ 
          width: 16, 
          height: 16, 
          bgcolor: theme.dark, 
          border: '1px solid #ccc',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1000,
            position: 'relative',
            '&::after': {
              content: `"Dark: ${theme.dark}"`,
              position: 'absolute',
              top: isFirstItem ? '25px' : '-30px',
              left: '12px',
              transform: 'none',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }
          }
        }} 
      />
      <Box 
        sx={{ 
          width: 16, 
          height: 16, 
          bgcolor: theme.accent, 
          border: '1px solid #ccc',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1000,
            position: 'relative',
            '&::after': {
              content: `"Accent: ${theme.accent}"`,
              position: 'absolute',
              top: isFirstItem ? '25px' : '-30px',
              left: '12px',
              transform: 'none',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }
          }
        }} 
      />
      <Box 
        sx={{ 
          width: 16, 
          height: 16, 
          bgcolor: theme.bg || '#transparent', 
          border: '1px solid #ccc',
          cursor: 'pointer',
          opacity: theme.bg ? 1 : 0.3,
          '&:hover': {
            transform: 'scale(1.2)',
            zIndex: 1000,
            position: 'relative',
            '&::after': {
              content: theme.bg ? `"Background: ${theme.bg}"` : '"Background: N/A"',
              position: 'absolute',
              top: isFirstItem ? '25px' : '-30px',
              left: '12px',
              transform: 'none',
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }
          }
        }} 
      />
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        // Center on mobile devices
        '@media (max-width: 768px)': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          bottom: 20,
        },
      }}
    >
      {!isOpen && (
        <Box
          onClick={() => setIsOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid white',
            borderRadius: 2,
            px: 2,
            py: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.75)',
            },
          }}
        >
         
          <Typography variant="h6" sx={{ 
            fontFamily: 'Tourney, sans-serif', 
            fontWeight: 500, 
            letterSpacing: 1,
            flex: 1
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" style={{paddingRight: '10px', verticalAlign: 'middle', marginTop:"-3px"}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="black" strokeWidth="1px" fill="none" /></svg>
            TESSELLATIONS
          </Typography>
          <Menu sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        </Box>
      )}

      <Collapse in={isOpen} timeout={200} sx={{ 
        '& .MuiCollapse-wrapper': {
          transition: 'all 0.2s ease-in-out',
        },
        '& .MuiCollapse-wrapperInner': {
          transition: 'all 0.2s ease-in-out',
        }
      }}>
        <Paper
          elevation={8}
          sx={{
            p: 2,
            minWidth: 210,
            maxWidth: 300,
            // Mobile responsive width
            '@media (max-width: 768px)': {
              minWidth: 280,
              maxWidth: '90vw',
            },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(240, 240, 255, 0.75))',
            backdropFilter: 'blur(10px)',
            border: '1px solid white',
            transition: 'all 0.2s ease-in-out',
            '& .MuiFormControl-root': {
              transition: 'all 0.2s ease-in-out',
            },
            '& .MuiSelect-select': {
              transition: 'all 0.2s ease-in-out',
            },
            '& .MuiTextField-root': {
              transition: 'all 0.2s ease-in-out',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ 
              fontFamily: 'Tourney, sans-serif', 
              fontWeight: 500, 
              letterSpacing: 1 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{paddingRight: '10px', verticalAlign: 'middle', marginTop:"-3px"}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="black" strokeWidth="1px" fill="none" /></svg>
              TESSELLATIONS
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Pattern Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="pattern-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Pattern</InputLabel>
            <Select
              labelId="pattern-label"
              value={selectedPattern}
              label="Pattern"
              size="small"
              onChange={(e) => {
                onPatternChange(e.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }
                }
              }}
              sx={{
                '& .MuiSelect-select': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  padding: '8.5px 14px'
                }
              }}
            >
              {validPatterns.map(([key, design]) => (
                <MenuItem key={key} value={key}>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Theme Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="theme-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Theme</InputLabel>
            <Select
              labelId="theme-label"
              value={selectedTheme}
              label="Theme"
              size="small"
              onChange={(e) => {
                onThemeChange(e.target.value);
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                  }
                }
              }}
              sx={{
                '& .MuiSelect-select': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  padding: '11px 14px'
                }
              }}
            >
              {validThemes.map(([key, theme], index) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPreview theme={theme} isFirstItem={index === 0} />
                    <Typography variant="caption" sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}>
                      {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Size and Adjust Tiles Row */}
          <Box sx={{ display: 'flex', gap: '2%', mb: 2 }}>
            {/* Size Input - 1/3 width */}
            <TextField
              label="Size"
              type="number"
              size="small"
              value={previewSize}
              onChange={(e) => {
                const inputValue = e.target.value;
                
                // Allow empty input for better UX while typing
                if (inputValue === '') {
                  setPreviewSize('');
                  return;
                }
                
                const numValue = parseInt(inputValue);
                if (!isNaN(numValue)) {
                  setPreviewSize(numValue);
                  
                  // Clear existing timeout
                  if (sizeTimeout) {
                    clearTimeout(sizeTimeout);
                  }
                  
                  // Set new timeout - only clamp when sending to parent
                  const newTimeout = setTimeout(() => {
                    const clampedValue = Math.max(5, Math.min(100, numValue));
                    onSizeChange(clampedValue);
                  }, 200);
                  setSizeTimeout(newTimeout);
                }
              }}
              inputProps={{
                min: 5,
                max: 100,
                step: 1
              }}
              sx={{
                flex: '0 0 27%',
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem' 

                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  padding: '10.5px 14px'

                },
                '& .MuiInputBase-root': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem'

                }
              }}
            />

            {/* Adjust Tiles Selector - 45% width */}
            <FormControl sx={{ flex: '0 0 45%' }}>
              <InputLabel id="adjust-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Adjust</InputLabel>
              <Select
                labelId="adjust-label"
                value={getCurrentAdjustOption()}
                label="Adjust"
                size="small"
                onChange={(e) => {
                  const selectedOption = adjustOptions.find(opt => opt.value === e.target.value);
                  if (selectedOption && onAdjustChange) {
                    const adjustedValues = getAdjustedValues(selectedOption);
                    onAdjustChange(adjustedValues.x, adjustedValues.y);
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                    }
                  }
                }}
                sx={{
                  '& .MuiSelect-select': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    padding: '8.5px 14px'
                  }
                }}
              >
                {adjustOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Typography variant="caption" sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}>
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
                <MenuItem value="custom">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                    Custom
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Amount Selector - remaining width - hide when custom is selected */}
            {getCurrentAdjustOption() !== 'custom' && (
              <FormControl sx={{ flex: '1' }}>
                <InputLabel id="amount-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Amount</InputLabel>
                <Select
                  labelId="amount-label"
                  value={adjustAmount}
                  label="Amount"
                  size="small"
                onChange={(e) => {
                  setAdjustAmount(e.target.value);
                  
                  // If there's a current adjustment selected, reapply it with the new amount
                  const currentOption = getCurrentAdjustOption();
                  if (currentOption !== 'custom' && onAdjustChange) {
                    const selectedOption = adjustOptions.find(opt => opt.value === currentOption);
                    if (selectedOption) {
                      // Update the amount first, then calculate adjusted values
                      const tempAmount = e.target.value;
                      const multiplier = parseInt(tempAmount.replace('x', ''));
                      
                      const applyMultiplier = (value) => {
                        if (value === '0') return '0';
                        
                        if (value.includes(':')) {
                          const parts = value.split(':');
                          const effectType = parts[0];
                          const param1 = parseFloat(parts[1]) * multiplier;
                          
                          // Check for NaN values and fallback to defaults
                          const safeParam1 = isNaN(param1) ? 0 : param1;
                          
                          // Handle different effect types (same logic as getAdjustedValues)
                          if (effectType === 'random') {
                            return `${effectType}:${safeParam1}`;
                          } else if (effectType === 'shiftx' || effectType === 'shifty') {
                            // For shift effects, only multiply the offset, keep interval unchanged
                            const interval = parts[2] || 2;
                            return `${effectType}:${safeParam1}:${interval}`;
                          } else {
                            // Wave and other effects use two parameters (both multiplied)
                            const param2 = parseFloat(parts[2]) * multiplier;
                            const safeParam2 = isNaN(param2) ? 0 : param2;
                            return `${effectType}:${safeParam1}:${safeParam2}`;
                          }
                        } else {
                          const numValue = parseFloat(value) * multiplier;
                          return isNaN(numValue) ? '0' : numValue.toString();
                        }
                      };

                      const adjustedValues = {
                        x: applyMultiplier(selectedOption.baseX),
                        y: applyMultiplier(selectedOption.baseY)
                      };
                      
                      onAdjustChange(adjustedValues.x, adjustedValues.y);
                    }
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                    }
                  }
                }}
                sx={{
                  '& .MuiSelect-select': {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    padding: '8.5px 14px'
                  }
                }}
              >
                <MenuItem value="1x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    1x
                  </Typography>
                </MenuItem>
                <MenuItem value="2x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    2x
                  </Typography>
                </MenuItem>
                <MenuItem value="3x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    3x
                  </Typography>
                </MenuItem>
                <MenuItem value="5x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    5x
                  </Typography>
                </MenuItem>
                <MenuItem value="10x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    10x
                  </Typography>
                </MenuItem>
                <MenuItem value="20x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    20x
                  </Typography>
                </MenuItem>
                <MenuItem value="-1x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    -1x
                  </Typography>
                </MenuItem>
                <MenuItem value="-2x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    -2x
                  </Typography>
                </MenuItem>
                <MenuItem value="-5x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    -5x
                  </Typography>
                </MenuItem>
                <MenuItem value="-10x">
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    -10x
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>
            )}
          </Box>

          {/* Alt Color Frequency Slider */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 1 }}>
              Alt Color Frequency: {altColorFrequency}%
            </Typography>
            <Slider
              value={altColorFrequency}
              onChange={(e, value) => {
                if (onAltColorChange) {
                  onAltColorChange(value);
                }
              }}
              min={0}
              max={99}
              step={1}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' }
              ]}
              size="small"
              sx={{
                color: themeColor,
                '& .MuiSlider-markLabel': {
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.65rem'
                }
              }}
            />
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '0.7rem', color: 'text.secondary' }}>
              Random color inversion splotches
            </Typography>
          </Box>

          {/* Alt Color Gradient Type */}
          {altColorFrequency > 0 && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="gradient-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Gradient Type</InputLabel>
                <Select
                  labelId="gradient-label"
                  value={altColorGradient}
                  label="Gradient Type"
                  size="small"
                  onChange={(e) => {
                    if (onAltColorGradientChange) {
                      onAltColorGradientChange(e.target.value);
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                      }
                    }
                  }}
                  sx={{
                    '& .MuiSelect-select': {
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      padding: '8.5px 14px'
                    }
                  }}
                >
                  <MenuItem value="none">None (Uniform)</MenuItem>
                  <MenuItem value="vertical">Vertical (Top → Bottom)</MenuItem>
                  <MenuItem value="vertical-reverse">Vertical Reverse (Bottom → Top)</MenuItem>
                  <MenuItem value="horizontal">Horizontal (Left → Right)</MenuItem>
                  <MenuItem value="horizontal-reverse">Horizontal Reverse (Right → Left)</MenuItem>
                  <MenuItem value="radial-out">Radial Out (Center → Edge)</MenuItem>
                  <MenuItem value="radial-in">Radial In (Edge → Center)</MenuItem>
                  <MenuItem value="diagonal">Diagonal (TL → BR)</MenuItem>
                  <MenuItem value="diagonal-reverse">Diagonal Reverse (TR → BL)</MenuItem>
                </Select>
              </FormControl>

              {/* Gradient Intensity Slider */}
              {altColorGradient !== 'none' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 1 }}>
                    Gradient Intensity: {altColorGradientIntensity.toFixed(1)}x
                  </Typography>
                  <Slider
                    value={altColorGradientIntensity}
                    onChange={(e, value) => {
                      if (onAltColorGradientIntensityChange) {
                        onAltColorGradientIntensityChange(value);
                      }
                    }}
                    min={0.1}
                    max={5.0}
                    step={0.1}
                    marks={[
                      { value: 0.5, label: '0.5x' },
                      { value: 1.0, label: '1x' },
                      { value: 2.0, label: '2x' },
                      { value: 4.0, label: '4x' }
                    ]}
                    size="small"
                    sx={{
                      color: themeColor,
                      '& .MuiSlider-markLabel': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem'
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '0.7rem', color: 'text.secondary' }}>
                    Higher = steeper gradient
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Visual Modes Section */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, display: 'block', mb: 1.5 }}>
              Visual Modes
            </Typography>

            {/* Mode Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant={!imageDrivenMode && !shaderMode ? "contained" : "outlined"}
                size="small"
                fullWidth
                onClick={() => {
                  if (imageDrivenMode) onImageDrivenModeChange(false);
                  if (shaderMode) onShaderModeChange(false);
                }}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  py: 0.5,
                  bgcolor: (!imageDrivenMode && !shaderMode) ? themeColor : 'transparent',
                  borderColor: themeColor,
                  color: (!imageDrivenMode && !shaderMode) ? 'white' : themeColor,
                  '&:hover': {
                    bgcolor: (!imageDrivenMode && !shaderMode) ? themeColor : `${themeColor}10`,
                    borderColor: themeColor
                  }
                }}
              >
                Normal
              </Button>
              <Button
                variant={imageDrivenMode ? "contained" : "outlined"}
                size="small"
                fullWidth
                onClick={() => {
                  if (shaderMode) onShaderModeChange(false);
                  onImageDrivenModeChange(!imageDrivenMode);
                }}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  py: 0.5,
                  bgcolor: imageDrivenMode ? themeColor : 'transparent',
                  borderColor: themeColor,
                  color: imageDrivenMode ? 'white' : themeColor,
                  '&:hover': {
                    bgcolor: imageDrivenMode ? themeColor : `${themeColor}10`,
                    borderColor: themeColor
                  }
                }}
              >
                Image
              </Button>
              <Button
                variant={shaderMode ? "contained" : "outlined"}
                size="small"
                fullWidth
                onClick={() => {
                  if (imageDrivenMode) onImageDrivenModeChange(false);
                  onShaderModeChange(!shaderMode);
                }}
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  py: 0.5,
                  bgcolor: shaderMode ? themeColor : 'transparent',
                  borderColor: themeColor,
                  color: shaderMode ? 'white' : themeColor,
                  '&:hover': {
                    bgcolor: shaderMode ? themeColor : `${themeColor}10`,
                    borderColor: themeColor
                  }
                }}
              >
                Shader
              </Button>
            </Box>

            {/* Shader Mode Controls */}
            {shaderMode && (
              <Box sx={{ mb: 2 }}>
                {/* Shader Selector */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="shader-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Shader Effect</InputLabel>
                  <Select
                    labelId="shader-label"
                    value={selectedShader}
                    label="Shader Effect"
                    size="small"
                    onChange={(e) => {
                      if (onShaderChange) {
                        onShaderChange(e.target.value);
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                        }
                      }
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        padding: '8.5px 14px'
                      }
                    }}
                  >
                    {Object.entries(shaders)
                      .filter(([key]) => key !== 'none')
                      .map(([key, shader]) => (
                        <MenuItem key={key} value={key}>
                          <Box>
                            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              {shader.name}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: 'text.secondary', display: 'block' }}>
                              {shader.description}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {/* Shader Opacity Slider */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 1 }}>
                    Shader Opacity: {Math.round(shaderOpacity * 100)}%
                  </Typography>
                  <Slider
                    value={shaderOpacity}
                    onChange={(e, value) => {
                      if (onShaderOpacityChange) {
                        onShaderOpacityChange(value);
                      }
                    }}
                    min={0}
                    max={1}
                    step={0.01}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 0.5, label: '50%' },
                      { value: 1, label: '100%' }
                    ]}
                    size="small"
                    sx={{
                      color: themeColor,
                      '& .MuiSlider-markLabel': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem'
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '0.7rem', color: 'text.secondary' }}>
                    Blend shader with background
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Image Mode Controls */}
            {imageDrivenMode && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, display: 'block', mb: 1 }}>
                  Image-Driven Patterns
                </Typography>

                {/* Upload Button */}
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload />}
                  sx={{
                    mb: 1,
                    borderColor: themeColor,
                    color: themeColor,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: themeColor,
                      bgcolor: `${themeColor}10`
                    }
                  }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && onImageUpload) {
                        onImageUpload(file);
                      }
                    }}
                  />
                </Button>

                {/* Image Preview and Controls */}
                {imageData && (
                  <Box sx={{ mb: 2 }}>
                    {/* Preview */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 80,
                        mb: 1,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.1)',
                        position: 'relative',
                        backgroundImage: `url(${imageData.previewUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={onImageClear}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,1)'
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Intensity Slider */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 1 }}>
                        Image Intensity: {imageIntensity}%
                      </Typography>
                      <Slider
                        value={imageIntensity}
                        onChange={(e, value) => {
                          if (onImageIntensityChange) {
                            onImageIntensityChange(value);
                          }
                        }}
                        min={0}
                        max={100}
                        step={1}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' }
                        ]}
                        size="small"
                        sx={{
                          color: themeColor,
                          '& .MuiSlider-markLabel': {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.65rem'
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '0.7rem', color: 'text.secondary' }}>
                        Strength of image effect
                      </Typography>
                    </Box>

                    {/* Invert Checkbox */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={imageInvert}
                          onChange={(e) => {
                            if (onImageInvertChange) {
                              onImageInvertChange(e.target.checked);
                            }
                          }}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: themeColor,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: themeColor,
                            }
                          }}
                        />
                      }
                      label={
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                          Invert (bright=complex)
                        </Typography>
                      }
                    />

                    <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: '0.7rem', color: 'text.secondary', display: 'block', mt: 1 }}>
                      Dark areas → more alt colors{imageInvert ? ' (inverted)' : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Download Button */}
          <Button
            id="download-button"
            variant="contained"
            onClick={handleDownloadDialogOpen}
            fullWidth
            sx={{
              mt: 1,
              bgcolor: themeColor,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              '&:hover': {
                bgcolor: themeColor,
                opacity: 0.9,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              },
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              textTransform: 'none'
            }}
          >
            Download
          </Button>

          {/* Download Dialog */}
          <Dialog 
            open={downloadDialogOpen} 
            onClose={handleDownloadDialogClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                borderRadius: 3
              }
            }}
          >
            <DialogTitle sx={{ 
              fontFamily: 'Tourney, sans-serif', 
              fontWeight: 500,
              letterSpacing: 1,
              textAlign: 'left',
              pb: 1,
              position: 'relative'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{paddingRight: '8px', verticalAlign: 'middle', marginTop:"-2px"}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="currentColor" strokeWidth="1px" fill="none" /></svg>
              TESSELLATIONS
              <IconButton
                onClick={handleDownloadDialogClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'text.secondary'
                }}
                size="small"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              {/* Share URL First */}
              <Box sx={{ mb: 3, mt: 2 }}>
                <Typography variant="caption" sx={{ 
                  fontFamily: 'Inter, sans-serif', 
                  fontWeight: 500,
                  mb: 1,
                  display: 'block'
                }}>
                  Share this URL
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={generateCurrentUrl()}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      bgcolor: 'rgba(255, 255, 255, 0.8)'
                    }
                  }}
                  onClick={(e) => e.target.select()}
                />
              </Box>

              {/* Download Options */}
              <Typography variant="caption" sx={{ 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 500,
                mb: 1,
                display: 'block'
              }}>
                Download image
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 0 }}>
                <Button
                  variant="contained"
                  onClick={() => downloadImage('1920x1080')}
                  sx={{
                    flex: 1,
                    bgcolor: themeColor,
                    '&:hover': {
                      bgcolor: themeColor,
                      opacity: 0.9,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    },
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  1920×1080
                </Button>
                <Button
                  variant="contained"
                  onClick={() => downloadImage('1080x1080')}
                  sx={{
                    flex: 1,
                    bgcolor: themeColor,
                    '&:hover': {
                      bgcolor: themeColor,
                      opacity: 0.9,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    },
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  1080×1080
                </Button>
                <Button
                  variant="contained"
                  onClick={() => downloadImage('1024x768')}
                  sx={{
                    flex: 1,
                    bgcolor: themeColor,
                    '&:hover': {
                      bgcolor: themeColor,
                      opacity: 0.9,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    },
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    textTransform: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  1024×768
                </Button>
              </Box>

              {/* Current Settings Display - Hidden by default, shown with spacebar */}
              {showSettings && (
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(248, 250, 252, 0.8)',
                  border: '1px solid rgba(226, 232, 240, 0.5)'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 600, 
                    mb: 1.5,
                    color: 'text.secondary'
                  }}>
                    Current Settings
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Pattern
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                        {selectedPattern.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Theme
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                        {selectedTheme.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Size
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                        {tileSize}px
                      </Typography>
                    </Box>
                    {useGradient && (
                      <Box>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Gradient
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          Enabled
                        </Typography>
                      </Box>
                    )}
                    {textureKey && (
                      <Box>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Texture
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {textureKey}
                        </Typography>
                      </Box>
                    )}
                    {(tileXAdjust.raw && tileXAdjust.raw !== '0') && (
                      <Box>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          X Adjust
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {tileXAdjust.raw}
                        </Typography>
                      </Box>
                    )}
                    {(tileYAdjust.raw && tileYAdjust.raw !== '0') && (
                      <Box>
                        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Y Adjust
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                          {tileYAdjust.raw}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}

            </DialogContent>
          </Dialog>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TessellationControls;