const router = require('koa-router')();
const PredictControllers = require('../controllers/Predict');

router.prefix('/api/predict');

router.get('/secondFields', PredictControllers.secondFields);
router.post('/result', PredictControllers.result);

module.exports = router;
