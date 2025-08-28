const fs = require('fs');
const path = require('path');

// Generate texture index from actually downloaded files
const textureDir = path.join(__dirname, 'src', 'assets', 'textures');
const outputFile = path.join(__dirname, 'src', 'components', 'textures.js');

function generateTextureIndex() {
    console.log('Generating texture index from downloaded files...');
    
    if (!fs.existsSync(textureDir)) {
        console.error(`Texture directory does not exist: ${textureDir}`);
        return;
    }
    
    // Get all image files from the directory
    const files = fs.readdirSync(textureDir);
    const imageFiles = files.filter(file => 
        file.toLowerCase().endsWith('.jpg') || 
        file.toLowerCase().endsWith('.png') || 
        file.toLowerCase().endsWith('.jpeg')
    );
    
    console.log(`Found ${imageFiles.length} image files`);
    
    const imports = [];
    const exports = [];
    const names = [];
    
    imageFiles.forEach(filename => {
        // Remove extension
        const nameWithoutExt = path.parse(filename).name;
        
        // Create a clean variable name (replace non-alphanumeric with underscore)
        const varName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // Create display name (remove Texturelabs_ prefix if present)
        const displayName = nameWithoutExt.replace(/^Texturelabs_/i, '').replace(/_/g, ' ');
        
        imports.push(`import ${varName} from '../assets/textures/${filename}';`);
        exports.push(`  "${varName}": ${varName}`);
        names.push(`  "${varName}"`);
        
        console.log(`  ${filename} -> ${varName} (${displayName})`);
    });
    
    const fileContent = `// Auto-generated texture imports from downloaded files
${imports.join('\n')}

export const textures = {
${exports.join(',\n')}
};

export const textureNames = [
${names.join(',\n')}
];

// Display names for UI
export const textureDisplayNames = {
${imageFiles.map(filename => {
    const nameWithoutExt = path.parse(filename).name;
    const varName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const displayName = nameWithoutExt.replace(/^Texturelabs_/i, '').replace(/_/g, ' ');
    return `  "${varName}": "${displayName}"`;
}).join(',\n')}
};
`;
    
    fs.writeFileSync(outputFile, fileContent);
    console.log(`\n✅ Generated texture index at: ${outputFile}`);
    console.log(`📊 Processed ${imageFiles.length} textures`);
}

generateTextureIndex();