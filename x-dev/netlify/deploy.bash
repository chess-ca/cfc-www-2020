#!/usr/bin/env bash

readonly ROOT_DIR=$(readlink -e "$(dirname $0)/../..")
readonly DIVIDER="────────────────────────────────────────────────────────────────────────"

main() {
  do_npm_install
  do_npm_install_old
  do_rollup_build
  do_events_build
  do_clubs_build
  do_hugo_build
}

do_npm_install() {
  echo -e "\n${DIVIDER}\nTASK: npm install"
  set -e
  cd "${ROOT_DIR}/hugo"
  npm install
}

do_npm_install_old() {
  echo -e "\n${DIVIDER}\nTASK: npm install (Old/Temp while moving to AlpineJS)"
  set -e
  cd "${ROOT_DIR}/x-dev"
  npm install
}

do_rollup_build() {
  echo -e "\n${DIVIDER}\nTASK: JavaScript Build (using Rollup)"
  set -e
  cd "${ROOT_DIR}/x-dev"
  npm run rollup:build-prod
}

do_events_build() {
  echo -e "\n${DIVIDER}\nTASK: Upcoming Events Build"
  set -e
  python3 --version
  python3 "${ROOT_DIR}/x-dev/netlify/events-build.py" -o "${ROOT_DIR}/hugo/assets/ext/cfc-events.js"
}

do_clubs_build() {
  echo -e "\n${DIVIDER}\nTASK: Chess Clubs Build"
  echo "(under construction)"
}

do_hugo_build() {
  echo -e "\n${DIVIDER}\nTASK: Website Build (using Hugo)"
  set -e
  cd "${ROOT_DIR}/hugo"
  hugo version
  hugo -d public --gc
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
