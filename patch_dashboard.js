const fs = require('fs');

const path = 'app/dashboard/DashboardClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';",
  `import { AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '../../components/TranslationProvider';
import { schemeTranslations } from '../../lib/schemeTranslations';`
);

content = content.replace(
  "const [applications, setApplications] = useState<Application[]>([]);",
  `const [applications, setApplications] = useState<Application[]>([]);
  const { lang } = useTranslation();`
);

content = content.replace(
  '{app.schemeTitle}',
  '{schemeTranslations[lang as keyof typeof schemeTranslations]?.[app.schemeId] || app.schemeTitle}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('DashboardClient patched!');
