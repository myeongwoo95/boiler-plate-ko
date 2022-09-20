const express = require('express') // express 모듈을 가져온다.
const app = express() // express 앱을 만든다.
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:1234@cluster0-bolierplate.z8qjhav.mongodb.net/?retryWrites=true&w=majority', { // MongDB user 생성시 이 url를 줌
    useNewUrlParser: true, useUnifiedTopology: true // 이걸 안쓰면 경고 에러 메세지가 안뜸
}).then(()=> console.log('MongoDB Connected...')) // 연결이 잘 되었다면,
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world!')) // 브라우저 url: /로 접근하면 Hello world! 문자열을 반환한다.
app.listen(port, () => console.log(`Example app listening on port ${port}!`))