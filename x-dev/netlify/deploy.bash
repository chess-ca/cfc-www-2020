#!/usr/bin/env bash

readonly ROOT_DIR=$(readlink -e "$(dirname $0)/../..")
readonly DIVIDER="────────────────────────────────────────────────────────────────────────"

main() {
  do_npm_install
  do_cfc_data_build
  do_hugo_build
}

do_npm_install() {
  echo -e "\n${DIVIDER}\nTASK: npm install"
  set -e
  cd "${ROOT_DIR}/hugo"
  npm install
}

do_cfc_data_build() {
  echo -e "\n${DIVIDER}\nTASK: CFC Data Build from Google Sheets"
  set -e
  python3 --version
  python3 "${ROOT_DIR}/x-dev/netlify/deploy-cfc-data-gsheets.py" -o "${ROOT_DIR}/hugo/assets/ext"
}

do_hugo_build() {
  echo -e "\n${DIVIDER}\nTASK: Website Build (using Hugo)"
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
