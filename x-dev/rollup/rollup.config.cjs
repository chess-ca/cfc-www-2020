
const path = require('path');
const nodeResolve = require('@rollup/plugin-node-resolve')
// const scss = require('rollup-plugin-scss');
const vue = require('rollup-plugin-vue');
const { terser } = require('rollup-plugin-terser');
const sizes = require('rollup-plugin-sizes');

const src_dir = path.resolve(__dirname, '../../hugo/static-src');
const dest_dir = path.resolve(__dirname, '../../hugo/static/built');

const isDev = process.env.BUILD.toLowerCase().startsWith('dev');

const js_build = {
    external: ['vue', 'vue-router'],
    input: {cfc: path.resolve(src_dir, 'cfc.bundle.rollup-entry.js')},
    output: {
        dir: dest_dir,
        entryFileNames: '[name].bundle.js',
        globals: {vue: 'Vue', 'vue-router': 'VueRouter'},
        format: 'iife'
    },
    plugins: [
        nodeResolve.nodeResolve({
            moduleDirectories: ['node_modules', 'C:\\_\\IT\\Projects\\CFC\\CFC-Website\\CFC-website.Code\\x-dev\\node_modules']
        }),
        // scss({
        //     output:'../hugo/static/built/cfc.bundle.css',
        //     outputStyle: isDev ? 'nested' : 'compressed',
        //     //includePaths: ['../../../x-dev/node_modules']
        // }),
        vue(),
        isDev ? null : terser(),
        sizes({details: false})
    ]
};

module.exports = [js_build];
