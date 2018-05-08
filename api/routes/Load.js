const router = require('koa-router')();
const LoadControllers = require('../controllers/Load');

router.prefix('/api');

router.post('/load/dailyUsage', LoadControllers.dailyUsage);
router.post('/load/maxRequirement', LoadControllers.maxRequirement);

module.exports = router;
