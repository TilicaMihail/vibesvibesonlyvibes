import fs from 'fs';
import path from 'path';

export function loadData<T>(filename: string): T[] {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

export function saveData<T>(filename: string, data: T[]): void {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
