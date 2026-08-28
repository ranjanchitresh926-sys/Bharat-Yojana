const fs = require('fs');

const path = 'components/GovHeader.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add imports
content = content.replace(
  'import { getSession, signOut } from "next-auth/react";',
  'import { getSession, signOut } from "next-auth/react";\nimport { getTranslations, TranslationSet } from "../lib/translations";'
);

// Add state for translations
content = content.replace(
  'const [sessionUser, setSessionUser] = useState<any>(null);',
  'const [sessionUser, setSessionUser] = useState<any>(null);\n  const [t, setT] = useState<TranslationSet>(getTranslations("en-IN"));'
);

// Add languageChanged listener in useEffect
const useEffectRegex = /setMounted\(true\);\n    \}\);\n  \}, \[\]\);/s;
content = content.replace(
  useEffectRegex,
  `setMounted(true);
    });

    const updateLang = () => {
      const stored = localStorage.getItem('preferredLang') || 'en-IN';
      setT(getTranslations(stored));
    };
    updateLang();
    window.addEventListener('languageChanged', updateLang);

    return () => {
      window.removeEventListener('languageChanged', updateLang);
    };
  }, []);`
);

// Replace NAV_ITEMS labels
content = content.replace(
  /const NAV_ITEMS = \[\s*\{\s*label: "Home", href: "\/"\s*\},\s*\{\s*label: "Offerings \/ Schemes", href: "\/schemes"\s*\},?\s*\];/,
  `const NAV_ITEMS = [
    { label: t.navHome, href: "/" },
    { label: t.navSchemes, href: "/schemes" },
  ];`
);

content = content.replace(
  /NAV_ITEMS\.push\(\{ label: "My Dashboard", href: "\/dashboard" \}\);/g,
  'NAV_ITEMS.push({ label: t.navDashboard, href: "/dashboard" });'
);
content = content.replace(
  /NAV_ITEMS\.push\(\{ label: "Connect", href: "\/connect" \}\);/g,
  'NAV_ITEMS.push({ label: t.navConnect, href: "/connect" });'
);
content = content.replace(
  /NAV_ITEMS\.push\(\{ label: "Verify Reports", href: "\/verify" \}\);/g,
  'NAV_ITEMS.push({ label: t.navVerify, href: "/verify" });'
);
content = content.replace(
  /NAV_ITEMS\.push\(\{ label: "Admin Analytics", href: "\/admin\/analytics" \}\);/g,
  'NAV_ITEMS.push({ label: t.navAnalytics, href: "/admin/analytics" });'
);
content = content.replace(
  /NAV_ITEMS\.push\(\{ label: "Feedback", href: "\/admin\/feedback" \}\);/g,
  'NAV_ITEMS.push({ label: t.navFeedback, href: "/admin/feedback" });'
);

// Replace Sign In / Sign Out / Search
content = content.replace(
  /href="\/login" className="text-sm font-bold text-blue-800 hover:text-blue-900"\s*>\s*Sign In\s*<\/Link>/g,
  'href="/login" className="text-sm font-bold text-blue-800 hover:text-blue-900">{t.navSignIn}</Link>'
);
content = content.replace(
  /onClick=\{.*\}\s*className="text-sm font-bold text-red-600 hover:text-red-700 underline"\s*>\s*Sign Out\s*<\/button>/s,
  `onClick={() => signOut()} className="text-sm font-bold text-red-600 hover:text-red-700 underline">{t.navSignOut}</button>`
);
content = content.replace(
  /placeholder="Search schemes by name, category, or code\.\.\. \(Press Enter\)"/g,
  'placeholder={`${t.schemesText} (Press Enter)`}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('GovHeader translated successfully!');
