#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide the route name as the first argument"
  exit 1
fi

route_name=$1
route_folder="./client/src/routes"
route_path="$route_folder/$route_name"

if [ ! -d "$route_path" ]; then
  echo "route $route_name not found"
  exit 1
fi


read -p "Delete route $route_name ? (y/n) " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo
  rm -rf "$route_path"
  echo "Successfully deleted route $route_name"
fi

