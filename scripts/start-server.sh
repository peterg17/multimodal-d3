#!/bin/sh

cd ../dist;
echo "starting server on localhost:8080";
python -m SimpleHTTPServer 8080;
