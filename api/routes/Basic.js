const router = require('koa-router')();
const BasicControllers = require('../controllers/Basic');

router.prefix('/api');

router.post('/basic', BasicControllers.basic);

module.exports = router;
