const UserModel = require('../models').user;
const md5 = require('md5');

module.exports = {
  async login (ctx) {
    const {username, password} = ctx.request.body;
    const result = await UserModel.findAll({
      where: {
        username,
        password: md5(password)
      }
    });
    if (result.length) {
      ctx.session.user = result[0].username;
      ctx.response.body = {
        status: 1,
        data: '登录成功'
      }
    } else {
      ctx.response.body = {
        status: 0,
        data: '用户名或密码错误'
      }
    }
  },
  async checkLogin (ctx) {
    if (ctx.session.user) {
      ctx.response.body = {
        status: 1,
        data: {
          username: ctx.session.user
        }
      }
    } else {
      ctx.response.body = {
        status: 0
      }
    }
  },
  async logout (ctx) {
    ctx.session.user = null;
    ctx.response.status = 200;
  }
};