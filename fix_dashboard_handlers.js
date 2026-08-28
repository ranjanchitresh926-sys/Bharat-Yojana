const fs = require('fs');

const file = 'app/dashboard/DashboardClient.tsx';
let content = fs.readFileSync(file, 'utf8');

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
  /const getStepIndex =/,
  `${handlerFunctions}\n  const getStepIndex =`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed missing handlers in DashboardClient.tsx');
