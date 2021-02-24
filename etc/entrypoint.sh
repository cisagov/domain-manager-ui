#!/bin/sh
cd /app

echo "Substituting settings"
envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json

exec nginx -g 'daemon off;'
