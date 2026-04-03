import fs from 'fs';
import path from 'path';

export function loadData<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}
