
var common = require('./common.webpack.config');

const mode = 'production';
const wpconfig = common.getWebpackConfig(mode);

module.exports = wpconfig;
