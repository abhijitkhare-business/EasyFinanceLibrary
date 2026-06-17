const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.expo' && file !== '.git') {
        scanDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find return statements containing JSX
  const returnRegex = /return\s*\(\s*([\s\S]*?)\s*\)\s*;/g;
  let match;
  
  while ((match = returnRegex.exec(content)) !== null) {
    const jsxBlock = match[1];
    
    // Step 1: Strip comments inside curly braces {/* ... */}
    let cleaned = jsxBlock.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Step 2: Strip curly brace expressions, but keep nested JSX inside them
    // To do this simply, we will strip {...} that does not contain JSX tags (< or >)
    // We can repeatedly strip non-JSX curly brace blocks:
    let prevCleaned = '';
    while (cleaned !== prevCleaned) {
      prevCleaned = cleaned;
      cleaned = cleaned.replace(/\{[^{}<>]*\}/g, '');
    }

    // Step 3: Strip <Text>...</Text> tags and their contents recursively (handling nesting)
    // Let's strip <Text ...>...</Text> tags.
    // We'll match <Text followed by any attributes, then content up to </Text>
    // We do it recursively from inner to outer
    let prevTextCleaned = '';
    while (cleaned !== prevTextCleaned) {
      prevTextCleaned = cleaned;
      cleaned = cleaned.replace(/<Text\b[^>]*>([\s\S]*?)<\/Text>/gi, '');
    }
    
    // Step 4: Strip self-closing tags (e.g., <Image ... />, <View ... />)
    cleaned = cleaned.replace(/<[A-Za-z0-9.]+\b[^>]*\/>/g, '');
    
    // Step 5: Strip opening and closing tags (e.g. <View>, </View>)
    cleaned = cleaned.replace(/<[A-Za-z0-9.]+\b[^>]*>/g, '');
    cleaned = cleaned.replace(/<\/[A-Za-z0-9.]+\s*>/g, '');
    
    // Step 6: Clean up remaining whitespace and check for any leftover non-whitespace characters
    const leftover = cleaned.trim();
    
    // We want to ignore common leftover characters that might be part of JS expressions or syntax errors in our regex,
    // but flag true text characters like alphanumeric letters or words.
    // Let's filter for actual words, letters, numbers, or symbols that shouldn't be here.
    const hasText = /[a-zA-Z0-9$#@%!&*()_\-+=|\\\[\]{};:'",.<>\/?~`]/.test(leftover);
    
    if (hasText) {
      // Let's print out what is left
      console.log(`\n⚠️ Potential naked text found in: ${filePath}`);
      console.log('--- LEFTOVER CONTENT ---');
      console.log(leftover);
      console.log('------------------------');
    }
  }
}

// Start scanning the app folder
console.log('Scanning app/ directory for naked text nodes...');
scanDirectory(path.join(__dirname, '../app'));
console.log('Scan completed.');
