const fs = require('fs');

const file = 'app/privacy/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Soften retention line
content = content.replace(
  /We are actively implementing automated deletion jobs to enforce this policy; until then, data is purged periodically during system maintenance\./,
  `Until an automated retention job is built, deletion is currently manual and handled exclusively upon request via the Grievance page.`
);

// Replace contact point with neutral name
content = content.replace(
  /Alex \(Data Protection Lead for the Bharat Yojana Student Team\)/,
  `the Project Maintainer`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched Privacy Page strictly');
