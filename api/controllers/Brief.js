const Model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const tableDateMap = {
  'curveI': 'date',
  'curveP': 'date',
  'curvePTotal': 'date',
  'curveU': 'date',
  'maxRequirement': 'date',
  'meterRecord': 'data_date',
};

module.exports = {
  async brief (ctx) {
    let data = {
      stations: [],
      dateRange: []
    };
    let allClient = await Model.client.findAll({
      attributes: ['collect_point_no', 'client_name']
    });
    allClient.forEach(item => {
      data.stations.push({
        key: item.client_name,
        value: item.collect_point_no
      })
    });
    let allMax = [];
    let allMin = [];
    Object.keys(tableDateMap).forEach(table => {
      allMax.push(Model[table].max(tableDateMap[table]));
      allMin.push(Model[table].min(tableDateMap[table]));
    });
    data.dateRange = await Promise.all([
      Promise.all(allMin).then(res => {
        let min = res[0];
        res.forEach(resItem => {
          if (min > resItem) {
            min = resItem
          }
        });
        return min
      }),
      Promise.all(allMax).then(res => {
        let max = res[0];
        res.forEach(resItem => {
          if (max < resItem) {
            max = resItem
          }
        });
        return max
      })
    ]);
    ctx.response.body = {
      status: 1,
      data
    }
  },
  async clientProp (ctx) {
    const collectPointNos = ctx.request.body;
    let whereOption = {};
    if (collectPointNos.length) {
      whereOption.collect_point_no = {
        [Op.in]: collectPointNos
      }
    }
    let clients = await Model.client.findAll({
      where: whereOption
    });

    let responseData = {};
    clients.forEach(line => {
      responseData[line.collect_point_no] = {
        name: line.client_name,
        addr: line.client_addr
      }
    });

    ctx.response.body = {
      status: 1,
      data: responseData
    }
  }
};