import { PrismaClient } from '@prisma/client';
import { SCHEME_DB } from '../lib/seedData';
import { SchemeEngine } from '../lib/astEvaluator';
import { CitizenProfile, Scheme } from '../types/scheme';

const prisma = new PrismaClient();

async function main() {
  const dbSchemesRaw = await prisma.scheme.findMany();
  const DB_SCHEMES: Scheme[] = dbSchemesRaw.map(s => ({
    id: s.id,
    code: s.code,
    title: s.title,
    category: s.category,
    level: s.level as any,
    ministry: s.ministry,
    rulesAST: JSON.parse(s.rulesAST),
    numericLimits: JSON.parse(s.numericLimits),
    fallbackSchemeIds: JSON.parse(s.fallbackSchemeIds),
  }));

  const testProfile: CitizenProfile = {
    age: 25,
    annualIncome: 50000,
    casteCategory: 'General',
    gender: 'Female',
    occupation: 'Student',
    state: 'Maharashtra',
    landholdingAcres: 0,
    isBPLCardHolder: true,
    isDisabled: false,
  };

  let allIdentical = true;

  for (const scheme of SCHEME_DB) {
    const dbScheme = DB_SCHEMES.find(s => s.code === scheme.code);
    if (!dbScheme) {
      console.error('Missing in DB: ' + scheme.code);
      allIdentical = false;
      continue;
    }

    const oldResult = SchemeEngine.evaluate(testProfile, scheme, SCHEME_DB);
    const newResult = SchemeEngine.evaluate(testProfile, dbScheme, DB_SCHEMES);

    const oldStr = JSON.stringify(oldResult, null, 2);
    const newStr = JSON.stringify(newResult, null, 2);

    if (oldStr !== newStr) {
      console.error('MISMATCH on ' + scheme.code);
      console.log('OLD:', oldStr);
      console.log('NEW:', newStr);
      allIdentical = false;
    } else {
      console.log(scheme.code + ' is BYTE-IDENTICAL. (Eligible: ' + oldResult.isEligible + ')');
    }
  }

  if (allIdentical) {
    console.log('\n✅ ALL 22 SCHEMES BYTE-IDENTICAL.');
  } else {
    console.log('\n❌ MISMATCHES FOUND.');
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
