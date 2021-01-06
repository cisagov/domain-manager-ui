#!/bin/sh
cd /app
echo "Substituting aws exports variables"
envsubst < src/aws-exports.template.js > src/aws-exports.js


# Build is ran at runtime, so cognito config can be defined by environment variables
ng build --configuration production --output-path=/usr/share/nginx/html/

echo "Substituting settings"
envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json

exec nginx -g 'daemon off;'
