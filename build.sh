#!/bin/bash
npm run build
rm -r ../Article-frontend-build/build
cp build -r ../Article-frontend-build/
