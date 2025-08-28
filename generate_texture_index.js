const fs = require('fs');
const path = require('path');

// Generate texture index file after downloading textures
const textureDir = path.join(__dirname, 'src', 'assets', 'textures');
const outputFile = path.join(__dirname, 'src', 'components', 'textures.js');

const textureNames = [
    'grunge_135',
    'paper_164', 
    'paper_124',
    'grunge_267',
    'grunge_127',
    'paper_313',
    'grunge_340',
    'lensfx_213',
    'fabric_178',
    'paper_207',
    'paper_174',
    'paper_237',
    'sky_145',
    'film_181',
    'inkpaint_182',
    'film_146',
    'paper_361',
    'fabric_124',
    'metal_244',
    'paper_320',
    'film_120',
    'lensfx_191',
    'grunge_318',
    'metal_232'
];

function generateTextureIndex() {
    console.log('Generating texture index...');
    
    const imports = [];
    const exports = [];
    
    textureNames.forEach(name => {
        // Check if file exists
        const jpgPath = path.join(textureDir, `${name}.jpg`);
        const pngPath = path.join(textureDir, `${name}.png`);
        
        let extension = '.jpg';
        if (fs.existsSync(pngPath)) {
            extension = '.png';
        } else if (!fs.existsSync(jpgPath)) {
            console.warn(`Warning: ${name} not found as .jpg or .png`);
            return;
        }
        
        const importName = name.replace(/-/g, '_');
        imports.push(`import ${importName} from '../assets/textures/${name}${extension}';`);
        exports.push(`  "${name}": ${importName}`);
    });
    
    const fileContent = `// Auto-generated texture imports
${imports.join('\n')}

export const textures = {
${exports.join(',\n')}
};

export const textureNames = [
${textureNames.map(name => `  "${name}"`).join(',\n')}
];
`;
    
    fs.writeFileSync(outputFile, fileContent);
    console.log(`Generated texture index at: ${outputFile}`);
    console.log(`Found ${imports.length} textures`);
}

// Check if texture directory exists
if (!fs.existsSync(textureDir)) {
    console.error(`Texture directory does not exist: ${textureDir}`);
    console.log('Please run the download script first to download textures');
    process.exit(1);
}

generateTextureIndex();