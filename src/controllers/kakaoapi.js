const axios = require('axios');
require('dotenv').config()

exports.kakaoapi= async (req,res) => {
    labels = `${req.body.label}`
    text = `<speack> 전방에 ${labels}가 있습니다. <speack>`

    try {
        const {data} = await axios.post('https://kakaoi-newtone-openapi.kakao.com/v1/synthesize', text,{
            headers:{
                'Content-Type': 'application/xml',
                'Authorization': `KakaoAK ${process.env.kakaoAPI}`
            },
            responseType:"arraybuffer"
        })
        // const context = new AudioContext();
        // context.decodeAudioData(data, buffer => {
        //     const source = context.createBufferSource();
        //     source.buffer = buffer;
        //     source.connect(context.destination);
        //     source.start(0);
        // });
    } catch (e) {
        console.error(e.message);
    }
    return res.send(text)
}

exports.getTest = (req,res) =>{
    return res.send(req.params)
}

exports.postTest = (req,res) => {
    return res.send(req)
}
