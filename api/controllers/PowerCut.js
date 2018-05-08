const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Moment = require('moment');
const PowerCutModel = require('../models').powerCut;
const pageSize = 20;
const validMethodMap = {
  '1': '用电模型'
};

module.exports = {
  async query (ctx) {
    const {collectPointNos, dateRange, groupOptions, page} = ctx.request.body;
    const paging = ctx.request.body.paging === undefined ? true:ctx.request.body.paging;
    const haveGroup = groupOptions.length;
    const haveGroupTime = groupOptions.includes('year') || groupOptions.includes('month') || groupOptions.includes('date');
    const haveGroupStation = groupOptions.includes('collectPointNo');
    let queryOption = {
      attributes: [],
      where: {}
    };
    let responseData = [];

    // 生成where参数
    if (dateRange.length) {
      queryOption.where.date_time = {
        [Op.between]: dateRange
      }
    }
    if (collectPointNos.length) {
      queryOption.where.collect_point_no = {
        [Op.in]: collectPointNos
      }
    }


    // 生成attributes参数
    queryOption.attributes = [
      ['date_time', 'date'],
      'collect_point_no',
      [Sequelize.fn('YEAR', Sequelize.col('date_time')), 'year'],
      [Sequelize.fn('MONTH', Sequelize.col('date_time')), 'month']
    ];
    if (haveGroup) {
      queryOption.attributes = queryOption.attributes.concat([
        [Sequelize.fn('SUM', Sequelize.col('duration')), 'total_time'],
        [Sequelize.fn('COUNT', Sequelize.col('date_time')), 'count'],
        [Sequelize.fn('GROUP_CONCAT', Sequelize.col('date_time')), 'date_concat']
      ]);

      // 生成group参数
      queryOption.group = groupOptions.map(item => ({
        'year': 'year',
        'month': 'month',
        'date': 'date_time',
        'collectPointNo': 'collect_point_no'
      })[item]);
    } else {
      queryOption.attributes = queryOption.attributes.concat([
        ['duration', 'total_time'],
        'start_time',
        'valid_method'
      ]);
    }

    let queryResult = await PowerCutModel.findAll(queryOption);
    let totalResultCount = queryResult.length;
    queryResult = queryResult.slice((page - 1) * pageSize, page * pageSize);

    let timeMapTo = null;
    if (haveGroup) {
      if (groupOptions.includes('date')) {
        timeMapTo = (item) => item.date;
      } else {
        if (groupOptions.includes('month') && groupOptions.includes('year')) {
          timeMapTo = (item) => Moment({year: item.year, month: item.month - 1}).format('YYYY-MM');
        } else if (groupOptions.includes('year')) {
          timeMapTo = (item) => '' + item.year;
        } else if (groupOptions.includes('month')) {
          timeMapTo = (item) => '' + item.month;
        }
      }
    } else {
      timeMapTo = (item) => Moment(item.date).set({hour: item.start_time.split(':')[0], minute: item.start_time.split(':')[1]}).format('YYYY-MM-DD HH:mm');
    }
    queryResult.forEach(line => {
      let dateValuesSet = new Set();
      haveGroup && line.dataValues.date_concat.split(',').forEach(dateItem => {
        dateValuesSet.add(dateItem);
      });

      let resItem = {};
      if (haveGroup) {
        if (haveGroupTime) {
          resItem.time = timeMapTo(line.dataValues);
        }
        if (haveGroupStation) {
          resItem.collectPointNo = line.dataValues.collect_point_no;
        }
        resItem.count = line.dataValues.count;
        resItem.totalDays = dateValuesSet.size;
      } else {
        resItem.time = timeMapTo(line.dataValues);
        resItem.collectPointNo = line.dataValues.collect_point_no;
        resItem.validMethod = validMethodMap[line.dataValues.valid_method];
      }
      resItem.totalTime = line.dataValues.total_time;
      responseData.push(resItem);
    });

    ctx.response.body = {
      status: 1,
      data: {
        total: totalResultCount,
        pageSize,
        result: responseData
      }
    };
  }
};
let example = [
  { // 按次
    time: '2015-01-01 14:00', // date + startTime
    collectPointNo: '0104017913',
    totalTime: 222.5
  },
  { // 按日
    time: '2015-01-01',
    count: 2,
    totalTime: 222.5
  },
  { // 按月
    time: '01',
    count: 2,
    totalDays: 10,
    totalTime: 222.5
  },
  { // 按年
    time: '2017',
    count: 2,
    totalDays: 10,
    totalTime: 222.5
  },
  { // 按年+月
    time: '2017',
    count: 2,
    totalDays: 10,
    totalTime: 222.5
  }
]