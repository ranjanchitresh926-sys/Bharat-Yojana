const fs = require('fs');

const files = [
  'app/connect/ConnectClient.tsx',
  'app/login/LoginClient.tsx',
  'app/signup/page.tsx',
  'app/report/ReportClient.tsx',
  'app/verify/VerifyDashboard.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace transition-colors" with transition-colors text-black" in inputs
  content = content.replace(/className="(w-full px-4[^"]*transition-colors)"/g, 'className="$1 text-black"');
  
  fs.writeFileSync(f, content, 'utf8');
  console.log('Fixed', f);
});
