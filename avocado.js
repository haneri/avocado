const exec = require('child_process').exec

function handleFileSelect(event) {
    event.stopPropagation()
    event.preventDefault()
    let file = event.dataTransfer.files[0]
    let fileName = file.name
    let filePath = file.path
    let bitrateIndex = document.getElementById("video-bitrate").selectedIndex
    let bitrateTable = ['4096k', '2048k', '1024k', '512k']
    let bitrate = bitrateTable[bitrateIndex]
    preview(bitrate, fileName, filePath)
}

function handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
}

function preview(bitrate, fileName, filePath) {
    let child
    child = exec(`bash -x preview.sh ${bitrate} ${filePath}`,
        function(error, stdout, stderr) {
            document.getElementById("statusLog").textContent = stdout
            document.getElementById("preview_first").setAttribute("src", "./temp/" + fileName.replace(".mp4", "_first.jpg"))
            document.getElementById("preview_mid").setAttribute("src", "./temp/" + fileName.replace(".mp4", "_mid.jpg"))
            document.getElementById("preview_last").setAttribute("src", "./temp/" + fileName.replace(".mp4", "_last.jpg"))
            if (error !== null) {
                console.log(error)
            }
        })
}

function encodeVideo(bitrate, filePath) {
    let child
    child = exec(`bash -x encode.sh ${bitrate} ${filePath} -x`,
        function(error, stdout, stderr) {
            document.getElementById("statusLog").textContent = stdout
            if (error !== null) {
                console.log(error)
            }
        })
}

window.onload = function() {
    let previewArea = document.getElementById("previewArea")
    previewArea.addEventListener('dragover', handleDragOver, false)
    previewArea.addEventListener('drop', handleFileSelect, false)
    document.getElementById("encodeButton").addEventListener('click', encodeVideo, false)
}
