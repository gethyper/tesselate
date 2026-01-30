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
  Slider
} from '@mui/material';
import { Menu, Close } from '@mui/icons-material';
import { PROGRAMMATIC_GENERATORS } from '../hooks/useP5ProgrammaticGrid';
import ColorThemes from './ColorThemes';

const ProgrammaticGridControls = ({
  generatorName,
  setGeneratorName,
  generatorOptions,
  setGeneratorOptions,
  tileStyle,
  setTileStyle,
  width,
  setWidth,
  height,
  setHeight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(width);
  const [previewHeight, setPreviewHeight] = useState(height);
  const [sizeTimeout, setSizeTimeout] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  const currentGenerator = PROGRAMMATIC_GENERATORS[generatorName];

  // Sync preview sizes when props change externally
  useEffect(() => {
    if (!sizeTimeout) {
      setPreviewWidth(width);
      setPreviewHeight(height);
    }
  }, [width, height, sizeTimeout]);

  // Helper to update specific generator options
  const updateOption = (key, value) => {
    setGeneratorOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Download functions
  const downloadImage = (format = '1920x1080') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    let filename, dataUrl, w, h;

    const cleanGenerator = generatorName.replace(/\s+/g, '_');

    switch (format) {
      case '1920x1080':
        w = 1920;
        h = 1080;
        filename = `programmatic_grid_1920x1080_${cleanGenerator}.png`;
        break;
      case '1024x768':
        w = 1024;
        h = 768;
        filename = `programmatic_grid_1024x768_${cleanGenerator}.png`;
        break;
      case '1080x1080':
        w = 1080;
        h = 1080;
        filename = `programmatic_grid_1080x1080_${cleanGenerator}.png`;
        break;
      default:
        w = 1920;
        h = 1080;
        filename = `programmatic_grid_1920x1080_${cleanGenerator}.png`;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const ctx = tempCanvas.getContext('2d');

    const scale = Math.max(w / canvas.width, h / canvas.height);
    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const x = (w - scaledWidth) / 2;
    const y = (h - scaledHeight) / 2;

    ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
    dataUrl = tempCanvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();

    setDownloadDialogOpen(false);
  };

  const generateCurrentUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname + '#/programmatic');
    const params = new URLSearchParams();

    params.set('generator', generatorName);
    params.set('width', width.toString());
    params.set('height', height.toString());
    if (tileStyle && tileStyle !== 'triangles') params.set('style', tileStyle);
    if (Object.keys(generatorOptions).length > 0) {
      params.set('options', encodeURIComponent(JSON.stringify(generatorOptions)));
    }

    url.search = params.toString();
    return url.toString();
  };

  // Filter out empty or incomplete themes
  const validThemes = Object.entries(ColorThemes).filter(([key, theme]) =>
    theme &&
    theme.light &&
    theme.medium &&
    theme.dark &&
    theme.accent
  );

  const ColorPreview = ({ theme, isFirstItem = false }) => (
    <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
      {['light', 'medium', 'dark', 'accent'].map((colorKey) => (
        <Box
          key={colorKey}
          sx={{
            width: 16,
            height: 16,
            bgcolor: theme[colorKey],
            border: '1px solid #ccc',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.2)',
              zIndex: 1000,
              position: 'relative',
              '&::after': {
                content: `"${colorKey}: ${theme[colorKey]}"`,
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
      ))}
    </Box>
  );

  // Get the current theme's dark color
  const themeColor = 'rgba(25, 118, 210, 0.8)';

  // Render generator-specific options
  const renderGeneratorOptions = () => {
    switch (generatorName) {
      case 'perlinColors':
      case 'perlinTriangles':
      case 'turbulence':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
              Scale: {generatorOptions.scale || 0.1}
            </Typography>
            <Slider
              value={generatorOptions.scale || 0.1}
              min={0.01}
              max={0.5}
              step={0.01}
              onChange={(e, value) => updateOption('scale', value)}
              size="small"
            />
          </Box>
        );

      case 'sineWaves':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Frequency: {generatorOptions.frequency || 0.5}
              </Typography>
              <Slider
                value={generatorOptions.frequency || 0.5}
                min={0.1}
                max={2}
                step={0.1}
                onChange={(e, value) => updateOption('frequency', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Amplitude: {generatorOptions.amplitude || 2}
              </Typography>
              <Slider
                value={generatorOptions.amplitude || 2}
                min={1}
                max={5}
                step={0.5}
                onChange={(e, value) => updateOption('amplitude', value)}
                size="small"
              />
            </Box>
          </>
        );

      case 'concentricCircles':
      case 'distanceGradient':
      case 'quadrants':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center X: {generatorOptions.centerX || 15}
              </Typography>
              <Slider
                value={generatorOptions.centerX || 15}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('centerX', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center Y: {generatorOptions.centerY || 15}
              </Typography>
              <Slider
                value={generatorOptions.centerY || 15}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('centerY', value)}
                size="small"
              />
            </Box>
            {generatorName === 'concentricCircles' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                  Frequency: {generatorOptions.frequency || 1}
                </Typography>
                <Slider
                  value={generatorOptions.frequency || 1}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onChange={(e, value) => updateOption('frequency', value)}
                  size="small"
                />
              </Box>
            )}
            {generatorName === 'distanceGradient' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                  Max Distance: {generatorOptions.maxDist || 20}
                </Typography>
                <Slider
                  value={generatorOptions.maxDist || 20}
                  min={5}
                  max={50}
                  step={1}
                  onChange={(e, value) => updateOption('maxDist', value)}
                  size="small"
                />
              </Box>
            )}
          </>
        );

      case 'interference':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center 1 X: {generatorOptions.center1X || 10}
              </Typography>
              <Slider
                value={generatorOptions.center1X || 10}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('center1X', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center 1 Y: {generatorOptions.center1Y || 10}
              </Typography>
              <Slider
                value={generatorOptions.center1Y || 10}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('center1Y', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center 2 X: {generatorOptions.center2X || 20}
              </Typography>
              <Slider
                value={generatorOptions.center2X || 20}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('center2X', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center 2 Y: {generatorOptions.center2Y || 20}
              </Typography>
              <Slider
                value={generatorOptions.center2Y || 20}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('center2Y', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Frequency: {generatorOptions.frequency || 0.5}
              </Typography>
              <Slider
                value={generatorOptions.frequency || 0.5}
                min={0.1}
                max={2}
                step={0.1}
                onChange={(e, value) => updateOption('frequency', value)}
                size="small"
              />
            </Box>
          </>
        );

      case 'diagonal':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
              Stripe Width: {generatorOptions.stripeWidth || 3}
            </Typography>
            <Slider
              value={generatorOptions.stripeWidth || 3}
              min={1}
              max={10}
              step={1}
              onChange={(e, value) => updateOption('stripeWidth', value)}
              size="small"
            />
          </Box>
        );

      case 'modulo':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Mod X: {generatorOptions.modX || 4}
              </Typography>
              <Slider
                value={generatorOptions.modX || 4}
                min={2}
                max={10}
                step={1}
                onChange={(e, value) => updateOption('modX', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Mod Y: {generatorOptions.modY || 4}
              </Typography>
              <Slider
                value={generatorOptions.modY || 4}
                min={2}
                max={10}
                step={1}
                onChange={(e, value) => updateOption('modY', value)}
                size="small"
              />
            </Box>
          </>
        );

      case 'voronoi':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
              Seed Points: {generatorOptions.numSeeds || 10}
            </Typography>
            <Slider
              value={generatorOptions.numSeeds || 10}
              min={3}
              max={20}
              step={1}
              onChange={(e, value) => updateOption('numSeeds', value)}
              size="small"
            />
          </Box>
        );

      case 'dottedDensity':
      case 'stippled':
      case 'crossHatch':
      case 'thresholdBlocks':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
              Scale: {generatorOptions.scale || 0.15}
            </Typography>
            <Slider
              value={generatorOptions.scale || 0.15}
              min={0.05}
              max={0.4}
              step={0.01}
              onChange={(e, value) => updateOption('scale', value)}
              size="small"
            />
          </Box>
        );

      case 'textileWeave':
      case 'bandedComposite':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
              Band Height: {generatorOptions.bandHeight || 3}
            </Typography>
            <Slider
              value={generatorOptions.bandHeight || 3}
              min={1}
              max={10}
              step={1}
              onChange={(e, value) => updateOption('bandHeight', value)}
              size="small"
            />
          </Box>
        );

      case 'concentricThreshold':
        return (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center X: {generatorOptions.centerX || 15}
              </Typography>
              <Slider
                value={generatorOptions.centerX || 15}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('centerX', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Center Y: {generatorOptions.centerY || 15}
              </Typography>
              <Slider
                value={generatorOptions.centerY || 15}
                min={0}
                max={30}
                step={1}
                onChange={(e, value) => updateOption('centerY', value)}
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', display: 'block', mb: 0.5 }}>
                Frequency: {generatorOptions.frequency || 1.5}
              </Typography>
              <Slider
                value={generatorOptions.frequency || 1.5}
                min={0.5}
                max={3}
                step={0.1}
                onChange={(e, value) => updateOption('frequency', value)}
                size="small"
              />
            </Box>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
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
            PROGRAMMATIC
          </Typography>
          <Menu sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
        </Box>
      )}

      <Collapse in={isOpen} timeout={200}>
        <Paper
          elevation={8}
          sx={{
            p: 2,
            minWidth: 280,
            maxWidth: 320,
            maxHeight: '85vh',
            overflowY: 'auto',
            '@media (max-width: 768px)': {
              minWidth: 280,
              maxWidth: '90vw',
            },
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75), rgba(240, 240, 255, 0.75))',
            backdropFilter: 'blur(10px)',
            border: '1px solid white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{
              fontFamily: 'Tourney, sans-serif',
              fontWeight: 500,
              letterSpacing: 1
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{paddingRight: '10px', verticalAlign: 'middle', marginTop:"-3px"}}><polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke="black" strokeWidth="1px" fill="none" /></svg>
              PROGRAMMATIC
            </Typography>
            <IconButton onClick={() => setIsOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Generator Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="generator-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Generator</InputLabel>
            <Select
              labelId="generator-label"
              value={generatorName}
              label="Generator"
              size="small"
              onChange={(e) => {
                setGeneratorName(e.target.value);
                setGeneratorOptions({});
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    maxHeight: 400
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
              <MenuItem disabled>
                <strong>Noise-Based</strong>
              </MenuItem>
              <MenuItem value="perlinColors">Perlin Noise Colors</MenuItem>
              <MenuItem value="perlinTriangles">Perlin Noise Triangles</MenuItem>
              <MenuItem value="turbulence">Turbulence</MenuItem>
              <MenuItem disabled>
                <strong>Wave-Based</strong>
              </MenuItem>
              <MenuItem value="sineWaves">Sine Waves</MenuItem>
              <MenuItem value="concentricCircles">Concentric Circles</MenuItem>
              <MenuItem value="interference">Wave Interference</MenuItem>
              <MenuItem disabled>
                <strong>Rule-Based</strong>
              </MenuItem>
              <MenuItem value="distanceGradient">Distance Gradient</MenuItem>
              <MenuItem value="quadrants">Quadrants</MenuItem>
              <MenuItem value="diagonal">Diagonal Stripes</MenuItem>
              <MenuItem value="modulo">Modulo Pattern</MenuItem>
              <MenuItem value="triangleRules">Triangle Rules</MenuItem>
              <MenuItem disabled>
                <strong>Generative</strong>
              </MenuItem>
              <MenuItem value="gameOfLife">Game of Life</MenuItem>
              <MenuItem value="voronoi">Voronoi Cells</MenuItem>
              <MenuItem value="random">Random (Seeded)</MenuItem>
              <MenuItem value="randomTriangles">Random Triangles</MenuItem>
              <MenuItem value="maze">Maze Generator</MenuItem>
              <MenuItem disabled>
                <strong>Density-Based (High Contrast)</strong>
              </MenuItem>
              <MenuItem value="dottedDensity">Dotted Density</MenuItem>
              <MenuItem value="stippled">Stippled Pattern</MenuItem>
              <MenuItem value="crossHatch">Cross Hatch</MenuItem>
              <MenuItem value="textileWeave">Textile Weave</MenuItem>
              <MenuItem value="thresholdBlocks">Threshold Blocks</MenuItem>
              <MenuItem value="bandedComposite">Banded Composite</MenuItem>
              <MenuItem value="concentricThreshold">Concentric Threshold</MenuItem>
            </Select>
          </FormControl>

          {/* Generator Description */}
          {currentGenerator && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.5)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                {currentGenerator.description}
              </Typography>
            </Box>
          )}

          {/* Generator-specific Options */}
          {renderGeneratorOptions()}

          {/* Tile Style Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="style-label" sx={{ fontFamily: 'Inter, sans-serif' }}>Tile Style</InputLabel>
            <Select
              labelId="style-label"
              value={tileStyle}
              label="Tile Style"
              size="small"
              onChange={(e) => setTileStyle(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    maxHeight: 400
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
              <MenuItem value="blank">Blank</MenuItem>
              <MenuItem value="triangles">Triangles (4)</MenuItem>
              <MenuItem value="2-stripes-v">2 Vertical Stripes</MenuItem>
              <MenuItem value="2-stripes-h">2 Horizontal Stripes</MenuItem>
              <MenuItem value="3-stripes-v">3 Vertical Stripes</MenuItem>
              <MenuItem value="3-stripes-h">3 Horizontal Stripes</MenuItem>
              <MenuItem value="grid-2x2">2x2 Grid</MenuItem>
              <MenuItem value="grid-3x3">3x3 Grid</MenuItem>
              <MenuItem value="triangle-up">Triangle Up</MenuItem>
              <MenuItem value="triangle-down">Triangle Down</MenuItem>
              <MenuItem value="triangle-left">Triangle Left</MenuItem>
              <MenuItem value="triangle-right">Triangle Right</MenuItem>
              <MenuItem value="circle">Circle</MenuItem>
              <MenuItem value="circle-line-v">Circle + Vertical Line</MenuItem>
              <MenuItem value="circle-line-h">Circle + Horizontal Line</MenuItem>
              <MenuItem value="circle-line-diag">Circle + Diagonal Line</MenuItem>
              <MenuItem value="circle-line-diag-alt">Circle + Diagonal (Alt)</MenuItem>
              <MenuItem value="circle-cross">Circle + Cross</MenuItem>
              <MenuItem value="circle-x">Circle + X</MenuItem>
            </Select>
          </FormControl>

          {/* Size Row - Width and Height */}
          <Box sx={{ display: 'flex', gap: '2%', mb: 2 }}>
            <TextField
              label="Width"
              type="number"
              size="small"
              value={previewWidth}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  setPreviewWidth('');
                  return;
                }
                const numValue = parseInt(inputValue);
                if (!isNaN(numValue)) {
                  setPreviewWidth(numValue);
                  if (sizeTimeout) clearTimeout(sizeTimeout);
                  const newTimeout = setTimeout(() => {
                    const clampedValue = Math.max(20, Math.min(200, numValue));
                    setWidth(clampedValue);
                  }, 200);
                  setSizeTimeout(newTimeout);
                }
              }}
              inputProps={{ min: 20, max: 200, step: 5 }}
              sx={{
                flex: 1,
                '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
                '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', padding: '10.5px 14px' }
              }}
            />
            <TextField
              label="Height"
              type="number"
              size="small"
              value={previewHeight}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  setPreviewHeight('');
                  return;
                }
                const numValue = parseInt(inputValue);
                if (!isNaN(numValue)) {
                  setPreviewHeight(numValue);
                  if (sizeTimeout) clearTimeout(sizeTimeout);
                  const newTimeout = setTimeout(() => {
                    const clampedValue = Math.max(20, Math.min(200, numValue));
                    setHeight(clampedValue);
                  }, 200);
                  setSizeTimeout(newTimeout);
                }
              }}
              inputProps={{ min: 20, max: 200, step: 5 }}
              sx={{
                flex: 1,
                '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' },
                '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', padding: '10.5px 14px' }
              }}
            />
          </Box>

          {/* Download Button */}
          <Button
            variant="contained"
            onClick={() => setDownloadDialogOpen(true)}
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
            onClose={() => setDownloadDialogOpen(false)}
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
              PROGRAMMATIC GRID
              <IconButton
                onClick={() => setDownloadDialogOpen(false)}
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
              {/* Share URL */}
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
                  1920x1080
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
                  1080x1080
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
                  1024x768
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default ProgrammaticGridControls;
