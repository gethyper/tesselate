import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Collapse,
  Fade
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
  const [isDragging, setIsDragging] = useState(false);

  // Sync preview size when tileSize changes externally, but not while dragging
  useEffect(() => {
    if (!isDragging) {
      setPreviewSize(tileSize);
    }
  }, [tileSize, isDragging]);

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
      <Box sx={{ width: 16, height: 16, bgcolor: theme.light, border: '1px solid #ccc' }} />
      <Box sx={{ width: 16, height: 16, bgcolor: theme.medium, border: '1px solid #ccc' }} />
      <Box sx={{ width: 16, height: 16, bgcolor: theme.dark, border: '1px solid #ccc' }} />
      <Box sx={{ width: 16, height: 16, bgcolor: theme.accent, border: '1px solid #ccc' }} />
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
        <Fade in={!isOpen}>
          <Box
            onClick={() => setIsOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              px: 2,
              py: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.85)',
              },
            }}
          >
           
            <Typography variant="h6" sx={{ 
              fontFamily: 'Tourney, sans-serif', 
              fontWeight: 500, 
              letterSpacing: 1,
              flex: 1
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 20,6 20,18 12,22 4,18 4,6" stroke="black" strokeWidth="1px" fill="none" /></svg>
              TESSELLATIONS
            </Typography>
            <Menu />
          </Box>
        </Fade>
      )}

      <Collapse in={isOpen} timeout={300}>
        <Paper
          elevation={8}
          sx={{
            p: 2,
            minWidth: 300,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ 
              fontFamily: 'Tourney, sans-serif', 
              fontWeight: 500, 
              letterSpacing: 1 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 20,6 20,18 12,22 4,18 4,6" stroke="black" strokeWidth="1px" fill="none" /></svg>
              TESSELLATIONS
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Pattern Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="pattern-label">Pattern</InputLabel>
            <Select
              labelId="pattern-label"
              value={selectedPattern}
              label="Pattern"
              onChange={(e) => {
                onPatternChange(e.target.value);
              }}
            >
              {validPatterns.map(([key, design]) => (
                <MenuItem key={key} value={key}>
                  <Typography sx={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Theme Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="theme-label">Theme</InputLabel>
            <Select
              labelId="theme-label"
              value={selectedTheme}
              label="Theme"
              onChange={(e) => {
                onThemeChange(e.target.value);
              }}
            >
              {validThemes.map(([key, theme]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ColorPreview theme={theme} />
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Size Slider */}
          <Box sx={{ mb: 1 }}>
            <Typography gutterBottom>
              Size: {previewSize}
            </Typography>
            <Slider
              value={previewSize}
              onChange={(e, newValue) => {
                setPreviewSize(newValue);
                setIsDragging(true);
              }}
              onChangeCommitted={(e, newValue) => {
                setIsDragging(false);
                onSizeChange(newValue);
              }}
              min={5}
              max={100}
              step={1}
              marks={[
                { value: 5, label: '5' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100' }
              ]}
              sx={{ mb: 1 }}
            />
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TessellationControls;