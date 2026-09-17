import React, { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Collapse,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Chip
} from '@mui/material';
import { Menu, Close, Casino, Download } from '@mui/icons-material';
import {
  listBrushTips,
  BRUSH_FIELDS,
  TEXTURE_MODES,
  HATCH_ANGLE_MODES,
  BLEED_DIRECTIONS,
  isWatercolorMode
} from '../hooks/useP5BrushTesselation';
import TileDesigns from './TileDesigns';
import ColorThemes from './ColorThemes';

const COLOR_KEYS = ['light', 'medium', 'dark', 'accent', 'bg'];
const HATCH_COLOR_KEYS = ['auto', ...COLOR_KEYS];
const BRUSH_TIP_OPTIONS = listBrushTips().map((b) => [b, b]);

/**
 * Control panel for the experimental p5.brush texture prototype.
 */
const BrushControls = ({
  pattern,
  setPattern,
  theme,
  setTheme,
  options,
  setOptions,
  progress = 1,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const update = (key, value) => setOptions((prev) => ({ ...prev, [key]: value }));

  const showHatch =
    options.textureMode === 'hatch' ||
    options.textureMode === 'washHatch' ||
    options.textureMode === 'watercolorHatch';
  const showWash = options.textureMode === 'wash' || options.textureMode === 'washHatch';
  const showMass = options.textureMode === 'mass';
  const showWatercolor = isWatercolorMode(options.textureMode);

  const downloadImage = () => {
    onSave?.(`brush_tessellation_${pattern}_${theme}`.replace(/\s+/g, '_'));
  };

  const sliderRow = (label, key, min, max, step) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}: {options[key]}
      </Typography>
      <Slider
        size="small"
        value={options[key]}
        min={min}
        max={max}
        step={step}
        onChange={(_, v) => update(key, v)}
      />
    </Box>
  );

  const selectRow = (label, key, entries) => (
    <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={options[key]} onChange={(e) => update(key, e.target.value)}>
        {entries.map(([value, text]) => (
          <MenuItem key={value} value={value}>{text}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{ bgcolor: 'background.paper', boxShadow: 3, '&:hover': { bgcolor: 'background.paper' } }}
        >
          <Menu />
        </IconButton>
      )}

      <Collapse in={isOpen}>
        <Paper
          elevation={6}
          sx={{ p: 2, width: 320, maxHeight: '92vh', overflowY: 'auto', opacity: 0.97 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Brush Texture</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {progress < 1 && <Chip label={`${Math.round(progress * 100)}%`} size="small" color="warning" />}
              <IconButton size="small" onClick={() => setIsOpen(false)}><Close fontSize="small" /></IconButton>
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
            Dry-media texture via p5.brush hatching and massing, plus watercolor
            modes using its bleeding fill system.
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>Pattern</InputLabel>
            <Select label="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)}>
              {Object.keys(TileDesigns).map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>Theme</InputLabel>
            <Select label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
              {Object.keys(ColorThemes).map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {sliderRow('Hex radius', 'radius', 25, 180, 5)}

          <Divider sx={{ my: 1.5 }} />

          {selectRow('Texture mode', 'textureMode', Object.entries(TEXTURE_MODES))}

          {showWash && sliderRow('Wash opacity', 'washOpacity', 0, 255, 5)}

          {showWatercolor && (
            <>
              {sliderRow('Fill opacity', 'fillOpacity', 0, 255, 5)}
              {sliderRow('Bleed strength', 'bleedStrength', 0, 1, 0.01)}
              {selectRow('Bleed direction', 'bleedDirection', Object.entries(BLEED_DIRECTIONS))}
              {sliderRow('Bleed angle', 'bleedAngle', 0, 360, 5)}
              {sliderRow('Paper texture', 'fillTextureStrength', 0, 1, 0.05)}
              {sliderRow('Edge darkening', 'fillBorderStrength', 0, 1, 0.05)}
              <FormControlLabel
                control={
                  <Switch
                    checked={options.fillScatter}
                    onChange={(e) => update('fillScatter', e.target.checked)}
                  />
                }
                label={<Typography variant="caption">Scatter pigment</Typography>}
                sx={{ mb: 1 }}
              />
            </>
          )}

          {showHatch && (
            <>
              {selectRow('Hatch brush', 'hatchBrush', BRUSH_TIP_OPTIONS)}
              {selectRow('Hatch color', 'hatchColorKey', HATCH_COLOR_KEYS.map((k) => [k, k]))}
              {selectRow('Hatch angles', 'hatchAngleMode', Object.entries(HATCH_ANGLE_MODES))}
              {sliderRow('Hatch spacing', 'hatchDistance', 1, 20, 0.5)}
              {sliderRow('Hatch weight', 'hatchWeight', 0.2, 4, 0.1)}
              {sliderRow('Hatch base angle', 'hatchBaseAngle', 0, 180, 5)}
              {sliderRow('Hatch randomness', 'hatchRandomness', 0, 1, 0.05)}
              {sliderRow('Hatch gradient', 'hatchGradient', 0, 1, 0.05)}
            </>
          )}

          {showMass && (
            <>
              {selectRow('Mass brush', 'massBrush', BRUSH_TIP_OPTIONS)}
              {sliderRow('Mass precision', 'massPrecision', 0, 1, 0.05)}
              {sliderRow('Mass strength', 'massStrength', 0, 1, 0.05)}
            </>
          )}

          <Divider sx={{ my: 1.5 }} />

          <FormControlLabel
            control={<Switch checked={options.outline} onChange={(e) => update('outline', e.target.checked)} />}
            label={<Typography variant="body2">Textured outlines</Typography>}
          />

          {options.outline && (
            <>
              {selectRow('Outline brush', 'outlineBrush', BRUSH_TIP_OPTIONS)}
              {selectRow('Outline color', 'outlineColorKey', COLOR_KEYS.map((k) => [k, k]))}
              {sliderRow('Outline weight', 'outlineWeight', 0.2, 4, 0.1)}
            </>
          )}

          <Divider sx={{ my: 1.5 }} />

          {sliderRow('Brush scale', 'brushScale', 0.5, 4, 0.1)}
          {selectRow('Vector field', 'field', BRUSH_FIELDS.map((f) => [f, f]))}
          {options.field === 'none' && sliderRow('Hand wiggle', 'wiggle', 0, 10, 0.5)}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<Casino />}
              onClick={() => update('seed', Math.floor(Math.random() * 100000))}
            >
              Reseed
            </Button>
            <Button fullWidth size="small" variant="contained" startIcon={<Download />} onClick={downloadImage}>
              PNG
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default BrushControls;
