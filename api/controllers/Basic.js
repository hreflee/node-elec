const Op = require('sequelize').Op;
const Model = require('../models');
const Moment = require('moment');
const tableDataTypeMap = {
  'I-A': ['curveI', 'A'],
  'I-B': ['curveI', 'B'],
  'I-C': ['curveI', 'C'],
  'U-A': ['curveU', 'A'],
  'U-B': ['curveU', 'B'],
  'U-C': ['curveU', 'C'],
  'P-A': ['curveP', 'A'],
  'P-B': ['curveP', 'B'],
  'P-C': ['curveP', 'C'],
  'P-T': ['curvePTotal', 'total'],
};
let timePlot = [];
for (let i = 0; i < 24; i++) {
  for (let j = 0; j < 60; j+=15) {
    timePlot.push({
      hour: i,
      minute: j
    });
  }
}

module.exports = {
  async basic (ctx) {
    let {timeRange, dataItems} = ctx.request.body;
    let allQuery = [];
    let responseData = [];
    dataItems.forEach(item => {
      allQuery.push(Model[tableDataTypeMap[item.dataType][0]].findAll({
        attributes: ['date', tableDataTypeMap[item.dataType][1]],
        where: {
          date: {
            [Op.between]: timeRange.map(item => item.split(' ')[0])
          },
          collect_point_no: item.collectPointNo
        }
      }));
    });

    // 15分钟对齐
    timeRange = timeRange.map(item => new Moment(item));
    while (timeRange[0].minute() % 15) {
      timeRange[0].add(1, 'minute');
    }
    while (timeRange[1].minute() % 15) {
      timeRange[1].subtract(1, 'minute');
    }
    let dataLen = Moment.duration(timeRange[1] - timeRange[0]).asMinutes() / 15;

    let queryResult = await Promise.all(allQuery);
    queryResult.forEach((queryResultItem, queryResultIndex) => {
      // 初始化返回项
      responseData.push(dataItems[queryResultIndex]);
      responseData[queryResultIndex].data = Array(dataLen).fill(null);

      queryResultItem.forEach(line => {
        let lineDate = new Moment(line.date);
        let lineData = line[tableDataTypeMap[dataItems[queryResultIndex].dataType][1]];
        lineData && lineData
          .split(',')
          .map(item => {
            if (item) {
              return parseFloat(item);
            } else {
              return null;
            }
          })
          .forEach((item, index) => {
            if (lineDate.set(timePlot[index]).isBetween(timeRange[0], timeRange[1], null, '[)')) {
              let resDataIndex = Moment.duration(lineDate - timeRange[0]).asMinutes() / 15;
              responseData[queryResultIndex].data[resDataIndex] = item;
            }
          });
      })
    });

    ctx.response.body = {
      status: 1,
      data: responseData
    }
  }
};