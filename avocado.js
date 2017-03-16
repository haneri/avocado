function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    let files = event.dataTransfer.files;
    preview(exec, files[0]);
}

function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

let previewArea = document.getElementById("previewArea");
previewArea.addEventListener('dragover', handleDragOver, false);
previewArea.addEventListener('drop', handleFileSelect, false);

let exec = require('child_process').exec;

function preview(exec, file) {
    let child;
    let fileName = file.name;
    let filePath = file.path;
    child = exec('bash preview.sh ' + filePath,
        function(error, stdout, stderr) {
            console.log(stdout);
            if (error !== null) {
                console.log(error);
            }
        });
    $("#preview_first").src = filePath.replace(".mp4", "_first.jpg");
    $("#preview_mid").src = filePath.replace(".mp4", "_mid.jpg");
    $("#preview_last").src = filePath.replace(".mp4", "_last.jpg");
}
