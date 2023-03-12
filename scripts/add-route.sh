#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide the route name as the first argument"
  exit 1
fi

route_name=$1
route_folder="./client/src/routes"

if [ ! -d "$route_folder" ]; then
  echo "The route folder ($route_folder) does not exist"
  exit 1
fi

route_dir="$route_folder/$route_name"
if [ ! -d "$route_dir" ]; then
  echo "Creating directory $route_dir"
  mkdir -p "$route_dir"
fi

create_server=0
create_client=0
while [ "$#" -gt 0 ]; do
  case $1 in
    --server|-s) create_server=1 ;;
    --client|-c) create_client=1 ;;
  esac
  shift
done


if [ $create_server -eq 1 ]; then
  server_file="$route_dir/+page.server.ts"
  if [ ! -f "$server_file" ]; then
    cat >$server_file <<EOL
import type { ServerLoad } from '@sveltejs/kit'

export const load = (({ fetch }) => {
  

  return {
    pageTitle: "about"
  }
}) as ServerLoad

EOL
  fi
fi

if [ $create_client -eq 1 ]; then
  client_file="$route_dir/+page.ts"
  if [ ! -f "$client_file" ]; then
    cat >$client_file <<EOL
import type { PageLoad } from './\$types'

export const prerender =true
export const load = (({ fetch }) => {
  

  return {
    pageTitle: "$route_name"
  }
}) as PageLoad
EOL
  fi
fi

svelte_file="$route_dir/+page.svelte"
if [ ! -f "$svelte_file" ]; then
  cat >$svelte_file <<EOL
<script lang="ts">
  
</script>

<main>
  <h1>$route_name</h1>
</main>

<style lang="postcss">

</style>
EOL
fi

editor_path=$(command -v code || command -v codium 2>/dev/null)
if [ -n "$editor_path" ]; then
  "$editor_path" $svelte_file
else
  echo "VSCode not installed"
fi
