
const cameraLink = document.getElementById('cameraLink');


const videoComponent = document.getElementById('videoComponent');

const videoElement = document.getElementById('videoElement');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

function showVideoComponent() {
    videoComponent.style.display = 'block';
    cameraLink.style.display = 'none';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoElement.srcObject = stream;
        })
        .catch(error => {
            console.error('Erro ao acessar a câmera:', error);
        });
}

cameraLink.addEventListener('click', showVideoComponent);


function startRecording() {
    if (!isRecording) {
        mediaRecorder = new MediaRecorder(videoElement.srcObject);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(recordedBlob);
            recordedVideo.controls = true;
        };

        mediaRecorder.start();
        isRecording = true;
        startRecordingButton.innerText = 'Gravando... Solte para parar';
    }
}


function stopRecording() {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        startRecordingButton.innerText = 'Pressione e segure para gravar';
    }
}


startRecordingButton.addEventListener('mousedown', startRecording);
startRecordingButton.addEventListener('mouseup', stopRecording);
