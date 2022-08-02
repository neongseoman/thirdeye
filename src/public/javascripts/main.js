// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Real time Object Detection using objectDetector
=== */

let objectDetector;
let objects = [];
let video;
let canvas, ctx;
const width = 480;
const height = 360;
const kakaoAPI = "b1a0aa4764b0874a5f7b71ac3893c9f6"


async function make() {
    console.log("make")
    video = await getVideo();
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

async function detect() {
    labels = []
    objectDetector.detect(video, function(err, results) {
        if(err){
            console.log(err);
            return
        }
        objects = results;

        objects.forEach((object) => labels.push(object.label))
        draw()
        // if(objects){
        //     setTimeout(() =>{
        //         axios.post(`http://localhost:3000/data/kakao`,
        //             body = objects[0]
        //         ).then((res) => {
        //             // console.log(JSON.stringify(res))
        //             console.log(res.data);
        //         }).then(detect());
        //     },3000)
        // }
        if(objects){
            setTimeout(() =>{
                await kakaoTTS(labels)
            },3000,
                detect())
        }

        // detect();
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
    videoElement.setAttribute("style", "display: none;");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    // Create a webcam capture
    let constraints = {
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
