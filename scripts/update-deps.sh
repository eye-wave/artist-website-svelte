#!/bin/bash

cd $(find . -maxdepth 1 -type d | sed -n '2p')
workspaces=$(/usr/bin/cat ../package.json | jq '.workspaces' | jq -r '.[]')

for workspace in $workspaces; do
  cd "../$workspace"
  ncu -u
done

cd ..
