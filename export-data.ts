import fs from 'fs';
import path from 'path';
import { services } from './src/data/services';
import { industries } from './src/data/industries';
import { caseStudies } from './src/data/case-studies';
import { positions } from './src/data/careers';

// Helper to sanitize objects (remove functions/icons)
function sanitize(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key === 'icon') {
        newObj[key] = obj[key]?.render?.name || obj[key]?.displayName || obj[key]?.name || 'Icon';
      } else {
        newObj[key] = sanitize(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

const dest = path.join(__dirname, 'laravel', 'database', 'data');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

fs.writeFileSync(path.join(dest, 'services.json'), JSON.stringify(sanitize(services), null, 2));
fs.writeFileSync(path.join(dest, 'industries.json'), JSON.stringify(sanitize(industries), null, 2));
fs.writeFileSync(path.join(dest, 'case_studies.json'), JSON.stringify(sanitize(caseStudies), null, 2));
fs.writeFileSync(path.join(dest, 'careers.json'), JSON.stringify(sanitize(positions), null, 2));

console.log('Exported data to laravel/database/data/');
