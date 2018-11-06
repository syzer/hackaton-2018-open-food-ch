#!/usr/bin/env sh

# backend serves static files from data/:
# e.g. http://localhost:2001/rezepte-img/PHO_aloo-capsicum-sabzi-wm.jpg

NGROK_HOST="$1"
FRAGMENT="$2"

usage () {
	echo "usage: $0 NGROK_HOST SERVER_PATH\n\t e.g. $0 localhost:2001 rezepte-img\n\t -> http://localhost:2001/rezepte-img/"
}

[ "" = "$NGROK_HOST" ] && usage && exit 1

echo sed -i "s_http://api.digimeals.com/data/images/Recipe/_http://$NGROK_HOST/$FRAGMENT/_" rezepte/*.json

exit 0
