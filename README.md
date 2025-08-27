# Tessellations

Create and explore hexagonal tessellations with customizable patterns, colors, and sizes.

🎨 **[Try it live →](https://gethyper.github.io/tesselate/)**

## Features

- **Interactive Canvas**: Full-screen tessellation patterns that respond to your settings
- **Pattern Library**: Multiple geometric designs including hexagons, triangles, and complex arrangements
- **Color Themes**: Curated color palettes with live preview
- **Real-time Controls**: Adjust tile size, pattern, and colors instantly
- **URL Sharing**: Share specific patterns and themes via URL parameters
- **Responsive Design**: Works on desktop and mobile devices

## Controls

- **Pattern**: Choose from various tessellation designs
- **Theme**: Select color schemes with preview swatches
- **Size**: Adjust tile dimensions (5-100px)
- **Secret Mode**: Add `?secret=true` to hide controls for clean screenshots
- **Gradient Mode**: Add `?gradient=true` for gradient fills

## Development

### Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in development mode.

### Build & Deploy

```bash
npm run build
npm run deploy  # Deploy to GitHub Pages
```

### Project Structure

- `src/components/Tesselate.js` - Main canvas component using p5.js
- `src/components/TessellationControls.js` - Interactive settings panel
- `src/components/TileDesigns.js` - Pattern definitions
- `src/components/ColorThemes.js` - Color palette definitions
- `src/hooks/useP5Tesselation.js` - Core tessellation logic

## Technology

- **React** with hooks for state management
- **p5.js** for canvas rendering and geometric calculations
- **Material-UI** for polished interface components
- **GitHub Pages** for deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new patterns in `TileDesigns.js` or themes in `ColorThemes.js`
4. Test your changes locally
5. Submit a pull request

---

Built with React • Powered by p5.js • Deployed on GitHub Pages
