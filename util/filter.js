const publicApis = require('../config/config').publicApis;

module.exports = async (ctx, next) => {
  if (publicApis.indexOf(ctx.request.path) >= 0){
    await next();
  } else {
    if (ctx.session.user) {
      await next();
    } else {
      ctx.response.status = 401;
      ctx.response.body = {
        status: 0,
        data: '请登录'
      }
    }
  }
};