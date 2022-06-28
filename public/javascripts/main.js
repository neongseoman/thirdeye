// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using objectDetector
=== */

import './kakaoTTS.js'

let objectDetector;
let objects = [];
let video;
let audio;
let canvas, ctx;
const width = 480;
const height = 360;


async function make() {
    video = await getVideo();
    audio = await kakaoTTS.createAudio();
    objectDetector = await ml5.objectDetector('cocossd', startDetecting)

    canvas = createCanvas(width, height);
    ctx = canvas.getContext('2d');

}

window.addEventListener('DOMContentLoaded', function() {
    make();
});

function startDetecting(){
    console.log('model ready')
    detect();
}

function detect() {
    objectDetector.detect(video, function(err, results) {
        if(err){
            console.log(err);
            return
        }
        objects = results;

        if(objects){
            draw();
            console.log(objects)
        }

        // detect();
        setTimeout(() =>{
            // objects.forEach(object => kakaoTTS.kakaoTTS(object.label))
            // kakaoTTS.kakaoTTS(); >> object의 label들을 전달하면 tts로 전달.
            detect();
        },1000)
    });
}

function draw(){
    // Clear part of the canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0, width, height);

    ctx.drawImage(video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {

        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

        ctx.beginPath();
        ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
}

// Helper Functions
async function getVideo() {
    // Grab elements, create settings, etc.
    const videoElement = document.createElement('video');
    videoElement.setAttribute("style", "display: none;");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    // Create a webcam capture
    let constraints = {
        // this is cellphone rear camera
        // audio: false, video: { facingMode: { exact: "environment" } }
        audio: false, video: true
    };

    const capture = await navigator.mediaDevices.getUserMedia(constraints)
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement
}

function createCanvas(w, h){
    const canvas = document.createElement("canvas");
    canvas.width  = w;
    canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}
