const fs = require('fs');

const file = 'app/privacy/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Soften retention line
content = content.replace(
  /Any tracked applications and associated consent records are retained for exactly <strong>30 days<\/strong> after they reach a final status \(Approved or Rejected\)\. After this period, your profile snapshot and consent records are permanently deleted from our databases\./,
  `Our stated policy is to retain tracked applications and associated consent records for exactly <strong>30 days</strong> after they reach a final status (Approved or Rejected). We are actively implementing automated deletion jobs to enforce this policy; until then, data is purged periodically during system maintenance.`
);

// Add contact point
content = content.replace(
  /Please contact our Grievance Officer\./,
  `Please contact our Grievance Officer, Alex (Data Protection Lead for the Bharat Yojana Student Team), at <strong>privacy@bharatyojana.student.project.in</strong>, or submit a request directly via the form below.`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched Privacy Page');
