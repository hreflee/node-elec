const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Moment = require('moment');

const PowerCutModel = require('../models').powerCut;

const ObjectKeyMap = require('../../util/object-key-map');

const pageSize = 20;

const colMap = {
  'year': 'year',
  'month': 'month',
  'date': 'date_time',
  'collectPointNo': 'collect_point_no'
};
const validMethodMap = {
  '1': '用电模型'
};

module.exports = {
  async query (ctx) {
    const {collectPointNos, dateRange, groupOptions, page} = ctx.request.body;
    const paging = ctx.request.body.paging === undefined ? true:ctx.request.body.paging;
    const haveGroup = groupOptions.length;
    let queryOption = {
      where: {}
    };
    let responseData = [];

    // 生成attributes参数
    queryOption.attributes = [
      'date_time',
      'collect_point_no',
      [Sequelize.fn('YEAR', Sequelize.col('date_time')), 'year'],
      [Sequelize.fn('MONTH', Sequelize.col('date_time')), 'month']
    ];
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

    let timeMapTo = null;
    if (haveGroup) {
      if (groupOptions.includes('date')) {
        timeMapTo = (item) => item.date_time;
      } else {
        if (groupOptions.includes('month') && groupOptions.includes('year')) {
          timeMapTo = (item) => Moment({year: item.year, month: item.month - 1}).format('YYYY-MM');
        } else if (groupOptions.includes('year')) {
          timeMapTo = (item) => '' + item.year;
        } else if (groupOptions.includes('month')) {
          timeMapTo = (item) => '' + item.month;
        } else {
          timeMapTo = () => undefined;
        }
      }
    } else {
      timeMapTo = (item) => Moment(item.date).set({hour: item.start_time.split(':')[0], minute: item.start_time.split(':')[1]}).format('YYYY-MM-DD HH:mm');
    }

    if (haveGroup && groupOptions.includes('timeArea')) {
      let responseData = [];
      // 如果按时段聚合
      queryOption.attributes = queryOption.attributes.concat([
        'duration',
        'start_time'
      ]);
      queryOption.order = ['collect_point_no', 'start_time'];
      let queryResult = await PowerCutModel.findAll(queryOption);
      let groupMap = new ObjectKeyMap();

      queryResult.forEach(line => {
        let groupMapKey = [];
        let lineData = line.dataValues;
        groupOptions
          .filter(item => item !== 'timeArea')
          .forEach(groupOptionsItem => {
            groupMapKey.push(lineData[colMap[groupOptionsItem]])
          });
        let startTime = new Moment(lineData.start_time, 'HH:mm');
        for (let i = 0; i < lineData.duration / 0.25; i++) {
          let groupMapValue = groupMap.get(groupMapKey.concat([startTime.format('HH:mm')]), {
            count: 0,
            totalTime: 0
          });
          groupMapValue.count++;
          groupMapValue.totalTime += 0.25;
          startTime.add(0.25, 'hours');
        }
      });

      // console.log(groupMap.all());
      groupMap.forEach((groupMapKey, groupMapValue) => {
        let keyObj = {};
        let resDataItem = {};
        groupOptions
          .filter(item => item !== 'timeArea')
          .forEach((key, index) => {
            keyObj[colMap[key] || 'timeArea'] = groupMapKey[index];
          });
        keyObj.timeArea = groupMapKey[groupMapKey.length - 1];
        resDataItem = Object.assign({
          time: timeMapTo(keyObj),
          collectPointNo: keyObj.collect_point_no,
          timeArea: keyObj.timeArea
        }, groupMapValue);
        responseData.push(resDataItem);
      });

      let resTotal = responseData.length;
      if (paging) {
        responseData = responseData.slice((page - 1) * pageSize, page * pageSize)
      }

      ctx.response.body = {
        status: 1,
        data: {
          total: resTotal,
          pageSize: pageSize,
          result: responseData
        }
      }
    } else {
      // 如果没有聚合或未要求按时段聚合
      const haveGroupTime = groupOptions.includes('year') || groupOptions.includes('month') || groupOptions.includes('date');
      const haveGroupStation = groupOptions.includes('collectPointNo');

      if (haveGroup) {
        queryOption.attributes = queryOption.attributes.concat([
          [Sequelize.fn('SUM', Sequelize.col('duration')), 'total_time'],
          [Sequelize.fn('COUNT', Sequelize.col('date_time')), 'count'],
          [Sequelize.fn('GROUP_CONCAT', Sequelize.col('date_time')), 'date_concat']
        ]);

        // 生成group参数
        queryOption.group = groupOptions.map(item => colMap[item]);
      } else {
        queryOption.attributes = queryOption.attributes.concat([
          ['duration', 'total_time'],
          'start_time',
          'valid_method'
        ]);
      }

      let queryResult = await PowerCutModel.findAll(queryOption);
      let totalResultCount = queryResult.length;
      if (paging) {
        queryResult = queryResult.slice((page - 1) * pageSize, page * pageSize);
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
          resItem.validMethod = validMethodMap[line.dataValues.valid_method] || '';
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
  }
};