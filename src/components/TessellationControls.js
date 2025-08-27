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
  Collapse
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
  onSizeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewSize, setPreviewSize] = useState(tileSize);
  const [sizeTimeout, setSizeTimeout] = useState(null);

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

  const ColorPreview = ({ theme }) => (
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
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
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
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
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
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
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
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
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
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
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
            <svg width="24" height="24" viewBox="0 0 24 24" style={{paddingRight: '10px', verticalAlign: 'middle'}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="black" strokeWidth="1px" fill="none" /></svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" style={{paddingRight: '10px', verticalAlign: 'middle'}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="black" strokeWidth="1px" fill="none" /></svg>
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
            >
              {validThemes.map(([key, theme]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPreview theme={theme} />
                    <Typography variant="caption" sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}>
                      {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Size Input */}
          <TextField
            label="Size"
            type="number"
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
              step: 1
            }}
            size="small"
            fullWidth
            sx={{
              mb: 2,
              '& .MuiInputLabel-root': {
                fontFamily: 'Inter, sans-serif'
              },
              '& .MuiInputBase-input': {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem'
              }
            }}
          />
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TessellationControls;