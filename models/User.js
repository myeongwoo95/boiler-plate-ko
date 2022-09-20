const mongoose = require('mongoose')

const userSechema = mongoose.Schema({
    name: {
        type: String,
        maxlength : 50
    },
    email: {
        type: String,
        trim: true, // 공백 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String // 토큰을 이용해서 유효성을 검사
    },
    tokenExp: {
        type: Number
    }
})

const User = mongoose.model('User', userSechema)
module.exports = { User } //다른 파일에서도 사용할 수 있게 export