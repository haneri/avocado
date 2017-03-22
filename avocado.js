const exec = require('child_process').exec
const ffmpeg = require('ffmpeg-static')
const ffprobe = require('ffprobe-static')
const temp = require('temp')
console.log(temp)
let filePath = null

function handleFileSelect(event) {
    event.stopPropagation()
    event.preventDefault()
    let file = event.dataTransfer.files[0]
    let fileName = file.name
    filePath = file.path
    let bitrateIndex = document.getElementById("video-bitrate").selectedIndex
    let bitrateTable = ['4096k', '2048k', '1024k', '512k']
    let bitrate = bitrateTable[bitrateIndex]
    document.getElementById("preview_first").setAttribute("src", "")
    document.getElementById("preview_mid").setAttribute("src", "")
    document.getElementById("preview_last").setAttribute("src", "")
    temp.mkdir('temp', function(err, dirPath) {
        preview(bitrate, fileName, dirPath)
    })
}

function handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
}

function preview(bitrate, fileName, dirPath) {
    exec(`/bin/bash -x ${__dirname}/preview.sh ${bitrate} ${filePath} ${ffmpeg.path} ${ffprobe.path} ${dirPath}`,
        function(error, stdout, stderr) {
            document.getElementById("preview_first").setAttribute("src", dirPath + "/" + fileName.replace(".mp4", "_first.jpg"))
            document.getElementById("preview_mid").setAttribute("src", dirPath + "/" + fileName.replace(".mp4", "_mid.jpg"))
            document.getElementById("preview_last").setAttribute("src", dirPath + "/" + fileName.replace(".mp4", "_last.jpg"))
            if (error !== null) {
                console.log(error)
            }
        })
    // 動画の長さを「秒」で取得
    exec(`${ffprobe.path} -show_entries format=duration ${filePath} 2> /dev/null | grep duration\= | cut -d \= -f 2`,
        function(error, stdout, stderr) {
            let estimatedSize = (stdout - 0) * (bitrate.slice(0, -1) - 0) / (8 * 1024)
            document.getElementById("statusLog").textContent += "予想ファイルサイズ: " + Math.round(estimatedSize * 10) / 10 + "MB\n" // 小数第一位まで表示
        })
}

function encodeVideo() {
    temp.mkdir('temp', function(err, dirPath) {
        document.getElementById("statusLog").textContent = "エンコード中...\n"
        let bitrateIndex = document.getElementById("video-bitrate").selectedIndex
        let bitrateTable = ['4096k', '2048k', '1024k', '512k']
        let bitrate = bitrateTable[bitrateIndex]
        exec(`/bin/bash -x ${__dirname}/encode.sh ${bitrate} ${filePath} ${ffmpeg.path} ${dirPath}`,
            function(error, stdout, stderr) {
                document.getElementById("statusLog").textContent += stdout
                console.log(stderr)
                if (error !== null) {
                    console.log(error)
                    console.log(stderr)
                    console.log(stdout)
                }
                let downloadLink = document.createElement("a")
                downloadLink.setAttribute("href", filePath.replace(".mp4", "_output_" + bitrate + ".mp4"))
                downloadLink.setAttribute("download", "")
                downloadLink.text = "ダウンロード"
                document.getElementById("status").appendChild(downloadLink)
            })
    }, false)
}

window.onload = function() {
    let previewArea = document.getElementById("previewArea")
    previewArea.addEventListener('dragover', handleDragOver, false)
    previewArea.addEventListener('drop', handleFileSelect, false)
    document.getElementById("encodeButton").addEventListener('click', encodeVideo, false)
}
