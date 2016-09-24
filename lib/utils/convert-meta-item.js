const path = require('path');
const fs = require('fs');

module.exports = file => ({
  path: path.resolve(file),
  // this flags needs to show warnings like:
  // "${module}" does not exists. exptected at "${path}"
  isExists: fs.existsSync(file)
});
