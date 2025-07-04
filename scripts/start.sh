#!/bin/bash

BUILD_FLAG=""
if [[ "$1" == "--build" ]]; then
   BUILD_FLAG="--build"
fi

# Run docker with doppler secrets
echo -e "🐳 Docker container starting..."
doppler run -- docker-compose up $BUILD_FLAG
