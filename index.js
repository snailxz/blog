const Koa = require('koa')
const Router = require('koa-router')  // 路由
const static = require('koa-static') // 静态资源
const render = require('koa-art-template') // 模版引擎 kuai
const markdown = require('markdown-js')  // markdown 转 html
const path = require('path')  // 原生模块
const fs = require('fs')
const config = require('./config.js')

const app = new Koa()
const router = new Router()

// html模版引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})

// 静态资源
app.use(static('./static'))

const headerHtml = `<link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/icon.png">
                    <link rel="manifest" href="/manifest.json"/>
                    <meta name="keywords" content="李向钊,snail,snailxz,前端博客,前端">
                    <meta name="description" content="小小前端，大大梦想">
                    <meta name="theme-color" content="#292c2f"/>
                    <meta name="apple-mobile-web-app-capable" content="yes">
                    <meta name="format-detection" content="telephone=no">
                    <meta name="apple-mobile-web-app-status-bar-style" content="white">`
const baidu = `<script>
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?60b82d2a25053829b15ecaabedb2d255";
                  var s = document.getElementsByTagName("script")[0]; 
                  s.parentNode.insertBefore(hm, s);
                })();
                </script>`

// css 中间件
app.use(async (ctx, next) => {
  ctx.state = {
    headerHtml,
    baidu
  }
  await next()
})

// 404中间件
app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    await ctx.render('404')
  }
})


// 路由
router
  .get('/', async (ctx) => {
    await ctx.render('index')
  })
  .get('/index', async (ctx) => {
    await ctx.render('index')
  })
  .get('/index.html', async (ctx) => {
    await ctx.render('index')
  })
  .get('/notes', async (ctx, next) => {
    const str = fs.readFileSync(path.join(__dirname, 'markdown/' + config.notes[0].url + '.md'), 'utf-8')
    const html = markdown.parse(str).toString()
    await ctx.render('notes', {
      notes: config.notes,
      active: config.notes[0].url,
      html
    })
  })
  .get('/notes/index.html', async (ctx, next) => {
    const str = fs.readFileSync(path.join(__dirname, 'markdown/' + config.notes[0].url + '.md'), 'utf-8')
    const html = markdown.parse(str).toString()
    await ctx.render('notes', {
      notes: config.notes,
      active: config.notes[0].url,
      html
    })
  })
  .get('/notes/:note', async (ctx, next) => {
    let str
    try {
      str = fs.readFileSync(path.join(__dirname, 'markdown/' + ctx.params.note.replace('.html', '') + '.md'), 'utf-8')
    } catch (err) {
      console.log(err)
    }

    if (str) {
      let html = markdown.parse(str).toString()
      html = html.replace(/(&lt;\/br&gt;|&lt;br\/&gt;)/g, '<br/>')
      await ctx.render('notes', {
        notes: config.notes,
        active: ctx.params.note.replace('.html', ''),
        html
      })
    } else {
      next()
    }
  })
  .get('/example', async (ctx) => {
    await ctx.render('example', {
      example: config.example
    })
  })
  .get('/example.html', async (ctx) => {
    await ctx.render('example', {
      example: config.example
    })
  })
  .get('/games', async (ctx) => {
    await ctx.render('games', {
      games: config.games
    })
  })
  .get('/games.html', async (ctx) => {
    await ctx.render('games', {
      games: config.games
    })
  })
  .get('/about', async (ctx) => {
    await ctx.render('about')
  })
  .get('/about.html', async (ctx) => {
    await ctx.render('about')
  })

app
  .use(router.routes())  // 启动路由
  .use(router.allowedMethods())

// 监听端口
app.listen(8088, () => {
  console.log('http://127.0.0.1:8088')
})