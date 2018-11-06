#!/usr/bin/env bash

echo "starting all the services"

echo "starting backend on 2011"
pushd backend
npm run serve &
#ngrok http 2001 --host-header=rewrite --region=eu
popd
pushd frontend/browser-scanner
#ngrok http 3000 --host-header=rewrite --region=eu &

echo "Run following:"
echo "ngrok http 2001 --host-header=rewrite --region=eu &"
echo "ngrok http 3000 --host-header=rewrite --region=eu &"
echo "change .env accordingly"
echo "npm start &"


