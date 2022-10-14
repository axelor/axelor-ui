const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');
const proc = require('child_process');

const baseDir = path.normalize(path.join(__dirname, '..'));
const packagesDir = path.join(baseDir, 'packages');

glob.sync(['*'], { cwd: packagesDir, onlyDirectories: true }).forEach(dir => {
  const name = `@axelor-ui/${dir}`;
  const dist = path.join(packagesDir, name, 'dist');

  console.log(`Building ${name}`);

  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
  }

  proc.execSync(`yarn workspace ${name} build`);
});
