const router = require('koa-router')();
const BriefControllers = require('../controllers/Brief');

router.prefix('/api/brief');

router.get('/', BriefControllers.brief);
router.post('/clientProp', BriefControllers.clientProp);

module.exports = router;
