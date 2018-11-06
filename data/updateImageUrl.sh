#!/usr/bin/env sh

NGROK_HOST="$1"
FRAGMENT="$2"

sed -i "s_http://api.digimeals.com/data/images/Recipe/_http://$NGROK_HOST/$FRAGMENT/_" rezepte/*.json

exit 0
