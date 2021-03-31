#!/bin/sh
cd /app || exit

echo "Substituting settings"
envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json

echo "Starting nginx"
exec nginx -g 'daemon off;'
