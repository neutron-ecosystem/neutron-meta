const glob = require('glob');
const path = require('path');
const convertMetaItem = require('./convert-meta-item');

const GLOB_OPTIONS = {
  ignore: ['**/node_modules/**']
};

module.exports = (dir, pattern, options = GLOB_OPTIONS) => new Promise((resolve, reject) => {
  glob(`${path.resolve(dir)}${pattern}`, options, (err, files) => {
    if (err) {
      reject(err);
    } else {
      const processed = files.map(file => convertMetaItem(file));
      resolve(processed);
    }
  });
});
