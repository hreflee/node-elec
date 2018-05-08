const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session2');

const filter = require('./util/filter');

const UserRouter = require('./api/routes/User');
const BriefRouter = require('./api/routes/Brief');
const BasicRouter = require('./api/routes/Basic');
const LoadRouter = require('./api/routes/Load');
const PowerCutRouter = require('./api/routes/PowerCut');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(session({
  key: 'elec'
}));
// 处理跨域
app.use(async function(ctx, next) {
  ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Max-Age", 86400000);
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  await next()
});

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// filter
app.use(filter);

// routes
app.use(UserRouter.routes(), UserRouter.allowedMethods());
app.use(BriefRouter.routes(), BriefRouter.allowedMethods());
app.use(BasicRouter.routes(), BasicRouter.allowedMethods());
app.use(LoadRouter.routes(), LoadRouter.allowedMethods());
app.use(PowerCutRouter.routes(), PowerCutRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
