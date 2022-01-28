
import path from 'path';
// import del from 'rollup-plugin-delete';
import nodeResolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
// import scss from 'rollup-plugin-scss';
// import { terser } from 'rollup-plugin-terser';
import sizes from 'rollup-plugin-sizes';

const project_dir = path.resolve(__dirname, '..');
const src_dir = path.resolve(project_dir, 'sveltejs');
const built_dir = path.resolve(project_dir, 'hugo/assets/built');

const isDev = process.env.BUILD.toLowerCase().startsWith('dev');

const ratings_build = {
    input: {
        ratings: path.resolve(src_dir, 'ratings/_main.js'),
    },
    output: {
        dir: built_dir,
        entryFileNames: '[name].js',
        globals: {},
        // format: 'es',       // for downstream bundlers (Hugo pipes, etc)
        format: 'iife',     // for browser
    },
    plugins: [
        // del({
        //     targets: [built_dir],
        //     force: true, runOnce: true //, verbose: true
        // }),
        nodeResolve({
            moduleDirectories: ['hugo/node_modules', 'node_modules']
        }),
        svelte({
            // include: path.resolve(src_dir, 'javascript/components/**/*.svelte'),
            emitCss: false,
            compilerOptions: {
                dev: isDev
                // customElements mount in Shadow DOM; hides external CSS (like Bulma.io)
                // customElement: true
            }
        }),
        // scss({
        //     output: path.resolve(built_dir, 'site.css'),
        //     outputStyle: isDev ? 'expanded': 'compressed',
        //     // includePaths: ['../../../x-dev/node_modules']
        //     watch: src_dir+'/css'
        // }),
        // terser(),
        (isDev) ? sizes({details: false}) : null
    ],
    watch: { clearScreen: false }
}

export default [ratings_build];
