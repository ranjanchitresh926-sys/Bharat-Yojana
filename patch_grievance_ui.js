const fs = require('fs');

const file = 'app/verify/VerifyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add handleGrievanceAction
const handleActionCode = `
  const handleGrievanceAction = async (id: string, action: 'resolved') => {
    try {
      const res = await fetch('/api/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      });
      if (res.ok) {
        setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: action } : g));
      }
    } catch (e) {
      console.error(e);
    }
  };
`;

content = content.replace(
  /const handleReportAction = async/,
  `${handleActionCode}\n  const handleReportAction = async`
);

// Update UI to use g.status and add button
content = content.replace(
  /<span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded uppercase">Pending<\/span>/,
  `{g.status === 'pending' ? (
                      <>
                        <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded uppercase">Pending</span>
                        <button 
                          onClick={() => handleGrievanceAction(g.id, 'resolved')}
                          className="flex items-center justify-center p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                          title="Mark as Resolved"
                        >
                          <Check size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded uppercase">Resolved</span>
                    )}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched VerifyDashboard UI');
