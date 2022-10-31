
import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sizes from 'rollup-plugin-sizes';

const project_dir = path.resolve(__dirname, '..');
const src_dir = path.resolve(project_dir, 'sveltejs');
const built_dir = path.resolve(project_dir, 'hugo/assets/built');

const isDev = String(process.env.BUILD).toLowerCase().startsWith('dev');
console.log('Building SvelteJS for ' + (isDev ? 'development' : 'non-development'));

export default [
    build_cfg('ratings', 'ratings/_main.js'),
    build_cfg('main', 'main/_main.js'),
];

function build_cfg(cfg_name, src) {
    const cfg = { input: {}, output: {}, plugins: []};
    cfg.input[cfg_name] = path.resolve(src_dir, src);
    cfg.output = {
        dir: built_dir,
        entryFileNames: '[name].js',
        globals: {},
        format: 'es'     // 'iife' for browser; 'es' for downstream bundlers.
    };
    cfg.plugins = [
        nodeResolve({
            //@@@@ moduleDirectories: ['sveltejs/node_modules', 'node_modules']
        }),
        svelte({
            // include: path.resolve(src_dir, 'javascript/components/**/*.svelte'),
            emitCss: false,
            compilerOptions: {
                dev: isDev
                // customElement: true      // these mount in Shadow DOM; hides external CSS (like Bulma.io)
            }
        }),
        // scss({
        //     output: path.resolve(built_dir, 'site.css'),
        //     outputStyle: isDev ? 'expanded': 'compressed',
        //     // includePaths: ['../../../x-dev/node_modules']
        //     watch: src_dir+'/css'
        // }),
        (isDev) ? sizes({details: false}) : null
    ];
    cfg['watch'] = { clearScreen: false, buildDelay: 500 };
    return cfg;
}
