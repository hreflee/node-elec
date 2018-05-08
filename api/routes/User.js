const router = require('koa-router')();
const UserControllers = require('../controllers/User');

router.prefix('/api/user');

router.post('/login', UserControllers.login);
router.get('/checkLogin', UserControllers.checkLogin);
router.get('/logout', UserControllers.logout);

module.exports = router;
