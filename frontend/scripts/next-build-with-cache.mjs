import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = path.resolve(__dirname, '..');
const nextCacheDir = path.join(projectDir, '.next', 'cache');
const configuredCacheDir = process.env.NEXT_BUILD_CACHE_DIR?.trim();
const persistentCacheDir = configuredCacheDir
  ? path.resolve(projectDir, configuredCacheDir)
  : process.env.XDG_CACHE_HOME
    ? path.join(process.env.XDG_CACHE_HOME, 'gomcaddy-next-cache')
    : null;

function syncDirectory(sourceDir, targetDir) {
  rmSync(targetDir, { force: true, recursive: true });
  mkdirSync(path.dirname(targetDir), { recursive: true });
  cpSync(sourceDir, targetDir, { recursive: true });
}

if (persistentCacheDir && existsSync(persistentCacheDir)) {
  syncDirectory(persistentCacheDir, nextCacheDir);
  console.log(`[next-cache] Restored build cache from ${persistentCacheDir}`);
} else if (persistentCacheDir) {
  console.log(`[next-cache] No saved build cache yet. A warm cache will be saved to ${persistentCacheDir}`);
} else {
  console.log('[next-cache] No persistent cache directory detected. Running a normal Next.js build.');
}

const nextBinPath = require.resolve('next/dist/bin/next');
const buildResult = spawnSync(process.execPath, [nextBinPath, 'build'], {
  cwd: projectDir,
  env: process.env,
  stdio: 'inherit',
});

if (buildResult.status === 0 && persistentCacheDir && existsSync(nextCacheDir)) {
  syncDirectory(nextCacheDir, persistentCacheDir);
  console.log(`[next-cache] Saved build cache to ${persistentCacheDir}`);
}

if (buildResult.error) {
  throw buildResult.error;
}

process.exit(buildResult.status ?? 1);
