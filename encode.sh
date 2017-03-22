#!/bin/bash
bitrate="$1"
file_path="$2"
ffmpeg="$3"
dirPath="$4"
out_file=`echo $file_path | sed s/.mp4/_output_$bitrate.mp4/`
$ffmpeg -i $file_path -y -f mp4 -s 1920x1080 -movflags +faststart -vcodec libx264 -b:v $bitrate -bt 32k -vol 128 -acodec aac -b:a 64k -async 1 -threads 0 -pass 1 -passlogfile $dirPath $out_file
$ffmpeg -i $file_path -y -f mp4 -s 1920x1080 -movflags +faststart -vcodec libx264 -b:v $bitrate -bt 32k -vol 128 -acodec aac -b:a 64k -async 1 -threads 0 -pass 2 -passlogfile $dirPath $out_file
echo "エンコードが完了しました."
