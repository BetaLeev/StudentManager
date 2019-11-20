const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')

const config = require('./config')
const routes = require('./routes')
const apiUser = require('./routes/users.js')
const apiTeach = require('./routes/teach.js')
const apiResult = require('./routes/result.js')
const apiFile = require('./routes/file.js')
const apiExam = require('./routes/exam.js')

const port = process.env.PORT || config.port


// error handler
onerror(app)

// middlewares
app.use(bodyparser())
    .use(json())
    .use(logger())
    .use(require('koa-static')(__dirname + '/public'))
    .use(views(path.join(__dirname, '/views'), {
        options: { settings: { views: path.join(__dirname, 'views') } },
        map: { 'njk': 'nunjucks' },
        extension: 'njk'
    }))

.use(router.routes())
    .use(router.allowedMethods())


// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - $ms`)
})


apiUser(router)
apiTeach(router)
apiResult(router)
apiExam(router)
apiFile(router)
routes(router)

app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
})



module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
})