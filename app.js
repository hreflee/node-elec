const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');
const compress = require('koa-compress');

const keys = require('./config/secret-config').keys;
const sessionStore = require('./store/session-store');

const filter = require('./util/filter');

const UserRouter = require('./api/routes/User');
const BriefRouter = require('./api/routes/Brief');
const BasicRouter = require('./api/routes/Basic');
const LoadRouter = require('./api/routes/Load');
const PowerCutRouter = require('./api/routes/PowerCut');
const PredictRouter = require('./api/routes/Predict');

require('./job').createJob();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.keys = keys;
app.use(session({
  key: 'elec',
  maxAge: 86400000,
  store: sessionStore
}, app));
app.use(compress({
  threshold: 2048
}));

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
app.use(PredictRouter.routes(), PredictRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
