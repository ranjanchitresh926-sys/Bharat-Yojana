const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next')) {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

walkDir('./', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We will find all instances of className="..." or className={...}
  // But wait, the safest way is to just find ALL className strings in files where inputs exist,
  // and if it's an input class, inject text-black.
  // Actually, we can use a more robust regex that handles multiline tags:
  const tagRegex = /<(input|textarea|select)([\s\S]*?)>/g;

  content = content.replace(tagRegex, (match, tag, rest) => {
    // Check if there is a className attribute
    if (rest.includes('className=')) {
      // Find the className="something" or className={'something'}
      const classRegex = /className=["']([^"']*)["']/g;
      
      const newRest = rest.replace(classRegex, (classMatch, className) => {
        if (className.includes('text-black')) return classMatch;
        if (className.includes('text-white')) return classMatch;
        
        let newClassName = className;
        if (/text-gray-\d+/.test(newClassName)) {
          newClassName = newClassName.replace(/text-gray-\d+/g, 'text-black');
        } else {
          newClassName += ' text-black';
        }
        return 'className="' + newClassName + '"';
      });
      return '<' + tag + newRest + '>';
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched:', filePath);
  }
});
