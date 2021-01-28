const withTM = require("next-transpile-modules")([
    "siriwave"
  ]);
  
  module.exports = withTM({
    // Target must be serverless
    // target: 'serverless'
  });