const fs = require('fs');

const files = [
  'app/connect/ConnectClient.tsx',
  'app/login/LoginClient.tsx',
  'app/signup/page.tsx',
  'app/report/ReportClient.tsx',
  'app/verify/VerifyDashboard.tsx',
  'app/HomeClient.tsx',
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Instead of complex regex, let's just replace all instances of "text-gray-900" with "text-black" inside className="..."
  // And if it's missing, we inject text-black.

  // Let's use a simple approach: find className="something" on lines that look like they belong to input/textarea/select
  const lines = content.split(/\r?\n/);
  let inInput = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (/<(input|textarea|select)/.test(lines[i])) {
      inInput = true;
    }
    
    if (inInput && /className=["']/.test(lines[i])) {
      if (!lines[i].includes('text-white') && !lines[i].includes('text-black')) {
        if (lines[i].includes('text-gray-900')) {
          lines[i] = lines[i].replace('text-gray-900', 'text-black');
        } else if (lines[i].includes('text-gray-')) {
          lines[i] = lines[i].replace(/text-gray-\d+/g, 'text-black');
        } else {
          // append to the end of the class string
          lines[i] = lines[i].replace(/(className=["'][^"']*)(["'])/, '$1 text-black$2');
        }
      }
    }
    
    if (inInput && />/.test(lines[i])) {
      inInput = false;
    }
  }

  content = lines.join('\n');
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed', f);
  }
});
