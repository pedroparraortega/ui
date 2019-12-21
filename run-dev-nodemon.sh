#!/bin/bash
MY_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
MY_DIR="$(dirname $MY_PATH)"
cd $MY_DIR

export NODE_ENV=development
export BACKEND_URL=http://localhost:4000
# export DEBUG=express:*
nodemon src/.