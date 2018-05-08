const publicApis = require('../config/config').publicApis;

module.exports = async (ctx, next) => {
  if (publicApis.indexOf(ctx.request.path) >= 0 || true){
    await next();
  } else {
    if (ctx.session.user) {
      await next();
    }
  }
};