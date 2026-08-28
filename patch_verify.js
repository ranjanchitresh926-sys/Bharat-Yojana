const fs = require('fs');

const file = 'app/verify/VerifyDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add grievances state
content = content.replace(
  /const \[feedback, setFeedback\] = useState<any\[\]>\(\[\]\);/,
  `const [feedback, setFeedback] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);`
);

// Update Promise.all
content = content.replace(
  /fetch\('\/api\/feedback'\)\.then\(res => res\.json\(\)\)/,
  `fetch('/api/feedback').then(res => res.json()),
      fetch('/api/grievances').then(res => res.json())`
);

content = content.replace(
  /\]\)\.then\(\(\[reportsData, appsData, feedbackData\]\) => \{/,
  `]).then(([reportsData, appsData, feedbackData, grievancesData]) => {`
);

content = content.replace(
  /setFeedback\(feedbackData\.feedback \|\| \[\]\);/,
  `setFeedback(feedbackData.feedback || []);
      setGrievances(grievancesData.grievances || []);`
);

// We need to figure out how panels are rendered. Let's see if there's a grid.
// Typically there are sections like "h2 ... Applications", "h2 ... Reports", etc.
// Let's just append the Grievances section before the </main> closing tag.
// We can use a regex to insert before </main>
const grievanceSection = `
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8 mt-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <AlertTriangle className="text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Privacy Grievances</h2>
            <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
              {grievances.length} total
            </span>
          </div>

          <div className="space-y-4">
            {grievances.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-8">No privacy grievances logged.</p>
            ) : (
              grievances.map(g => (
                <div key={g.id} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-900">{g.requestType.toUpperCase()}</span>
                      <span className="text-xs text-gray-500">{new Date(g.receivedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">{g.email}</p>
                    <p className="text-sm text-gray-800 bg-white p-3 border border-gray-100 rounded-md mt-2">{g.details}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-800 rounded uppercase">Pending</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
`;

content = content.replace(/<\/main>/, `${grievanceSection}\n      </main>`);

fs.writeFileSync(file, content, 'utf8');
console.log('Patched VerifyDashboard');
