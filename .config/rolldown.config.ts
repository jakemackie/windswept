import type { RolldownOptions } from 'rolldown';
import { defineConfig } from 'rolldown';
import { builtinModules } from 'module';
import path from 'node:path';
import fs from 'node:fs';

function getAllTsFiles(dir: string, baseDir: string = dir): Record<string, string> {
  const entries: Record<string, string> = {};
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      Object.assign(entries, getAllTsFiles(fullPath, baseDir));
    } else if (file.name.endsWith('.ts') && !file.name.endsWith('.d.ts')) {
      const relativePath = path.relative(baseDir, fullPath);
      const entryKey = relativePath.replace(/\.ts$/, '').replace(/\\/g, '/');
      entries[entryKey] = fullPath;
    }
  }
  
  return entries;
}

const config: RolldownOptions = {
  input: getAllTsFiles(path.resolve(process.cwd(), 'src')),
  output: {
    dir: 'dist',
    format: 'es',
    entryFileNames: '[name].js',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  external: [
    ...builtinModules.map(m => `node:${m}`),
    ...builtinModules,
    '@prisma/client',
    'discord.js',
    'dotenv',
    'fast-average-color-node',
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  platform: 'node',
};

export default defineConfig(config);
