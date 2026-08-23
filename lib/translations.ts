// Translation dictionary for all supported languages
// Keys are the English labels, values are translations per language code

export type LangCode = 'en-IN' | 'hi-IN' | 'bn-IN' | 'mr-IN' | 'ta-IN' | 'te-IN';

export interface TranslationSet {
  applicantInfo: string;
  fillDetails: string;
  age: string;
  annualIncome: string;
  state: string;
  occupation: string;
  landholding: string;
  gender: string;
  category: string;
  male: string;
  female: string;
  other: string;
  bplCardHolder: string;
  differentlyAbled: string;
  quickPresets: string;
  smallFarmerMP: string;
  highIncomeFarmer: string;
  bplApplicant: string;
  searchSchemes: string;
  eligibilityResults: string;
  schemesAnalyzed: string;
  status: string;
  eligible: string;
  notEligible: string;
  gapAnalysis: string;
  alternativeSchemes: string;
  ministry: string;
  allMinistries: string;
  speakProfile: string;
  listeningIn: string;
  actionReduceIncome: string;
  actionReduceLand: string;
  actionIncreaseAge: string;
  actionReduceAge: string;
  actionFallbackText: string;
}

const translations: Record<string, TranslationSet> = {
  'en-IN': {
    applicantInfo: 'Applicant Information',
    fillDetails: 'Fill details manually or use voice input',
    age: 'Age (Years)',
    annualIncome: 'Annual Income (₹)',
    state: 'State',
    occupation: 'Occupation',
    landholding: 'Landholding (Acres)',
    gender: 'Gender',
    category: 'Category',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    bplCardHolder: 'BPL Card Holder',
    differentlyAbled: 'Differently Abled',
    quickPresets: 'Quick Presets',
    smallFarmerMP: '🌾 Small Farmer MP',
    highIncomeFarmer: '🚜 High Income Farmer',
    bplApplicant: '📝 BPL Applicant',
    searchSchemes: 'Search Eligible Schemes',
    eligibilityResults: 'Eligibility Results',
    schemesAnalyzed: 'Schemes Analyzed',
    status: 'Status',
    eligible: 'Eligible',
    notEligible: 'Not Eligible',
    gapAnalysis: 'Gap Analysis',
    alternativeSchemes: 'Alternative Schemes',
    ministry: 'Ministry',
    allMinistries: 'All Ministries',
    speakProfile: 'Speak your profile details',
    listeningIn: 'Listening in',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
  'hi-IN': {
    applicantInfo: 'आवेदक की जानकारी',
    fillDetails: 'विवरण मैन्युअल रूप से भरें या वॉयस इनपुट का उपयोग करें',
    age: 'आयु (वर्ष)',
    annualIncome: 'वार्षिक आय (₹)',
    state: 'राज्य',
    occupation: 'व्यवसाय',
    landholding: 'भूमि (एकड़)',
    gender: 'लिंग',
    category: 'श्रेणी',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    bplCardHolder: 'बीपीएल कार्ड धारक',
    differentlyAbled: 'दिव्यांग',
    quickPresets: 'त्वरित प्रीसेट',
    smallFarmerMP: '🌾 छोटा किसान मध्य प्रदेश',
    highIncomeFarmer: '🚜 उच्च आय किसान',
    bplApplicant: '📝 बीपीएल आवेदक',
    searchSchemes: 'योग्य योजनाएं खोजें',
    eligibilityResults: 'पात्रता परिणाम',
    schemesAnalyzed: 'योजनाओं का विश्लेषण',
    status: 'स्थिति',
    eligible: 'पात्र',
    notEligible: 'अपात्र',
    gapAnalysis: 'अंतर विश्लेषण',
    alternativeSchemes: 'वैकल्पिक योजनाएं',
    ministry: 'मंत्रालय',
    allMinistries: 'सभी मंत्रालय',
    speakProfile: 'अपना विवरण बोलें',
    listeningIn: 'सुन रहा है',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
  'bn-IN': {
    applicantInfo: 'আবেদনকারীর তথ্য',
    fillDetails: 'ম্যানুয়ালি বিবরণ পূরণ করুন বা ভয়েস ইনপুট ব্যবহার করুন',
    age: 'বয়স (বছর)',
    annualIncome: 'বার্ষিক আয় (₹)',
    state: 'রাজ্য',
    occupation: 'পেশা',
    landholding: 'জমি (একর)',
    gender: 'লিঙ্গ',
    category: 'বিভাগ',
    male: 'পুরুষ',
    female: 'মহিলা',
    other: 'অন্যান্য',
    bplCardHolder: 'বিপিএল কার্ড ধারক',
    differentlyAbled: 'প্রতিবন্ধী',
    quickPresets: 'দ্রুত প্রিসেট',
    smallFarmerMP: '🌾 ক্ষুদ্র কৃষক মধ্যপ্রদেশ',
    highIncomeFarmer: '🚜 উচ্চ আয় কৃষক',
    bplApplicant: '📝 বিপিএল আবেদনকারী',
    searchSchemes: 'যোগ্য প্রকল্প খুঁজুন',
    eligibilityResults: 'যোগ্যতার ফলাফল',
    schemesAnalyzed: 'প্রকল্প বিশ্লেষিত',
    status: 'অবস্থা',
    eligible: 'যোগ্য',
    notEligible: 'অযোগ্য',
    gapAnalysis: 'ব্যবধান বিশ্লেষণ',
    alternativeSchemes: 'বিকল্প প্রকল্প',
    ministry: 'মন্ত্রণালয়',
    allMinistries: 'সমস্ত মন্ত্রণালয়',
    speakProfile: 'আপনার বিবরণ বলুন',
    listeningIn: 'শুনছি',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
  'mr-IN': {
    applicantInfo: 'अर्जदाराची माहिती',
    fillDetails: 'तपशील स्वहस्ते भरा किंवा व्हॉइस इनपुट वापरा',
    age: 'वय (वर्षे)',
    annualIncome: 'वार्षिक उत्पन्न (₹)',
    state: 'राज्य',
    occupation: 'व्यवसाय',
    landholding: 'जमीनधारणा (एकर)',
    gender: 'लिंग',
    category: 'वर्ग',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    bplCardHolder: 'बीपीएल कार्डधारक',
    differentlyAbled: 'दिव्यांग',
    quickPresets: 'द्रुत प्रीसेट',
    smallFarmerMP: '🌾 छोटा शेतकरी मध्य प्रदेश',
    highIncomeFarmer: '🚜 उच्च उत्पन्न शेतकरी',
    bplApplicant: '📝 बीपीएल अर्जदार',
    searchSchemes: 'पात्र योजना शोधा',
    eligibilityResults: 'पात्रता निकाल',
    schemesAnalyzed: 'योजना विश्लेषित',
    status: 'स्थिती',
    eligible: 'पात्र',
    notEligible: 'अपात्र',
    gapAnalysis: 'अंतर विश्लेषण',
    alternativeSchemes: 'पर्यायी योजना',
    ministry: 'मंत्रालय',
    allMinistries: 'सर्व मंत्रालये',
    speakProfile: 'तुमचे तपशील बोला',
    listeningIn: 'ऐकत आहे',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
  'ta-IN': {
    applicantInfo: 'விண்ணப்பதாரர் தகவல்',
    fillDetails: 'விவரங்களை கைமுறையாக நிரப்பவும் அல்லது குரல் உள்ளீட்டைப் பயன்படுத்தவும்',
    age: 'வயது (ஆண்டுகள்)',
    annualIncome: 'ஆண்டு வருமானம் (₹)',
    state: 'மாநிலம்',
    occupation: 'தொழில்',
    landholding: 'நிலம் (ஏக்கர்)',
    gender: 'பாலினம்',
    category: 'வகை',
    male: 'ஆண்',
    female: 'பெண்',
    other: 'மற்றவை',
    bplCardHolder: 'பிபிஎல் அட்டை',
    differentlyAbled: 'மாற்றுத்திறனாளி',
    quickPresets: 'விரைவு முன்னமைப்புகள்',
    smallFarmerMP: '🌾 சிறு விவசாயி மத்தியப் பிரதேசம்',
    highIncomeFarmer: '🚜 உயர் வருமான விவசாயி',
    bplApplicant: '📝 பிபிஎல் விண்ணப்பதாரர்',
    searchSchemes: 'தகுதியான திட்டங்களைத் தேடுங்கள்',
    eligibilityResults: 'தகுதி முடிவுகள்',
    schemesAnalyzed: 'திட்டங்கள் பகுப்பாய்வு',
    status: 'நிலை',
    eligible: 'தகுதியானவர்',
    notEligible: 'தகுதியற்றவர்',
    gapAnalysis: 'இடைவெளி பகுப்பாய்வு',
    alternativeSchemes: 'மாற்று திட்டங்கள்',
    ministry: 'அமைச்சகம்',
    allMinistries: 'அனைத்து அமைச்சகங்கள்',
    speakProfile: 'உங்கள் விவரங்களைக் கூறுங்கள்',
    listeningIn: 'கேட்கிறது',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
  'te-IN': {
    applicantInfo: 'దరఖాస్తుదారు సమాచారం',
    fillDetails: 'వివరాలను మాన్యువల్‌గా నింపండి లేదా వాయిస్ ఇన్‌పుట్ ఉపయోగించండి',
    age: 'వయసు (సంవత్సరాలు)',
    annualIncome: 'వార్షిక ఆదాయం (₹)',
    state: 'రాష్ట్రం',
    occupation: 'వృత్తి',
    landholding: 'భూమి (ఎకరాలు)',
    gender: 'లింగం',
    category: 'వర్గం',
    male: 'పురుషుడు',
    female: 'స్త్రీ',
    other: 'ఇతరులు',
    bplCardHolder: 'బిపిఎల్ కార్డు',
    differentlyAbled: 'వికలాంగులు',
    quickPresets: 'శీఘ్ర ప్రీసెట్‌లు',
    smallFarmerMP: '🌾 చిన్న రైతు మధ్యప్రదేశ్',
    highIncomeFarmer: '🚜 అధిక ఆదాయ రైతు',
    bplApplicant: '📝 బిపిఎల్ దరఖాస్తుదారు',
    searchSchemes: 'అర్హత పథకాలను శోధించండి',
    eligibilityResults: 'అర్హత ఫలితాలు',
    schemesAnalyzed: 'పథకాలు విశ్లేషించబడ్డాయి',
    status: 'స్థితి',
    eligible: 'అర్హత',
    notEligible: 'అనర్హత',
    gapAnalysis: 'వ్యత్యాస విశ్లేషణ',
    alternativeSchemes: 'ప్రత్యామ్నాయ పథకాలు',
    ministry: 'మంత్రిత్వ శాఖ',
    allMinistries: 'అన్ని మంత్రిత్వ శాఖలు',
    speakProfile: 'మీ వివరాలను చెప్పండి',
    listeningIn: 'వింటోంది',

    actionReduceIncome: 'Income would need to reduce by Rs. {delta}{fallbackText}',
    actionReduceLand: 'Landholding would need to reduce by {delta} acres{fallbackText}',
    actionIncreaseAge: 'Age would need to increase by {delta} years{fallbackText}',
    actionReduceAge: 'Age would need to reduce by {delta} years{fallbackText}',
    actionFallbackText: ', or you may qualify for {fallbackCode} instead which allows up to {fallbackLimit}',
  },
};

export function getTranslations(langCode: string): TranslationSet {
  return translations[langCode] || translations['en-IN'];
}
