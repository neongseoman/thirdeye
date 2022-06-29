const config = import('../../src/config/kakaoAPIconfig.js')
const kakaoAPI = config.RESTAPI
import {request} from "express";

function getAudio(){
    const audioTag = document.getElementById("audiotts")
    audioTag.src="objectLabel"
    audioTag.type="type/mpeg"
    return audioTag
}

function kakaoTTSres(...labels) {
    // let objects = []
    // labels.forEach(label => objects.push(label))
    const audio = getAudio();
    let text = '<speak> 전방에 ' + labels + '이 있습니다 </speak>'

    let options = {
        'method': 'POST',
        'url': 'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
        'headers': {
            'Content-Type': 'application/xml',
            'Authorization': 'KakaoAK ' + kakaoAPI
        },
        'body' : text
    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(JSON.stringify(response.headers));
        audio.src = response.body;

        // print(response.json())
    });
}

kakaoTTSres('사람','차','책')

export {getAudio,kakaoTTSres}