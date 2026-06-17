const fs = require('fs');
const PNG = require('pngjs').PNG;
const path = require('path');

const imagePath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fc780919-458e-4b0d-a324-a491ef3281c7\\media__1781539689189.png';

fs.createReadStream(imagePath)
  .pipe(new PNG())
  .on('parsed', function () {
    const colorCounts = {};
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];
        
        if (a < 200) continue;
        
        // Gold/Yellow criteria: Red and Green are dominant, Blue is much lower
        if (r > 150 && g > 120 && r > b && g > b) {
          const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
      }
    }
    
    // Sort colors by count
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1]);
      
    console.log('Top 10 green colors found:');
    sortedColors.slice(0, 10).forEach(([hex, count]) => {
      console.log(`${hex}: ${count} pixels`);
    });
  })
  .on('error', function(err) {
    console.error('Error reading PNG:', err);
  });
