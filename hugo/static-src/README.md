
# Static Content

IMPORTANT: Put images and other static files in `/hugo/static`.

`/static` is where Hugo gets the static files when it builds `/public`.
We only want 1 copy of these files in git. Put that 1 copy in `/static`.

Some static files (CSS & JS) need to be "built" from source files.
For these, the source files go in `/static-src`.
When built by Webpack, the generated files will be written to `/static/built`.
When Hugo runs, it will find all the static files in `/static`.

## Development Set-up
* CSS & Javascript may include libraries obtained vi `npm`.
  These are not checked-in to git, so they must be installed.
  To keep the root directory clean, add them to this project's
  "x-dev" directory (x-dev/package.json --> x-dev/node_modules).

## CSS
* CSS is developed using the SCSS variant of Sass.
* CSS builds on the [Bulma](https://Bulma.io) framework.
* `css/style.scss` is the one entry point for include all CSS.
* Built and bundled by Webpack. See x-dev/webpack.

## JavaScript
* JS is developed using the ES6/ES2015 variant of JavaScript.
  * Modern browser all understand this.  IE11 is dead!
  * For small to medium codebases, we believe that 
    transpiling Typescript or ES7+ is not worth the complexity.
    Best to keep well behind the bleed edge, especially in 
    the super tumultuous world of front-end Javascript ~2019. 
* Javascript coding assumptions
  * Use ES modules.  Webpack will read these and bundle dependencies.
  * VueJS will bundled (not loaded separately from a CDN).
