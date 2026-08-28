const fs = require('fs');

const file = 'components/TrackInterestButton.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add hasConsented state
content = content.replace(
  /const \[status, setStatus\] = useState<'idle' \| 'checking' \| 'loading' \| 'success' \| 'error' \| 'forbidden'>\('checking'\);/,
  `const [status, setStatus] = useState<'idle' | 'checking' | 'loading' | 'success' | 'error' | 'forbidden'>('checking');
  const [hasConsented, setHasConsented] = useState(false);`
);

// Update payload to include consentVersion
content = content.replace(
  /body: JSON\.stringify\(\{[\s\S]*?schemeId: scheme\.code,[\s\S]*?schemeTitle: scheme\.title,[\s\S]*?profileSnapshot: profile,[\s\S]*?citizenId[\s\S]*?\}\),/,
  `body: JSON.stringify({
          schemeId: scheme.code,
          schemeTitle: scheme.title,
          profileSnapshot: profile,
          citizenId,
          consentVersion: "v1.0"
        }),`
);

// Update UI to add age gate and consent
content = content.replace(
  /return \([\s\S]*?<div className="bg-blue-50 border border-blue-200 p-5 rounded-md mt-6">[\s\S]*?<h3 className="font-bold text-blue-900 mb-2">You are eligible for this scheme!<\/h3>[\s\S]*?<p className="text-sm text-blue-800 mb-4">[\s\S]*?Since you meet the criteria based on your profile, you can track this scheme in your personal dashboard to simulate the application process\.[\s\S]*?<\/p>[\s\S]*?<button[\s\S]*?onClick=\{handleTrack\}[\s\S]*?disabled=\{status === 'loading'\}[\s\S]*?className="flex items-center gap-2 bg-\[#0B3D91\] hover:bg-\[#1a4fa0\] text-white px-5 py-2\.5 rounded-md font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-\[#0B3D91\]"[\s\S]*?>[\s\S]*?\{status === 'loading' \? <Loader2 size=\{18\} className="animate-spin" \/> : <BookmarkPlus size=\{18\} \/>\}[\s\S]*?\{status === 'loading' \? 'Saving\.\.\.' : 'Track My Interest in This Scheme'\}[\s\S]*?<\/button>[\s\S]*?<p className="text-xs text-blue-600\/80 font-medium mt-3 italic">[\s\S]*?\* Note: This is an internal tool feature for tracking purposes only\. It does NOT submit a real application to the government\.[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?\);/,
  `const isUnderage = profile.age < 18;

  if (isUnderage) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-md mt-6">
        <h3 className="font-bold text-amber-900 mb-2">Age Restriction</h3>
        <p className="text-sm text-amber-800">
          Because you are under 18 years old, we cannot collect or store your personal data to track this scheme. 
          The eligibility check works locally, but saving this data requires you to be 18 or older.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-5 rounded-md mt-6">
      <h3 className="font-bold text-blue-900 mb-2">You are eligible for this scheme!</h3>
      <p className="text-sm text-blue-800 mb-4">
        Since you meet the criteria based on your profile, you can track this scheme in your personal dashboard to simulate the application process.
      </p>

      <div className="mb-4 p-3 bg-white border border-blue-100 rounded-md">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 w-4 h-4 text-[#0B3D91] border-gray-300 rounded focus:ring-[#0B3D91]"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I explicitly consent to the collection and storage of my profile data for the purpose of tracking my application status. 
            I have read and agree to the <a href="/privacy" className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Privacy Notice</a>.
          </span>
        </label>
      </div>

      <button
        onClick={handleTrack}
        disabled={status === 'loading' || !hasConsented}
        className="flex items-center gap-2 bg-[#0B3D91] hover:bg-[#1a4fa0] text-white px-5 py-2.5 rounded-md font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
      >
        {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <BookmarkPlus size={18} />}
        {status === 'loading' ? 'Saving...' : 'Track My Interest in This Scheme'}
      </button>
      <p className="text-xs text-blue-600/80 font-medium mt-3 italic">
        * Note: This is an internal tool feature for tracking purposes only. It does NOT submit a real application to the government.
      </p>
    </div>
  );`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched TrackInterestButton');
