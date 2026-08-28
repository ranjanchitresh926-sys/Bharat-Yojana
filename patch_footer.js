const fs = require('fs');

const file = 'components/GovFooter.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import Link
if (!content.includes("import Link from 'next/link';")) {
  content = content.replace(
    /import React from 'react';/,
    `import React from 'react';\nimport Link from 'next/link';`
  );
}

// Replace Privacy Policy span
content = content.replace(
  /<span>Privacy Policy<\/span>/,
  `<Link href="/privacy" className="hover:underline focus:outline-1 focus:outline-offset-1 focus:outline-white rounded">Privacy Policy</Link>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched GovFooter');
