const express = require('express');
const router = express.Router();
const kakaoapi = require("../controllers/kakaoapi");

router.get('/kakao/:id',  kakaoapi.getTest);
router.get('/kakao/:id', kakaoapi.kakaoapi);
router.post('/kakao', kakaoapi.kakaoapi);

module.exports = router;

