import { PrismaClient } from '@prisma/client';
import { SCHEME_DB } from '../lib/seedData';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const seedFile = fs.readFileSync(path.join(__dirname, '../lib/seedData.ts'), 'utf8');
  
  for (const scheme of SCHEME_DB) {
    const schemeIndex = seedFile.indexOf('code: \'' + scheme.code + '\'');
    let sourceCitation = 'Official Scheme Guidelines';
    if (schemeIndex !== -1) {
      const beforeScheme = seedFile.substring(0, schemeIndex);
      const lines = beforeScheme.split('\n');
      for (let i = lines.length - 1; i >= 0 && i >= lines.length - 15; i--) {
        if (lines[i].includes('// Source:')) {
          sourceCitation = lines[i].split('// Source:')[1].trim();
          break;
        }
      }
    }

    await prisma.scheme.upsert({
      where: { code: scheme.code },
      update: {
        title: scheme.title,
        category: scheme.category,
        level: scheme.level,
        ministry: scheme.ministry,
        rulesAST: JSON.stringify(scheme.rulesAST),
        numericLimits: JSON.stringify(scheme.numericLimits),
        fallbackSchemeIds: JSON.stringify(scheme.fallbackSchemeIds),
        sourceCitation,
        lastReviewedAt: new Date(),
      },
      create: {
        id: scheme.id,
        code: scheme.code,
        title: scheme.title,
        category: scheme.category,
        level: scheme.level,
        ministry: scheme.ministry,
        rulesAST: JSON.stringify(scheme.rulesAST),
        numericLimits: JSON.stringify(scheme.numericLimits),
        fallbackSchemeIds: JSON.stringify(scheme.fallbackSchemeIds),
        sourceCitation,
        lastReviewedAt: new Date(),
      }
    });
    console.log('Migrated ' + scheme.code + ' with source: ' + sourceCitation);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
