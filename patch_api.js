const fs = require('fs');

const file = 'app/api/applications/route.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace body destruction
content = content.replace(
  /const { schemeId, schemeTitle, profileSnapshot, citizenId } = body as Record<string, any>;/,
  `const { schemeId, schemeTitle, profileSnapshot, citizenId, consentVersion } = body as Record<string, any>;`
);

// Add consent validation
content = content.replace(
  /if \(!profileSnapshot \|\| typeof profileSnapshot !== "object"\) {[\s\S]*?errors\.push\("Profile snapshot is required\."\);\n  }/,
  `if (!profileSnapshot || typeof profileSnapshot !== "object") {
    errors.push("Profile snapshot is required.");
  }

  if (typeof consentVersion !== "string" || consentVersion.trim().length === 0) {
    errors.push("Consent version is required.");
  }`
);

// Add citizenId validation because consent requires it
content = content.replace(
  /if \(errors\.length > 0\) {/,
  `if (typeof citizenId !== "string" || citizenId.trim().length === 0) {
    errors.push("Citizen ID is required for consent tracking.");
  }

  if (errors.length > 0) {`
);

// Replace application creation with transaction
content = content.replace(
  /const dbApplication = await prisma\.application\.create\({[\s\S]*?data: {[\s\S]*?citizenId: typeof citizenId === "string" \? citizenId\.trim\(\) : null,[\s\S]*?schemeId: schemeId\.trim\(\),[\s\S]*?schemeTitle: schemeTitle\.trim\(\),[\s\S]*?profileSnapshot: JSON\.stringify\(profileSnapshot\),[\s\S]*?status: "Submitted",[\s\S]*?}\n  }\);/,
  `const [dbApplication, consentRecord] = await prisma.$transaction([
    prisma.application.create({
      data: {
        citizenId: citizenId.trim(),
        schemeId: schemeId.trim(),
        schemeTitle: schemeTitle.trim(),
        profileSnapshot: JSON.stringify(profileSnapshot),
        status: "Submitted",
      }
    }),
    prisma.consentRecord.create({
      data: {
        citizenId: citizenId.trim(),
        purpose: "application-tracking",
        noticeVersion: consentVersion.trim(),
      }
    })
  ]);`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched API route');
