// ts-node.esm.cjs
const tsNode = require('ts-node');

tsNode.register({
  transpileOnly: true,
  esm: true,
  experimentalSpecifierResolution: 'node',
  module: 'esnext'
});