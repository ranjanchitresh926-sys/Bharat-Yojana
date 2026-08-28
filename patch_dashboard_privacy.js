const fs = require('fs');

const file = 'app/dashboard/DashboardClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add consents state
content = content.replace(
  /const \[applications, setApplications\] = useState<Application\[\]>\(\[\]\);/,
  `const [applications, setApplications] = useState<Application[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);`
);

// 2. Update fetch logic
content = content.replace(
  /setApplications\(data\.applications \|\| \[\]\);\n\s*setLoading\(false\);/,
  `setApplications(data.applications || []);
        setConsents(data.consentRecords || []);
        setLoading(false);`
);

// 3. Add handle functions
const handlerFunctions = `
  const handleWithdraw = async () => {
    const citizenId = localStorage.getItem('citizenId');
    if (!citizenId) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId, action: 'withdraw' })
      });
      if (res.ok) {
        // Refresh data locally
        setConsents(prev => prev.map(c => c.withdrawnAt ? c : { ...c, withdrawnAt: new Date().toISOString() }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDeleteAll = async () => {
    const citizenId = localStorage.getItem('citizenId');
    if (!citizenId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(\`/api/applications?citizenId=\${citizenId}\`, { method: 'DELETE' });
      if (res.ok) {
        setApplications([]);
        setConsents(prev => prev.map(c => c.withdrawnAt ? c : { ...c, withdrawnAt: new Date().toISOString() }));
        setShowConfirm(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };
`;

content = content.replace(
  /const getStatusColor =/,
  `${handlerFunctions}\n\n  const getStatusColor =`
);

// 4. Add UI section before </main>
const dataRightsSection = `
        {/* Data Rights & Privacy Section */}
        {!loading && (applications.length > 0 || consents.length > 0) && (
          <div className="mt-12 bg-white rounded-md shadow-sm border border-red-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Data & Privacy</h2>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              In accordance with our Privacy Notice, you have the right to view, withdraw consent for, and delete your personal data. 
              Below is the exact data currently stored on our servers linked to your device identifier.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 max-h-60 overflow-y-auto font-mono text-xs text-gray-600">
              <p className="font-bold text-gray-900 mb-2">Stored Applications ({applications.length}):</p>
              <pre>{JSON.stringify(applications.map(a => ({ id: a.id, scheme: a.schemeTitle, status: a.status, profileSnapshot: a.profileSnapshot })), null, 2)}</pre>
              <p className="font-bold text-gray-900 mt-4 mb-2">Stored Consent Records ({consents.length}):</p>
              <pre>{JSON.stringify(consents, null, 2)}</pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWithdraw}
                disabled={isWithdrawing || consents.every(c => c.withdrawnAt)}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm rounded transition-colors disabled:opacity-50"
              >
                {isWithdrawing ? 'Processing...' : 'Withdraw Consent (Stop future tracking)'}
              </button>

              {!showConfirm ? (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm rounded transition-colors"
                >
                  Delete All My Data
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-red-50 p-2 border border-red-200 rounded">
                  <span className="text-sm font-bold text-red-700 ml-2">Are you sure? This is irreversible.</span>
                  <button 
                    onClick={handleDeleteAll}
                    disabled={isDeleting}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
`;

content = content.replace(
  /<\/main>/,
  `${dataRightsSection}\n      </main>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched DashboardClient UI');
