const router = require('koa-router')();
const PowerCutControllers = require('../controllers/PowerCut');

router.prefix('/api/powerCut');

router.post('/query', PowerCutControllers.query);

module.exports = router;
