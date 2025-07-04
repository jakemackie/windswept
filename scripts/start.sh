#!/bin/bash

BUILD_FLAG=""

if [[ "$1" == "--build" ]]; then
   BUILD_FLAG="--build"
fi

if [[ -n "$BUILD_FLAG" ]]; then
   echo "Building and starting container..."
   doppler run -- docker-compose up $BUILD_FLAG
else
   echo "Starting container without building..."
   doppler run -- docker-compose up
fi
