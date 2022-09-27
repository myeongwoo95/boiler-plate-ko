const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = 5000;
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

const app = express(); // express 앱을 만든다.
app.use(bodyParser.urlencoded({ extended: true })); // application/x-www-urlencoded parser
app.use(bodyParser.json()); // application/json parser
app.use(cookieParser()); // cookie parser

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world!!!"));
app.get("/api/hello", (req, res) => res.send("hello test!!!"));

app.post("/api/users/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

// 로그인
app.post("/api/users/login", (req, res) => {

    // 1. 요청된 이메일을 DB에서 검색
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }

        // 2. 이메일이 DB에 존재한다면 pw 검증
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });
            }

            // 3. 올바른 pw라면 jwt 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 쿠키에 저장
                res.cookie("x_auth", user.token) // F12 -> Application -> Storage -> Cookies에 저장된다.
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

// Authentication
app.get("/api/users/auth", auth, (req, res) => {
    // auth는 미들웨어로 콜백함수가 호출되기전에 호출된다. (미들웨어에서 req에 token과 user정보를 넣어놨다.)
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

//로그아웃
app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
