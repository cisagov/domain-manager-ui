#!/bin/sh
cd /app || exit

envsubst < src/assets/settings.template.json > src/assets/settings.json

ng serve --host 0.0.0.0 --disable-host-check
