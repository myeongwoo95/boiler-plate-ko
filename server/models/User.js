const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSechema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 공백 제거
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

//비밀번호 암호화
userSechema.pre("save", function (next) {
    let user = this;

    if (user.isModified("password")) {
        //salt 생성
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

//비밀번호 비교
userSechema.methods.comparePassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

//jwt 생성
userSechema.methods.generateToken = function (callback) {
    let user = this;

    let token = jwt.sign(user._id.toHexString(), "walle");
    user.token = token;

    user.save((err, user) => {
        if (err) return callback(err);
        callback(null, user);
    });

    //토큰 생성 : user._id + 'walle' = token
    //Decode : 'walle' => user._id
};

//jwt decode
userSechema.statics.findByToken = function (token, callback) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, "walle", function (err, decoded) {
        // 1. userId를 이용해서 user를 찾은 다음에
        // 2. 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ _id: decoded, token: token }, function (err, user) {
            if (err) return callback(err);
            callback(null, user);
        });
    });
};

const User = mongoose.model("User", userSechema);
module.exports = { User };