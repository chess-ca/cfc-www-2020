const path = require('path');
const process = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const path_root = path.resolve(__dirname, '../..');
const path_src  = path_root + '/hugo/static-src';
const path_dest = path_root + '/hugo/static/built';
let is_prod = true;

function getWebpackConfig(mode) {
    is_prod = mode.toLowerCase().startsWith('prod');
    console.log('>>>> mode:', mode);

    const wpconfig = { mode:mode, module:{rules:[]}, plugins:[] };
    add_entry_output(wpconfig);
    add_scss(wpconfig);
    add_javascript(wpconfig);
    add_vuejs(wpconfig);
    return wpconfig;
}

function add_entry_output(wpconfig) {
    wpconfig.performance = {maxEntrypointSize: 300000};
    wpconfig.entry = {
        'site': path_src + '/site.bundle.webpack-entry.js',
    };
    wpconfig.output = {
        filename: '[name].bundle.js',
        path: path_dest,
    };
}

function add_scss(wpconfig) {
    // Ref: https://github.com/webpack-contrib/mini-css-extract-plugin
    const sass_opts = {
        outputStyle: is_prod ? 'compressed' : 'nested',
        includePaths: ['../../../x-dev/node_modules']
    };
    wpconfig.module.rules.push(
        {
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                {loader:MiniCssExtractPlugin.loader, options:{hmr:!is_prod},},
                'css-loader',
                {loader:'sass-loader', options:{sassOptions:sass_opts}}
            ]
        }
    );
    wpconfig.plugins.push(new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
        //chunkFilename: '[id].css',
    }));
}

function add_javascript(wpconfig) {
    wpconfig.resolve = wpconfig.resolve || {};
    wpconfig.resolve.modules = wpconfig.resolve.modules || [];
    wpconfig.resolve.modules.push(path_root+'/x-dev/node_modules');
}

function add_vuejs(wpconfig) {
    let vue_file = is_prod ? 'vue.min.js' : 'vue.js';
    // Ref: https://github.com/vuejs/vue-cli/issues/2754
    wpconfig.resolve = wpconfig.resolve || {};
    wpconfig.resolve.alias = wpconfig.resolve.alias || {};
    wpconfig.resolve.alias.vue =  `vue/dist/${vue_file}`;
    // Future Ref: https://github.com/microsoft/TypeScript-Vue-Starter
    // Ref: https://vue-loader.vuejs.org/guide/#manual-setup
    //wpconfig.rules.push({ test:/\.vue$/, loader: 'vue-loader' });
    //wpconfig.plugins.push( new VueLoaderPlugin() );
}

module.exports = {getWebpackConfig};