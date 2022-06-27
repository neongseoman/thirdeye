const config = require('../../config/kakaoconfig.json')
const kakaoAPI = config.RESTAPI

let request = require('request');
// let json = require('json-stringify-safe')
let options = {
    'method': 'POST',
    'url': 'https://kakaoi-newtone-openapi.kakao.com/v1/synthesize',
    'headers': {
        'Content-Type': 'application/xml',
        'Authorization': 'KakaoAK ' + kakaoAPI
    },
    body: '<speak> 전방에 자동차 사람 책이 있습니다 </speak>'

};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(JSON.stringify(response.headers));
    // print(response.json())
});

function createAudio() {

}


