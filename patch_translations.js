const fs = require('fs');

const path = 'lib/translations.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add to interface TranslationSet
const interfaceAdditions = `
  navHome: string;
  navSchemes: string;
  navDashboard: string;
  navConnect: string;
  navVerify: string;
  navAnalytics: string;
  navFeedback: string;
  navSignIn: string;
  navSignOut: string;
`;
content = content.replace(/export interface TranslationSet \{/, `export interface TranslationSet {${interfaceAdditions}`);

// 2. Add to each language object
const langs = {
  'en-IN': `
    navHome: 'Home',
    navSchemes: 'Offerings / Schemes',
    navDashboard: 'My Dashboard',
    navConnect: 'Connect',
    navVerify: 'Verify Reports',
    navAnalytics: 'Admin Analytics',
    navFeedback: 'Feedback',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',`,
  'hi-IN': `
    navHome: 'होम',
    navSchemes: 'योजनाएं',
    navDashboard: 'मेरा डैशबोर्ड',
    navConnect: 'संपर्क',
    navVerify: 'रिपोर्ट सत्यापित करें',
    navAnalytics: 'एडमिन एनालिटिक्स',
    navFeedback: 'प्रतिक्रिया',
    navSignIn: 'साइन इन',
    navSignOut: 'साइन आउट',`,
  'bn-IN': `
    navHome: 'হোম',
    navSchemes: 'স্কিমগুলি',
    navDashboard: 'আমার ড্যাশবোর্ড',
    navConnect: 'যোগাযোগ',
    navVerify: 'রিপোর্ট যাচাই করুন',
    navAnalytics: 'অ্যাডমিন অ্যানালিটিক্স',
    navFeedback: 'মতামত',
    navSignIn: 'সাইন ইন',
    navSignOut: 'সাইন আউট',`,
  'mr-IN': `
    navHome: 'होम',
    navSchemes: 'योजना',
    navDashboard: 'माझा डॅशबोर्ड',
    navConnect: 'संपर्क',
    navVerify: 'अहवाल सत्यापित करा',
    navAnalytics: 'अ‍ॅडमिन अ‍ॅनालिटिक्स',
    navFeedback: 'अभिप्राय',
    navSignIn: 'साइन इन करा',
    navSignOut: 'साइन आउट करा',`,
  'ta-IN': `
    navHome: 'முகப்பு',
    navSchemes: 'திட்டங்கள்',
    navDashboard: 'என் டாஷ்போர்டு',
    navConnect: 'தொடர்பு',
    navVerify: 'அறிக்கைகளை சரிபார்க்கவும்',
    navAnalytics: 'நிர்வாக பகுப்பாய்வு',
    navFeedback: 'பின்னூட்டம்',
    navSignIn: 'உள்நுழைக',
    navSignOut: 'வெளியேறு',`,
  'te-IN': `
    navHome: 'హోమ్',
    navSchemes: 'పథకాలు',
    navDashboard: 'నా డాష్‌బోర్డ్',
    navConnect: 'కనెక్ట్',
    navVerify: 'నివేదికలను ధృవీకరించండి',
    navAnalytics: 'అడ్మిన్ విశ్లేషణలు',
    navFeedback: 'అభిప్రాయం',
    navSignIn: 'సైన్ ఇన్',
    navSignOut: 'సైన్ అవుట్',`
};

for (const [code, additions] of Object.entries(langs)) {
  const regex = new RegExp(`'${code}': {`);
  content = content.replace(regex, `'${code}': {${additions}`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Translations updated!');
