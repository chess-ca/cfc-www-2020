
import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sizes from 'rollup-plugin-sizes';

const project_dir = path.resolve(__dirname, '..');
const src_dir = path.resolve(project_dir, 'sveltejs');
const built_dir = path.resolve(project_dir, 'hugo/assets/built');

const isDev = String(process.env.BUILD).toLowerCase().startsWith('dev');
console.log('Building SvelteJS for ' + (isDev ? 'development' : 'non-development'));

const ratings_build = {
    input: {
        //@@@@ main: path.resolve(src_dir, 'main/_main.ts'),
        ratings: path.resolve(src_dir, 'ratings/_main.js')
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
        // terser(),
        (isDev) ? sizes({details: false}) : null
    ],
    watch: { clearScreen: false }
}

export default [ratings_build];
