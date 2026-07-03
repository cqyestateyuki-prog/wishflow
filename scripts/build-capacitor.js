/**
 * Capacitor shell build / Capacitor 壳静态构建
 *
 * Next.js `output: 'export'` cannot build API route handlers, so this script
 * temporarily moves app/api aside, builds the static export with the
 * production API base baked in, then restores it. The shell calls the live
 * API at NEXT_PUBLIC_API_BASE (CORS is already configured in next.config.js).
 *
 * Usage: npm run build:cap  (then: npx cap sync)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const apiDir = path.join(root, 'app', 'api');
const apiBackup = path.join(root, '.api-excluded');

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://wishflow-ruddy.vercel.app';

if (!fs.existsSync(apiDir)) {
  console.error('app/api not found — is it already moved? Check .api-excluded.');
  process.exit(1);
}

fs.renameSync(apiDir, apiBackup);
try {
  execSync('npx next build', {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      BUILD_TARGET: 'capacitor',
      NEXT_PUBLIC_API_BASE: API_BASE,
    },
  });
} finally {
  fs.renameSync(apiBackup, apiDir);
}

console.log(`\nCapacitor web build complete → out/ (API base: ${API_BASE})`);
console.log('Next: npx cap sync && npx cap run ios|android');
