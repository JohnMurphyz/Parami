/**
 * Generate static TypeScript files from JSON
 *
 * Reads FIRESTORE_CONTENT_COMPLETE.json and generates:
 * - data/paramis.ts
 * - data/expandedPractices.ts
 *
 * This ensures static fallback matches Firestore content
 */

import * as fs from 'fs';
import * as path from 'path';

const jsonPath = path.join(__dirname, '..', 'FIRESTORE_CONTENT_COMPLETE.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(jsonContent);

// Generate paramis.ts
const paramisContent = `import { Parami } from '../types';

export const PARAMIS: Parami[] = ${JSON.stringify(Object.values(data.paramis), null, 2)};

export function getParamiById(id: number): Parami | undefined {
  return PARAMIS.find(p => p.id === id);
}

export function getAllParamis(): Parami[] {
  return PARAMIS;
}
`;

// Generate expandedPractices.ts
const expandedPracticesData: Record<number, any[]> = {};
for (const [id, expandedData] of Object.entries(data.expandedPractices)) {
  expandedPracticesData[parseInt(id)] = (expandedData as any).practices;
}

const expandedPracticesContent = `import { Practice } from '../types';

export const EXPANDED_PRACTICES: Record<number, Practice[]> = ${JSON.stringify(expandedPracticesData, null, 2)};

export function getExpandedPractices(paramiId: number): Practice[] {
  return EXPANDED_PRACTICES[paramiId] || [];
}
`;

// Write files
const dataDir = path.join(__dirname, '..', 'data');
fs.writeFileSync(path.join(dataDir, 'paramis.ts'), paramisContent);
fs.writeFileSync(path.join(dataDir, 'expandedPractices.ts'), expandedPracticesContent);

console.log('✅ Generated static TypeScript files from JSON');
console.log('  - data/paramis.ts');
console.log('  - data/expandedPractices.ts');
console.log('\n📊 Content matches FIRESTORE_CONTENT_COMPLETE.json');
