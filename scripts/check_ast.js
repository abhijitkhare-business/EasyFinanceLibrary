const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function checkFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err.message);
    return;
  }

  traverse(ast, {
    JSXElement(nodePath) {
      const openingElement = nodePath.node.openingElement;
      const tagName = getTagName(openingElement);
      
      if (!isTextComponent(tagName)) {
        checkChildren(nodePath.node.children, tagName, filePath);
      }
    },
    JSXFragment(nodePath) {
      // Fragments are not text components
      checkChildren(nodePath.node.children, 'Fragment', filePath);
    }
  });
}

function checkChildren(children, parentName, filePath) {
  children.forEach(child => {
    if (child.type === 'JSXText') {
      const textValue = child.value;
      if (/[^\s\u00A0]/.test(textValue)) {
        const loc = child.loc ? child.loc.start : { line: 0, column: 0 };
        console.log(`❌ Naked text node in non-text component <${parentName}> at ${filePath}:${loc.line}:${loc.column}`);
        console.log(`   Text value: "${textValue.trim()}"`);
      }
    } else if (child.type === 'JSXExpressionContainer') {
      const expr = child.expression;
      if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'LogicalExpression' || expr.type === 'BinaryExpression') {
        const loc = child.loc ? child.loc.start : { line: 0, column: 0 };
        console.log(`⚠️  Potential un-wrapped expression in <${parentName}> at ${filePath}:${loc.line}:${loc.column}`);
      }
    }
  });
}

function getTagName(openingElement) {
  const nameNode = openingElement.name;
  if (nameNode.type === 'JSXIdentifier') {
    return nameNode.name;
  } else if (nameNode.type === 'JSXMemberExpression') {
    return `${nameNode.object.name}.${nameNode.property.name}`;
  }
  return '';
}

function isTextComponent(name) {
  // Common text components in React Native
  const textComponents = ['Text', 'ThemedText', 'TextInput', 'Animated.Text', 'StatusBar', 'Link'];
  return textComponents.includes(name) || name.endsWith('Text');
}

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

console.log('AST Check started...');
scanDirectory(path.join(__dirname, '../app'));
scanDirectory(path.join(__dirname, '../components'));
console.log('AST Check completed.');
