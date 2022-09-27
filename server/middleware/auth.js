const { User } = require("../models/User");

// 인증 처리
let auth = (req, res, next) => {
    // 1. 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 2. 토큰을 복호화 한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        // request에 token과 user를 넣어줌으로써 엔드포인트에서 token과 user를 사용할 수 있다.
        req.token = token;
        req.user = user;
        next();
    });

    // 3. 유저가 있으면 인증 Okey, 없으면 No!
};

module.exports = { auth };
