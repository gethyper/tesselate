import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  listBrushTips,
  BRUSH_FIELDS,
  TEXTURE_MODES,
  HATCH_ANGLE_MODES,
  BLEED_DIRECTIONS,
  isWatercolorMode
} from '../hooks/useP5BrushTesselation';

const COLOR_KEYS = ['light', 'medium', 'dark', 'accent', 'bg'];
const HATCH_COLOR_KEYS = ['auto', ...COLOR_KEYS];

// Sourced once: the registered brush list cannot change at runtime.
const BRUSH_TIP_OPTIONS = listBrushTips().map((name) => [name, name]);

// Shared styling so this section is indistinguishable from the rest of the palette.
const MENU_PROPS = {
  PaperProps: {
    sx: {
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)'
    }
  }
};

const SELECT_SX = {
  '& .MuiSelect-select': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    padding: '8.5px 14px'
  }
};

const FIELD_SX = {
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
};

const labelFor = (value) =>
  String(value).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

/**
 * Brush rendering controls, shown inside the main tessellation palette when the
 * hidden `?brush=true` parameter is set.
 *
 * Styled to match the surrounding controls rather than the standalone `/brush`
 * prototype panel, so it reads as part of the existing palette.
 */
const BrushPaletteSection = ({ options, onChange, progress = 1 }) => {
  const update = (key, value) => onChange({ ...options, [key]: value });

  const mode = options.textureMode;
  // Flat facets have nothing to tune, so every other control is hidden.
  const textured = mode !== 'none';
  const showHatch = mode === 'hatch' || mode === 'washHatch' || mode === 'watercolorHatch';
  const showWash = mode === 'wash' || mode === 'washHatch';
  const showMass = mode === 'mass';
  const showWatercolor = isWatercolorMode(mode);

  const select = (id, label, key, entries, sx = { mb: 2 }) => (
    <FormControl fullWidth sx={sx}>
      <InputLabel id={id} sx={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </InputLabel>
      <Select
        labelId={id}
        value={options[key]}
        label={label}
        size="small"
        onChange={(e) => update(key, e.target.value)}
        MenuProps={MENU_PROPS}
        sx={SELECT_SX}
      >
        {entries.map(([value, text]) => (
          <MenuItem key={value} value={value}>
            <Typography
              variant="caption"
              sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}
            >
              {text}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const number = (label, key, { min, max, step = 1, flex = 1 }) => (
    <TextField
      label={label}
      type="number"
      size="small"
      value={options[key]}
      onChange={(e) => {
        const parsed = parseFloat(e.target.value);
        if (Number.isNaN(parsed)) return;
        update(key, Math.max(min, Math.min(max, parsed)));
      }}
      inputProps={{ min, max, step }}
      sx={{ flex, ...FIELD_SX }}
    />
  );

  const toggle = (label, key) => (
    <FormControlLabel
      control={
        <Switch
          size="small"
          checked={Boolean(options[key])}
          onChange={(e) => update(key, e.target.checked)}
        />
      }
      label={
        <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
          {label}
        </Typography>
      }
      sx={{ mb: 1 }}
    />
  );

  return (
    <>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: 'text.secondary' }}
        >
          Brush
        </Typography>
        {progress < 1 && (
          <Typography
            variant="caption"
            sx={{ fontFamily: 'Inter, sans-serif', color: 'text.secondary' }}
          >
            {Math.round(progress * 100)}%
          </Typography>
        )}
      </Box>

      {select('brush-texture-label', 'Texture', 'textureMode', Object.entries(TEXTURE_MODES))}

      {textured && (
        <>
        {showWash && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {number('Wash opacity', 'washOpacity', { min: 0, max: 255, step: 5 })}
          </Box>
        )}

        {showWatercolor && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {number('Opacity', 'fillOpacity', { min: 0, max: 255, step: 5 })}
              {number('Bleed', 'bleedStrength', { min: 0, max: 1, step: 0.01 })}
            </Box>
            {select(
              'brush-bleed-label',
              'Bleed direction',
              'bleedDirection',
              Object.entries(BLEED_DIRECTIONS)
            )}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {number('Paper', 'fillTextureStrength', { min: 0, max: 1, step: 0.05 })}
              {number('Edges', 'fillBorderStrength', { min: 0, max: 1, step: 0.05 })}
            </Box>
          </>
        )}

        {showHatch && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="brush-hatch-tip-label" sx={{ fontFamily: 'Inter, sans-serif' }}>
                  Hatch
                </InputLabel>
                <Select
                  labelId="brush-hatch-tip-label"
                  value={options.hatchBrush}
                  label="Hatch"
                  size="small"
                  onChange={(e) => update('hatchBrush', e.target.value)}
                  MenuProps={MENU_PROPS}
                  sx={SELECT_SX}
                >
                  {BRUSH_TIP_OPTIONS.map(([value, text]) => (
                    <MenuItem key={value} value={value}>
                      <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                        {text}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {number('Spacing', 'hatchDistance', { min: 1, max: 20, step: 0.5 })}
            </Box>

            {select(
              'brush-hatch-color-label',
              'Hatch color',
              'hatchColorKey',
              HATCH_COLOR_KEYS.map((k) => [k, k])
            )}
            {select(
              'brush-hatch-angle-label',
              'Hatch angles',
              'hatchAngleMode',
              Object.entries(HATCH_ANGLE_MODES)
            )}

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {number('Angle', 'hatchBaseAngle', { min: 0, max: 180, step: 5 })}
              {number('Weight', 'hatchWeight', { min: 0.2, max: 4, step: 0.1 })}
            </Box>
          </>
        )}

        {showMass && (
          <>
            {select('brush-mass-label', 'Mass brush', 'massBrush', BRUSH_TIP_OPTIONS)}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {number('Precision', 'massPrecision', { min: 0, max: 1, step: 0.05 })}
              {number('Strength', 'massStrength', { min: 0, max: 1, step: 0.05 })}
            </Box>
          </>
        )}

        {toggle('Textured outlines', 'outline')}

        {options.outline && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="brush-outline-tip-label" sx={{ fontFamily: 'Inter, sans-serif' }}>
                Outline
              </InputLabel>
              <Select
                labelId="brush-outline-tip-label"
                value={options.outlineBrush}
                label="Outline"
                size="small"
                onChange={(e) => update('outlineBrush', e.target.value)}
                MenuProps={MENU_PROPS}
                sx={SELECT_SX}
              >
                {BRUSH_TIP_OPTIONS.map(([value, text]) => (
                  <MenuItem key={value} value={value}>
                    <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif' }}>
                      {text}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="brush-outline-color-label" sx={{ fontFamily: 'Inter, sans-serif' }}>
                Color
              </InputLabel>
              <Select
                labelId="brush-outline-color-label"
                value={options.outlineColorKey}
                label="Color"
                size="small"
                onChange={(e) => update('outlineColorKey', e.target.value)}
                MenuProps={MENU_PROPS}
                sx={SELECT_SX}
              >
                {COLOR_KEYS.map((key) => (
                  <MenuItem key={key} value={key}>
                    <Typography
                      variant="caption"
                      sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}
                    >
                      {key}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {number('Brush scale', 'brushScale', { min: 0.5, max: 4, step: 0.1 })}
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="brush-field-label" sx={{ fontFamily: 'Inter, sans-serif' }}>
              Field
            </InputLabel>
            <Select
              labelId="brush-field-label"
              value={options.field}
              label="Field"
              size="small"
              onChange={(e) => update('field', e.target.value)}
              MenuProps={MENU_PROPS}
              sx={SELECT_SX}
            >
              {BRUSH_FIELDS.map((name) => (
                <MenuItem key={name} value={name}>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: 'capitalize', fontFamily: 'Inter, sans-serif' }}
                  >
                    {labelFor(name)}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        </>
      )}
    </>
  );
};

export default BrushPaletteSection;
