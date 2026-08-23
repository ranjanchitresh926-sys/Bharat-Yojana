const fs = require('fs');
let content = fs.readFileSync('lib/translations.ts', 'utf8');

const newKeys = `
    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',`;

content = content.replace(/listeningIn:\s*'(.*?)',?\r?\n\s*\}/g, 'listeningIn: \'$1\',\n' + newKeys + '\n  }');

fs.writeFileSync('lib/translations.ts', content);
