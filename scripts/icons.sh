#!/bin/bash

exdir="/tmp/exfontsvg"

mkdir -p $exdir
mv "/home/$USER/Downloads/iconfont.zip" $exdir
cd $exdir
unzip iconfont.zip
rm _demo.html
ls

cd -
find "$exdir" -name '*.zip' | xargs -I{} rm {}
find "$exdir" -name '*iconfont*' | xargs -I{} mv {} client/src/lib/fonts
