const express = require('express') // express 모듈을 가져온다.
const app = express() // express 앱을 만든다.
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({extended: true})) // application/x-www-urlencoded 타입 형식을 받을 수 있게 해준다.
app.use(bodyParser.json())  // application/json 형태의 데이터를 받을 수 있게 해준다.

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, { // MongDB user 생성시 이 url를 줌
    useNewUrlParser: true, useUnifiedTopology: true // 이걸 안쓰면 경고 에러 메세지가 안뜸
}).then(()=> console.log('MongoDB Connected...')) // 연결이 잘 되었다면,
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world! 새해 복 많이 받으세요123 zzzzzzz')) // 브라우저 url: /로 접근하면 Hello world! 문자열을 반환한다.
app.post('/register', (req, res) => {

  const user = new User(req.body) // bodyParser가 req의 body를 받아준다.
  user.save((err, userInfo) => { // mongoDB에 insert된다.
    if(err) return res.json({ success: false, err}) // 에러가 있다면, json형태로 데이터 전달
    return res.status(200).json({ // 에러가 없다면,
      success: true
    })
  })  
}) 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))