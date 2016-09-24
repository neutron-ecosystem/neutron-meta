const path = require('path');
const loadMeta = require('..');

const options = {
  dir: './__tests__/test-workspace'
};

describe('load meta', () => {
  let modules = null;
  let higherOrder = null;
  let scope = null;
  let spec = null;

  beforeAll(() => {
    return loadMeta(options).then(meta => {
      modules = meta.modules;
      higherOrder = meta.higherOrder;
      scope = meta.scope;
      spec = meta.spec;
    });
  });

  it('correct number of modules and higher oreder func', () => {
    expect(modules.length).toEqual(3);
    expect(higherOrder.length).toEqual(1);
  });

  it('correct modules values', () => {
    expect(modules[0]).toEqual({
      path: path.resolve('__tests__/test-workspace/modules/bar/package.json'),
      main: path.resolve('__tests__/test-workspace/modules/bar/bar.js'),
      isExists: true
    });

    expect(modules[1]).toEqual({
      path: path.resolve('__tests__/test-workspace/modules/foo/package.json'),
      main: path.resolve('__tests__/test-workspace/modules/foo/index.js'),
      isExists: true
    });

    expect(modules[2]).toEqual({
      path: path.resolve('__tests__/test-workspace/node_modules/baz-neutron-function/package.json'),
      main: path.resolve('__tests__/test-workspace/node_modules/baz-neutron-function/index.js'),
      isExists: true
    });
  });

  it('correct higher order values', () => {
    expect(higherOrder[0]).toEqual({
      path: path.resolve('__tests__/test-workspace/higher-order/getBaz.js'),
      id: 'getBaz',
      isExists: true
    });
  });

  it('application package.json is not exists', () => {
    expect(spec).toEqual({
      path: path.resolve('__tests__/test-workspace/package.json'),
      isExists: false
    });
  });

  it('conext module', () => {
    expect(scope).toEqual({
      path: path.resolve('__tests__/test-workspace/scope.js'),
      isExists: true
    });
  });
});
