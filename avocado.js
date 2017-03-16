const exec = require('child_process').exec
window.jQuery = window.$ = require('./lib/jquery.min.js')

function handleFileSelect(event) {
    event.stopPropagation()
    event.preventDefault()
    let file = event.dataTransfer.files[0]
    let fileName = file.name
    let filePath = file.path
    let bitrateIndex = $("#video-bitrate").prop("selectedIndex")
    let bitrateTable = ['4096k', '2048k', '1024k', '512k']
    let bitrate = bitrateTable[bitrateIndex]
    preview(bitrate, fileName, filePath)
    $("#encodeButton").click(function() {
      let child
      child = exec(`bash -x encode.sh ${bitrate} ${filePath} -x`,
          function(error, stdout, stderr) {
            $("#statusLog").text(stderr)
            if (error !== null) {
              console.log(error)
            }
          })
    })
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
            $("#statusLog").text(stderr)
            $("#preview_first").attr("src", "./temp/" + fileName.replace(".mp4", "_first.jpg"))
            $("#preview_mid").attr("src", "./temp/" + fileName.replace(".mp4", "_mid.jpg"))
            $("#preview_last").attr("src", "./temp/" + fileName.replace(".mp4", "_last.jpg"))
            if (error !== null) {
                console.log(error)
            }
        })
}

window.onload = function() {
  let previewArea = document.getElementById("previewArea")
  previewArea.addEventListener('dragover', handleDragOver, false)
  previewArea.addEventListener('drop', handleFileSelect, false)
}
