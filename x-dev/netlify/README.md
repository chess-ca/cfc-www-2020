
# Netlify README

## Deploys

### Triggers
- Deploys are triggered by:
  - Code changes pushed to Gitlab (master branch).
    Gitlab was configured to notify Netlify whenever changes
    are pushed to the master branch.
  - CFC data changes in Google Sheets and the menu option 
    to rebuild the website is invoked.  These send a request
    to Netlify to do a rebuild.  Each gsheet has its own
    rebuild URL so you can tell what caused a rebuild.

### Processing
- Netlify retrieves the master branch of code from Gitlab.
- Netlify looks at `netlify.toml` file in the root directory
  of the code it has just retrieved from Gitlab.
  - `netlify.toml` tells Netlify that the command to build the
    website is `bash x-dev/netlify/deploy.bash` (also in the
    code it has just retrieved from Gitlab).
- `deploy.bash` does:
  - Calls `npm install` to install the required libraries
    including: Hugo (extended version), Bulma, and AlpineJS.
  - Calls `deploy-cfc-data-gsheets.py` to get CFC data (events, 
    news flashes, clubs) from Google Sheets.
  - Calls `npm run hugo:build` to build the website.
    Hugo Pipes will build the CSS and Javascript too.
    - Note: Calling `hugo` directly will use the version of Hugo
      defined in `netlify.toml` / `HUGO_VERSION`.
      Calling via `npm` ensures the same version of Hugo used in
      development is also used in production (no need to remember
      to update `HUGO_VERSION` when upgrading Hugo).