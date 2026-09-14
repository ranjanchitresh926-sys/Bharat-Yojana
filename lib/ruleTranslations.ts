import { LangCode } from './translations';

// PROVISIONAL TRANSLATIONS: These represent standard administrative vocabulary but have not 
// been formally verified by native speakers in each language. They should be reviewed 
// by fluent speakers before being considered final for production.
export const FIELD_LABELS: Record<LangCode, Record<string, string>> = {
  'en-IN': { occupation: 'Occupation', state: 'State', gender: 'Gender', age: 'Age',
    annualIncome: 'Income', casteCategory: 'Caste', isBPLCardHolder: 'BPL Status',
    isDisabled: 'Disability Status', landholdingAcres: 'Landholding' },
  'hi-IN': { occupation: 'व्यवसाय', state: 'राज्य', gender: 'लिंग', age: 'आयु',
    annualIncome: 'आय', casteCategory: 'जाति', isBPLCardHolder: 'बीपीएल स्थिति',
    isDisabled: 'विकलांगता स्थिति', landholdingAcres: 'भूमि जोत' },
  'bn-IN': { occupation: 'পেশা', state: 'রাজ্য', gender: 'লিঙ্গ', age: 'বয়স',
    annualIncome: 'আয়', casteCategory: 'জাতি', isBPLCardHolder: 'বিপিএল অবস্থা',
    isDisabled: 'প্রতিবন্ধী অবস্থা', landholdingAcres: 'জমির পরিমাণ' },
  'mr-IN': { occupation: 'व्यवसाय', state: 'राज्य', gender: 'लिंग', age: 'वय',
    annualIncome: 'उत्पन्न', casteCategory: 'जात', isBPLCardHolder: 'बीपीएल स्थिती',
    isDisabled: 'अपंगत्व स्थिती', landholdingAcres: 'जमीन धारणा' },
  'ta-IN': { occupation: 'தொழில்', state: 'மாநிலம்', gender: 'பாலினம்', age: 'வயது',
    annualIncome: 'வருமானம்', casteCategory: 'சாதி', isBPLCardHolder: 'பிபிஎல் நிலை',
    isDisabled: 'மாற்றுத்திறனாளி நிலை', landholdingAcres: 'நில உடைமை' },
  'te-IN': { occupation: 'వృత్తి', state: 'రాష్ట్రం', gender: 'లింగం', age: 'వయస్సు',
    annualIncome: 'ఆదాయం', casteCategory: 'కులం', isBPLCardHolder: 'బిపిఎల్ స్థితి',
    isDisabled: 'వైకల్య స్థితి', landholdingAcres: 'భూమి కమతం' },
};

export const RULE_CONNECTORS: Record<LangCode, Record<string, string>> = {
  'en-IN': { mustBe: 'must be', and: 'AND', or: 'OR', atLeast: 'at least', atMost: 'at most',
    notMet: 'Does not meet eligibility criteria', noConditions: 'No specific categorical conditions apply' },
  'hi-IN': { mustBe: 'होना चाहिए', and: 'और', or: 'या', atLeast: 'कम से कम', atMost: 'अधिकतम',
    notMet: 'पात्रता मानदंड पूरा नहीं करता', noConditions: 'कोई विशेष श्रेणीगत शर्तें लागू नहीं होतीं' },
  'bn-IN': { mustBe: 'হতে হবে', and: 'এবং', or: 'অথবা', atLeast: 'কমপক্ষে', atMost: 'সর্বোচ্চ',
    notMet: 'যোগ্যতার মানদণ্ড পূরণ করে না', noConditions: 'কোনো নির্দিষ্ট শ্রেণীগত শর্ত প্রযোজ্য নয়' },
  'mr-IN': { mustBe: 'असणे आवश्यक आहे', and: 'आणि', or: 'किंवा', atLeast: 'किमान', atMost: 'जास्तीत जास्त',
    notMet: 'पात्रता निकष पूर्ण करत नाही', noConditions: 'कोणत्याही विशिष्ट श्रेणीबद्ध अटी लागू होत नाहीत' },
  'ta-IN': { mustBe: 'ஆக இருக்க வேண்டும்', and: 'மற்றும்', or: 'அல்லது', atLeast: 'குறைந்தது', atMost: 'அதிகபட்சம்',
    notMet: 'தகுதி அளவுகோல்களை பூர்த்தி செய்யவில்லை', noConditions: 'குறிப்பிட்ட வகை நிபந்தனைகள் எதுவும் பொருந்தாது' },
  'te-IN': { mustBe: 'అయి ఉండాలి', and: 'మరియు', or: 'లేదా', atLeast: 'కనీసం', atMost: 'గరిష్టంగా',
    notMet: 'అర్హత ప్రమాణాలను చేరుకోలేదు', noConditions: 'ప్రత్యేక వర్గ షరతులు ఏవీ వర్తించవు' },
};
