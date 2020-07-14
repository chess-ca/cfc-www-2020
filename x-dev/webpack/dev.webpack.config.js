
var common = require('./common.webpack.config');

const mode = 'development';
const wpconfig = common.getWebpackConfig(mode);

wpconfig.watchOptions = {
    ignored: ['node_modules/**'],
    poll: 1000
};

module.exports = wpconfig;
