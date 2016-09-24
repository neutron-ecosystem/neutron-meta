const glob = require('glob');
const path = require('path');
const convertMetaItem = require('./utils/convert-meta-item');

const SCOPE_FILE = 'scope.js';
const APPLICATION_SPEC = 'package.json';
const NEUTRON_JSON = 'neutron.json';

const getWorkspacePath = (dir, pattern) => {
  return path.resolve(dir, pattern);
};

const finder = (dir, pattern, options) => new Promise((resolve, reject) => {
  const workspacePath = getWorkspacePath(dir, pattern);
  glob(workspacePath, options, (err, files) => {
    if (err) {
      reject(err);
    } else {
      resolve(files);
    }
  });
});

const processModules = files => {
  return files.map(file => {
    const mod = convertMetaItem(file);
    const dir = path.dirname(file);

    return Object.assign(mod, {
      main: require.resolve(dir)
    });
  });
};

const findModules = dir => {
  return finder(dir, '**/*/package.json', {
    ignore: ['**/node_modules/**']
  }).then(processModules);
};

const findModulesAsDependecies = dir => {
  return finder(dir, 'node_modules/*-neutron-function/package.json')
    .then(processModules);
};

const findHigherOrderFunctions = dir => {
  return finder(dir, 'higher-order/**/*.js', {
    ignore: ['**/node_modules/**']
  }).then(files => files.map(file => {
    const processed = convertMetaItem(file);

    return Object.assign({}, processed, {
      id: path.basename(file, '.js')
    });
  }));
};

module.exports = ({
  dir
}) => {
  return Promise.all([
    findModules(dir),
    findModulesAsDependecies(dir),
    findHigherOrderFunctions(dir)
  ]).then(([modules, modulesAsDependecies, higherOrder]) => {
    const meta = {
      modules: modules.concat(modulesAsDependecies),
      higherOrder
    }

    // add application package.json
    const appSpecPath = path.join(dir, APPLICATION_SPEC);
    const appSpecFile = convertMetaItem(appSpecPath);
    meta.spec = appSpecFile;

    // add application package.json
    const scopePath = path.join(dir, SCOPE_FILE);
    const scopeFile = convertMetaItem(scopePath);
    meta.scope = scopeFile;


    // add neutorn json
    const neutronJsonPath = path.join(dir, NEUTRON_JSON);
    const neutonJson = convertMetaItem(neutronJsonPath);
    meta.neutron = neutonJson;

    return meta;
  });
};
