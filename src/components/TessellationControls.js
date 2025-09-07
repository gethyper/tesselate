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
  DialogContent
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import TileDesigns from './TileDesigns';
import ColorThemes from './ColorThemes';

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
    
    // Define format dimensions
    switch (format) {
      case '1920x1080':
        width = 1920;
        height = 1080;
        filename = `tessellation_1920x1080_${selectedPattern}_${selectedTheme}.png`;
        break;
      case '1024x768':
        width = 1024;
        height = 768;
        filename = `tessellation_1024x768_${selectedPattern}_${selectedTheme}.png`;
        break;
      case '1080x1080':
        width = 1080;
        height = 1080;
        filename = `tessellation_1080x1080_${selectedPattern}_${selectedTheme}.png`;
        break;
      default:
        width = 1920;
        height = 1080;
        filename = `tessellation_1920x1080_${selectedPattern}_${selectedTheme}.png`;
    }

    // Create temporary canvas with specified dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    
    // Fill with background color or white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate scaling to fit the original canvas within the target dimensions
    const scale = Math.min(width / canvas.width, height / canvas.height);
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
    { label: 'Wave X', value: 'wave_x', baseX: 'wave:10:2', baseY: '0' },
    { label: 'Wave Y', value: 'wave_y', baseX: '0', baseY: 'wave:10:2' },
    { label: 'Wave X & Y', value: 'wave_xy', baseX: 'wave:10:2', baseY: 'wave:10:2' },
    { label: 'Wobble', value: 'wobble', baseX: 'random:3', baseY: 'random:3' }
    /*
    { label: 'Wave Y', value: 'wave_y', baseX: '0', baseY: 'wave:10:0.1' },
    { label: 'Wave X & Y', value: 'wave_xy', baseX: 'wave:10:0.1', baseY: 'wave:10:0.1' },
    { label: 'Spiral', value: 'spiral', baseX: 'spiral:5:0.05', baseY: 'spiral:5:0.05' },
    { label: 'Ripple', value: 'ripple', baseX: 'ripple:15:0.08', baseY: 'ripple:15:0.08' },
    { label: 'Wobble', value: 'wobble', baseX: 'random:3', baseY: 'random:3' }
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
        
        // Handle random effects (single parameter) vs wave effects (two parameters)
        if (effectType === 'random') {
          return `${effectType}:${safeParam1}`;
        } else {
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
        
        if (testValues.x === xRaw && testValues.y === yRaw) {
          // Update amount state to match the multiplier found
          if (adjustAmount !== `${mult}x`) {
            setAdjustAmount(`${mult}x`);
          }
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
                    const clampedValue = Math.max(10, Math.min(100, numValue));
                    onSizeChange(clampedValue);
                  }, 200);
                  setSizeTimeout(newTimeout);
                }
              }}
              inputProps={{
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

            {/* Amount Selector - remaining width */}
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
                          const param2 = parseFloat(parts[2]) * multiplier;
                          
                          // Check for NaN values and fallback to defaults
                          const safeParam1 = isNaN(param1) ? 0 : param1;
                          const safeParam2 = isNaN(param2) ? 0 : param2;
                          
                          return `${effectType}:${safeParam1}:${safeParam2}`;
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