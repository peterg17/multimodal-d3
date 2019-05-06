#!/bin/sh

cd ../;
npm run build;
echo "new build created";

cd dist;
echo "starting server on localhost:8080";
python -m SimpleHTTPServer 8080;
