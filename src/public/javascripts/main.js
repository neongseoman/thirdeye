// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using objectDetector
=== */
// const request = require('request');
// const axios = require('axios');
const kakaoAPI = "84d9fc9de601a400e5348cc64173f9bb"

let objectDetector;
let objects = [];
let video;
let canvas, ctx;
let constraints
let facing = false;
let labels = [];
const width = 480;
const height = 360;
const cameraSwitchButton = document.getElementById("cameraswitch");
const captureButton = document.getElementById('capture');

window.addEventListener('DOMContentLoaded', function() {
    facingModeCheck();
    make();
});


cameraSwitchButton.addEventListener('click',()=> {
    console.log("switch button click")
    cameraSwitch()
})

captureButton.addEventListener('click',()=>{
    console.log("capture button click")
    capture();
})

function facingModeCheck(){
    if (navigator.userAgentData.mobile){
        constraints = {
            audio: false, video: {facingMode: {exact: "environment"}}
        }
    }
    else {
        constraints = {
            audio: false, video: true
        }
    }
}

function cameraSwitch() {
    facing = !facing
    constraints = {
        audio: false, video: { facingMode: facing ? "user" : "environment" }
    }
    video = null;
    make();
}

function capture(){
    labels =[];
    objects.forEach(object => labels.push(object['label']))
    // console.log(labels)
    kakaoTTS(labels)
}

async function make() {
    console.log("make")
    video = await getVideo();
    objectDetector = await ml5.objectDetector('cocossd', startDetecting)

    canvas = getCanvas(width, height);
    ctx = canvas.getContext('2d');
}

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
            // console.log(objects)
        }
        detect();

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
    const videoElement = document.getElementById('cameraVideo');
    videoElement.setAttribute("style", "display: none");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    const capture = await navigator.mediaDevices.getUserMedia(constraints)
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement
}

function getCanvas(w, h){
    const canvas = document.getElementById("drawCanvas");
    canvas.width  = w;
    canvas.height = h;
    document.body.appendChild(canvas);
    return canvas;
}

async function kakaoTTS(...labels) {

    let text = '<speak> 전방에 ' + labels + '이 있습니다 </speak>'
    console.log(text)

    try {
        const {data} = await axios.post('https://kakaoi-newtone-openapi.kakao.com/v1/synthesize', text,{
            headers:{
                'Content-Type': 'application/xml',
                'Authorization': `KakaoAK ${kakaoAPI}`
            },
            responseType:"arraybuffer"
        })
        const context = new AudioContext();
        context.decodeAudioData(data, buffer => {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        });
    } catch (e) {
        console.error(e.message);
    }

}