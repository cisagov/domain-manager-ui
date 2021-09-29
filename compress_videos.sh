#!/usr/bin/env bash
BASE_PATH="src/domainManagementUI/src/assets/videos"

for f in "$BASE_PATH"/*.mp4; do
  ffmpeg -i "$f" "$BASE_PATH/output.mp4" -y
  cp "$BASE_PATH/output.mp4" "$f"
done

rm "$BASE_PATH/output.mp4"
