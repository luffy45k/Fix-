import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'www');
const files = ['index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'sw.js', 'assets'];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of files) {
  const source = resolve(root, file);
  if (!existsSync(source)) throw new Error(`Missing web asset: ${file}`);
  cpSync(source, resolve(output, file), { recursive: true });
}

console.log(`Built lightweight web bundle in ${output}`);
