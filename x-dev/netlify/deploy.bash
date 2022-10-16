#!/usr/bin/env bash

readonly ROOT_DIR=$(readlink -e "$(dirname $0)/../..")
readonly DIVIDER="────────────────────────────────────────────────────────────────────────"

main() {
  show_versions
  do_cfc_data_build
  do_sveltejs_npm_install
  do_sveltejs_build
  do_hugo_npm_install
  do_hugo_build
}

# ---------------- Versions ----------------
show_versions() {
  echo -e "\n${DIVIDER}\nTASK: Versions"
  echo npm version: $(npm --version)
  echo python3 version: $(python3 --version)
}

# ---------------- CFC Data ----------------
do_cfc_data_build() {
  echo -e "\n${DIVIDER}\nTASK: CFC Data: Get from Google Sheets"
  set -e
  python3 "${ROOT_DIR}/x-dev/netlify/deploy-data.py"
}

# ---------------- SvelteJS ----------------
do_sveltejs_npm_install() {
  echo -e "\n${DIVIDER}\nTASK: SvelteJS: npm install"
  set -e
  cd "${ROOT_DIR}/sveltejs"
  npm install
}

do_sveltejs_build() {
  echo -e "\n${DIVIDER}\nTASK: SvelteJS: npm run rollup:build-prod"
  set -e
  cd "${ROOT_DIR}/sveltejs"
  npm run rollup:build-prod
}

# ---------------- Hugo ----------------
do_hugo_npm_install() {
  echo -e "\n${DIVIDER}\nTASK: Hugo: npm install"
  set -e
  cd "${ROOT_DIR}/hugo"
  npm install
}

do_hugo_build() {
  echo -e "\n${DIVIDER}\nTASK: Hugo: npm hugo:build"
  set -e
  cd "${ROOT_DIR}/hugo"
  npm run hugo:version
  npm run hugo:build
}

main

#=======================================================================
# Notes:
#  - Using deploy script instead of &&-chain of commands because
#    Netlify would not always do npm install so deploy would fail.
#    Could not find why so now this script always does npm install.
#  - Using bash, not python, because Netlify doesn't print stdout
#    in correct order (all subprocess first; then all print after).
#    Could not find why so using bash.
