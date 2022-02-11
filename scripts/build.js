const glob = require('fast-glob');
const fse = require('fs-extra');
const path = require('path');
const { program } = require('commander');

const ts = require('typescript');

async function doBuild(dir, out) {
  const configFile = ts.findConfigFile(dir, ts.sys.fileExists, 'tsconfig.json');
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);

  config.include = ['src', '*.d.ts'];
  config.exclude = [
    'node_modules',
    'dist',
    'lib',
    '**/*.stories.*',
    '**/stories',
    '**/demos',
  ];

  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    dir
  );

  options.outDir = out;
  options.noEmit = false;
  options.declaration = true;
  options.sourceMap = true;

  const tsProgram = ts.createProgram(fileNames, options);

  const { diagnostics, emitSkipped } = tsProgram.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(tsProgram)
    .concat(diagnostics, errors);

  if (allDiagnostics.length) {
    const formatHost = {
      getCanonicalFileName: path => path,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    const message = ts.formatDiagnostics(allDiagnostics, formatHost);
    console.warn(message);
  }

  if (emitSkipped) {
    process.exit(1);
  }
}

async function doCopy(dir, out) {
  const src = path.join(dir, 'src');
  const pattern = ['**/*'];
  const ignore = ['**/*.{ts,tsx}', '**/demos', '**/stories'];
  const files = await glob(pattern, { cwd: src, ignore });

  files.forEach(
    async x => await fse.copy(path.join(src, x), path.join(out, x))
  );
}

async function doPackage(dir, out) {
  const pkgPath = path.join(dir, 'package.json');
  const newPath = path.join(out, 'package.json');
  const pkgData = await fse.readJSON(pkgPath, {
    encoding: 'utf8',
  });

  const { main, files, scripts, devDependencies, ...othData } = pkgData;
  const newData = {
    ...othData,
  };

  await fse.ensureDir(out);
  await fse.writeJSON(newPath, newData, {
    encoding: 'utf8',
    spaces: 2,
  });

  // copy additional files
  ['README.md', 'LICENSE.md', 'CHANGELOG.md', 'LICENSE'].forEach(name => {
    const srcFile = path.join(dir, name);
    const newFile = path.join(out, name);
    if (fse.existsSync(srcFile)) {
      fse.copyFile(srcFile, newFile);
    }
  });
}

async function action(dir, { outDir = 'dist' } = {}) {
  await doBuild(dir, outDir);
  await doCopy(dir, outDir);
  await doPackage(dir, outDir);
}

program
  .argument('<package>', 'package directory')
  .option('-o, --out-dir <dir>', 'output directory')
  .action(action);

program.parse(process.argv);
