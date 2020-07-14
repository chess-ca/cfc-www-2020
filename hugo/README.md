
# Hugo README

This project uses the non-extended (no Sass/SCSS support) version of Hugo.
Since a gulp pre-commit build of Javascript (ex Svelte) is needed anyways, 
there is little advantage to having Hugo build the Sass/SCSS too. 

Hugo is installed via the npm [hugo-bin](https://www.npmjs.com/package/hugo-bin) package.
This is done so that Netlify will install the same Hugo version when it builds the site.

The version of "hugo-bin" does not match the version of Hugo.
For example, hugo-bin 0.53.6 installs Hugo 0.68.3.
