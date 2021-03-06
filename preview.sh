#!/bin/bash
bitrate="$1"
file_path="$2"
ffmpeg="$3"
ffprobe="$4"
dirPath="$5"
preview_first=`echo $file_path | sed s/.mp4/_first.jpg/`
preview_mid=`echo $file_path | sed s/.mp4/_mid.jpg/`
preview_last=`echo $file_path | sed s/.mp4/_last.jpg/`
last_frame=`$ffprobe -show_streams "$file_path" 2> /dev/null | grep duration\=| head -1 | cut -d \. -f 1 | cut -d \= -f 2`
rm -f "$preview_first" "$preveiw_mid" "$preview_last"
let "last_frame = $last_frame"
let "mid_frame = $last_frame/2"
let "first_frame=0"
$ffmpeg -ss $first_frame -i $file_path -y -t 1 -s 1920x1080 -b:v $bitrate $dirPath/preview_first_temp.mp4
$ffmpeg -ss $mid_frame -i $file_path -y -t 1 -s 1920x1080 -b:v $bitrate $dirPath/preview_mid_temp.mp4
$ffmpeg -ss $last_frame -i $file_path -y -t 1 -s 1920x1080 -b:v $bitrate $dirPath/preview_last_temp.mp4
$ffmpeg -ss 0 -i $dirPath/preview_first_temp.mp4 -vframes 1 -y $dirPath/`basename $preview_first`
$ffmpeg -ss 0 -i $dirPath/preview_mid_temp.mp4 -vframes 1 -y $dirPath/`basename $preview_mid`
$ffmpeg -ss 0 -i $dirPath/preview_last_temp.mp4 -vframes 1 -y $dirPath/`basename $preview_last`
