import fs from 'fs';
import path from 'path';

// In serverless environments (e.g. Vercel) the project directory is read-only.
// We seed /tmp/data/ from the bundled JSON files on first access and read/write
// from there so mutations work in production.

const IS_PROD = process.env.NODE_ENV === 'production';
const TMP_DIR = '/tmp/data';
const SRC_DIR = path.join(process.cwd(), 'data');

function ensureFile(filename: string): string {
  if (!IS_PROD) return path.join(SRC_DIR, filename);

  const tmpPath = path.join(TMP_DIR, filename);
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    const srcPath = path.join(SRC_DIR, filename);
    fs.copyFileSync(srcPath, tmpPath);
  }
  return tmpPath;
}

export function loadData<T>(filename: string): T[] {
  const filePath = ensureFile(filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

export function saveData<T>(filename: string, data: T[]): void {
  const filePath = ensureFile(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
