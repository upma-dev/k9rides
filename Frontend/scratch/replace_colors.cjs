const fs = require('fs');
const path = require('path');

const replacements = {
  'orange-50': 'primary-orange/5',
  'orange-100': 'primary-orange/10',
  'orange-200': 'primary-orange/20',
  'orange-300': 'primary-orange/40',
  'orange-400': 'primary-orange/80',
  'orange-500': 'primary-orange',
  'orange-600': 'accent-orange',
  'orange-700': 'accent-orange/90',
  'orange-800': 'accent-orange/70',
  'orange-900': 'accent-orange/50',
  'orange-950': 'accent-orange/30'
};

function runReplace(dir) {
  let updatedCount = 0;
  function traverse(d) {
    const files = fs.readdirSync(d);
    for (let f of files) {
      const p = path.join(d, f);
      // Skip unwanted directories
      if (fs.statSync(p).isDirectory() && !p.includes('node_modules') && !p.includes('.git') && !p.includes('dist')) { 
        traverse(p); 
      }
      else if (p.match(/\.(jsx|tsx|js|ts|css|html)$/)) {
        let content = fs.readFileSync(p, 'utf-8');
        let newContent = content.replace(/(bg|text|border|hover:bg|hover:text|hover:border|from|to|via|ring|focus:ring|focus:border|shadow|hover:shadow|active:bg|active:text|peer-checked:bg)-orange-(50|100|200|300|400|500|600|700|800|900|950)/g, (match, prefix, shade) => {
          return `${prefix}-${replacements['orange-' + shade]}`;
        });
        
        if (content !== newContent) {
          fs.writeFileSync(p, newContent, 'utf-8');
          updatedCount++;
        }
      }
    }
  }
  traverse(dir);
  console.log(`Updated ${updatedCount} files.`);
}

runReplace('c:/Users/HES/Desktop/k9 folder/k9/Frontend/src');
