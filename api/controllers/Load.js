const Op = require('sequelize').Op;
const MeterRecordModel = require('../models').meterRecord;
const MaxRequirementModel = require('../models').maxRequirement;
const Moment = require('moment');
const colMap = {
  'total': 'total',
  'jian': 'jian',
  'feng': 'feng',
  'ping': 'ping',
  'gu': 'gu'
};
const typeMap = {
  'total': '正向有功(总)',
  'jian': '正向有功(尖)',
  'feng': '正向有功(峰)',
  'ping': '正向有功(平)',
  'gu': '正向有功(谷)'
};

module.exports = {
  async dailyUsage (ctx) {
    let {timeRange, dataItems} = ctx.request.body;
    let allQuery = [];
    let responseData = [];

    dataItems.forEach(item => {
      allQuery.push(MeterRecordModel.findAll({
        attributes: ['data_date', colMap[item.dataType]],
        where: {
          data_date: {
            [Op.between]: timeRange
          },
          collect_point_no: item.collectPointNo,
          valid: 1,
          total: {
            [Op.gt]: 0
          }
        }
      }));
    });

    timeRange = timeRange.map(item => new Moment(item));
    let dataLen = Moment.duration(timeRange[1] - timeRange[0]).asDays();

    let queryResult = await Promise.all(allQuery);
    queryResult.forEach((queryResultItem, queryResultIndex) => {
      // 初始化返回项
      responseData.push(dataItems[queryResultIndex]);
      responseData[queryResultIndex].data = Array(dataLen).fill(null);

      queryResultItem.forEach(line => {
        let lineDate = new Moment(line.data_date);
        if (lineDate.isBetween(timeRange[0], timeRange[1], null, '[)')) {
          let resDataIndex = Moment.duration(lineDate - timeRange[0]).asDays();
          responseData[queryResultIndex].data[resDataIndex] = parseFloat(line[colMap[dataItems[queryResultIndex].dataType]]);
        }
      });
    });

    ctx.response.body = {
      status: 1,
      data: responseData
    }
  },

  async maxRequirement (ctx) {
    const requestGroup = ctx.request.body;
    const responseDataSet = {};
    let requirementsMap = {};

    let queryResult = await MaxRequirementModel.findAll({
      attributes: ['collect_point_no', 'type', 'requirement', 'time'],
      where: {
        time: {
          [Op.between]: requestGroup.monthRange
        },
        collect_point_no: {
          [Op.in]: requestGroup.collectPointNos
        },
        type: {
          [Op.in]: requestGroup.types.map(item => typeMap[item])
        }
      }
    });

    queryResult = queryResult.filter(line => {
      line.year = Moment(line.time).year();
      line.month = Moment(line.time).month();
      line.mapIndex = `${line.collect_point_no}-${line.year}-${line.month}-${line.type}`;
      if (requirementsMap[line.mapIndex] === undefined) {
        requirementsMap[line.mapIndex] = [line.requirement];
        return true;
      } else {
        if (requirementsMap[line.mapIndex].indexOf(line.requirement) >= 0) {
          return false;
        } else {
          requirementsMap[line.mapIndex].push(line.requirement);
          return true;
        }
      }
    });

    Object.keys(requirementsMap).forEach(key => {
      let max = 0;
      requirementsMap[key].forEach(item => {
        if (max < item) {
          max = item;
        }
      });
      requirementsMap[key].unshift(max);
    });

    queryResult.forEach(line => {
      line.isMax = (requirementsMap[line.mapIndex][0] === line.requirement);
    });

    if (requestGroup.onlyMax) {
      queryResult = queryResult.filter(item => item.isMax);
    }

    queryResult.forEach(line => {
      if (responseDataSet[line.collect_point_no] === undefined) {
        responseDataSet[line.collect_point_no] = {
          peeks: []
        }
      }
      responseDataSet[line.collect_point_no].peeks.push({
        type: line.type,
        requirement: line.requirement,
        time: Moment(line.time).format('YYYY-MM-DD HH:mm'),
        isMax: line.isMax
      });
    });

    let responseData = [];
    Object.keys(responseDataSet).forEach(collectPointNo => {
      responseData.push(Object.assign({
        collectPointNo
      }, responseDataSet[collectPointNo]))
    });
    ctx.response.body = {
      status: 1,
      data: responseData
    }
  }
};