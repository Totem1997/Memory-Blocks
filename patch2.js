const fs = require('fs');
const content = fs.readFileSync('src/utils/pieces.ts', 'utf8');
const lines = content.split('\n');

// Find the end of SHAPE_TEMPLATES
let endIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export function canPlacePiece')) {
    endIndex = i;
    break;
  }
}

if (endIndex === -1) {
  console.log("Could not find canPlacePiece");
  process.exit(1);
}

const templatesContent = lines.slice(0, endIndex).join('\n');
console.log(templatesContent);
