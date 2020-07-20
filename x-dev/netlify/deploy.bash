#!/usr/bin/env bash

DIR_SCRIPT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DIR_ROOT="$( cd "$DIR_SCRIPT/../.." >/dev/null 2>&1 && pwd )"
URL_EVENTS="https://docs.google.com/spreadsheets/d/e/2PACX-1vR0OdgsCSYzlRBMOMkLFTHVuIcdXNSz7XQ3KWz4jtJr5fH4wHzDv1HRP3ytG4PwqxAXdTQLjOL0srAB/pub?gid=0&single=true&output=csv"

echo ---- DIR_ROOT = $DIR_ROOT

echo ---- ---- ---- ---- TASK: npm install
cd $DIR_ROOT/x-dev
npm install
rc=$?
echo ---- ---- ---- ---- return code: $rc
if [ $rc -ne 0 ]; then exit $rc; fi

echo ---- ---- ---- ---- TASK: npm run webpack:build-prod
cd $DIR_ROOT/x-dev
npm run webpack:build-prod
rc=$?
echo ---- ---- ---- ---- return code: $rc
if [ $rc -ne 0 ]; then exit $rc; fi

echo ---- ---- ---- ---- TASK: hugo -d public --gc
cd $DIR_ROOT/hugo
hugo -d public --gc
rc=$?
echo ---- ---- ---- ---- return code: $rc
if [ $rc -ne 0 ]; then exit $rc; fi

echo ---- ---- ---- ---- TEST: python --version
python --version
rc=$?
echo ---- ---- ---- ---- return code: $rc


#=======================================================================
# Notes:
#  - Using deploy script instead of &&-chain of commands because
#    Netlify would not always do npm install so deploy would fail.
#    Could not find why so now this script always does npm install.
