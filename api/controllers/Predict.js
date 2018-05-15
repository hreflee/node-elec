const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Moment = require('moment');

const MeterRecordModel = require('../models').meterRecord;
const WeatherdModel = require('../models').weather;

const BestModelInfoService = require('../service/BestModelInfo');
const RPCService = require('../service/RPC');

module.exports = {
  async secondFields (ctx) {
    const {collectPointNo, date} = ctx.query;
    let additionalFields = BestModelInfoService.getModelInfoByCollectPointNo(collectPointNo);
    let responseData = [];
    for (let i = 0; i < additionalFields.length; i++) {
      let fieldItem = additionalFields[i];
      let whereDate = Moment(date).subtract(fieldItem.delta, 'days').format('YYYY-MM-DD');
      if (fieldItem.item === 'total') {
        let queryResult = await MeterRecordModel.findAll({
          attributes: ['total'],
          where: {
            collect_point_no: collectPointNo,
            data_date: whereDate,
            valid: true
          }
        });
        responseData.push({
          key: fieldItem.keyName,
          value: queryResult[0] ? parseFloat(queryResult[0].total):'',
          desc: queryResult[0] ? '来自历史数据':''
        });
      } else if (fieldItem.item === 'TEM') {
        let queryResult = await WeatherdModel.findAll({
          attributes: ['TEM'],
          where: {
            date: whereDate
          }
        });
        responseData.push({
          key: fieldItem.keyName,
          value: queryResult[0] ? parseFloat(queryResult[0].TEM):'',
          desc: queryResult[0] ? '来自历史数据':''
        });
      }
    }
    ctx.response.body = {
      status: 1,
      data: responseData
    }
  },
  async result (ctx) {
    const predictParams = ctx.request.body;
    let [validResult] = await RPCService.validArray([predictParams]);
    let responseData = {
      validResult: validResult.valid_res ? true:false,
      predict: validResult.predict,
      mape: validResult.mape
    };
    ctx.response.body = {
      status: 1,
      data: responseData
    }
  }
};
