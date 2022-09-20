if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod') // 배포 된 상태라면 prod.js를 사용
} else {
    module.exports = require('./dev') // 배포 전 상태라면 dev.js를 사용
}