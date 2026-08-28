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

  // We need to find all <input, <textarea, <select tags and ensure their className has text-black
  // and replace any text-gray-[0-9]+ on them with text-black.

  // It's tricky to do regex on HTML tags reliably, but we can just do a broader replace:
  // Find className="..." inside <input, <textarea, <select
  const tagRegex = /<(input|textarea|select)\b[^>]*className=["']([^"']*)["'][^>]*>/g;

  content = content.replace(tagRegex, (match, tag, className) => {
    // If it already has text-black, skip
    if (className.includes('text-black')) return match;

    let newClassName = className;
    // Replace text-gray-XXX with text-black
    if (/text-gray-\d+/.test(newClassName)) {
      newClassName = newClassName.replace(/text-gray-\d+/g, 'text-black');
    } else if (/text-\w+-\d+/.test(newClassName)) {
      // e.g. text-white in GovHeader search bar
      // Wait! In GovHeader, it's a dark background (bg-[#0a3580]), the text must be white!
      // If we change it to black, it will be invisible.
      if (newClassName.includes('text-white')) {
         return match; // keep text-white
      }
    } else {
      // Append text-black
      newClassName += ' text-black';
    }

    return match.replace(className, newClassName);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched:', filePath);
  }
});
