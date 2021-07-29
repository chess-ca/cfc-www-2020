
# README - hugo/assets

- The `hugo/assets` directory is where [Hugo Pipes](https://gohugo.io/hugo-pipes/)
  looks for files when building Javascript and CSS/SCSS resources.
    
## `hugo/assets/js` - Javascript

## `hugo/assets/css` - CSS / SCSS

## `hugo/assets/ext` - External

- Contains files that are created during the Netlify build process.
  - Example: The Netlify build fetches the list of events from a Google Sheet,
    converts it to Javascript, and writes it to `hugo/assets/ext/cfc-events.js`.
    Shortly afterwards, Hugo will use this file as a resource.
- This directory is ignored by Git.
  - Files created by the Netlify build process should not be saved in Git.
  