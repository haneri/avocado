#!/bin/bash -x
cd temp
rm *
cd ..
file_name="$1"
preview_first=`echo $1 | sed s/.mp4/_first.jpg/`
preview_mid=`echo $1 | sed s/.mp4/_mid.jpg/`
preview_last=`echo $1 | sed s/.mp4/_last.jpg/`
last_frame=`ffprobe -show_streams "$file_name" 2> /dev/null | grep nb_frames | head -1 | cut -d \= -f 2`
rm -f "$preview_first" "$preveiw_mid" "$preview_last"
let "last_frame = $last_frame - 1"
let "mid_frame = $last_frame / 2"
let "first_frame=0"
ffmpeg -i $file_name -s 1920x1080 -b:v 1024k -vf select=\'eq\(n,$first_frame\) -vframes 1 $preview_first
ffmpeg -i $file_name -s 1920x1080 -b:v 1024k -vf select=\'eq\(n,$mid_frame\) -vframes 1 $preview_mid
ffmpeg -i $file_name -s 1920x1080 -b:v 1024k -vf select=\'eq\(n,$last_frame\) -vframes 1 $preview_last
mv $preview_first $preview_mid $preview_last temp
