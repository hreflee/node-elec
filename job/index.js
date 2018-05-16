const Schedule = require('node-schedule');
const Got = require('got');
const Moment = require('moment');
const QueryString = require('query-string');

const WeatherModel = require('../api/models/index').weather;

const ObjectKeyMap = require('../util/object-key-map');

const cmaConfig = require('../config/secret-config').cmaConfig;

const getWeather = async function () {
  let url = 'http://api.data.cma.cn:8090/api';
  let stationId = '57687'
  let param = {
    userId: cmaConfig.userId,
    pwd: cmaConfig.pwd,
    dataFormat: 'json',
    interfaceId: 'getSurfEleByTimeRangeAndStaID',
    timeRange: '[20180511120000,20180515000000]',
    staIDs: stationId,
    elements: 'TEM,RHU,WIN_S_Avg_2mi,Station_Id_C,Year,Mon,Day,Hour',
    dataCode: 'SURF_CHN_MUL_HOR'
  };
  let endDate = null;
  if (Moment().hour() > 8) {
    endDate = (new Moment()).startOf('day');
  } else {
    endDate = (new Moment()).subtract(1, 'days').startOf('day');
  }
  endDate.subtract(1, 'seconds');
  let startDate = (new Moment(endDate)).subtract(7, 'days');
  param.timeRange = `[${startDate.format('YYYYMMDDHHmmss')},${endDate.format('YYYYMMDDHHmmss')}]`;
  console.log('[job] query param:', QueryString.stringify(param));
  for (let i = 0; i < 1; i++) {
    try {
      let response = await Got(url + '?' + QueryString.stringify(param));
      response = JSON.parse(response.body);
      if (response.returnCode === '0') {
        let map = new ObjectKeyMap();
        response.DS.forEach(responseItem => {
          map.get(Moment({
            year: responseItem.Year,
            month: parseInt(responseItem.Mon) - 1,
            day: responseItem.Day
          }).format('YYYY-MM-DD'), []).push(responseItem);
        });
        map = map.all();
        let dateArray = Object.keys(map);
        for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i];
          if (map[date].length !== 24) {
            console.error('[job] data at', date, 'is not complete');
          } else {
            let finalData = map[date].reduce((sumObj, item) => {
              Object.keys(sumObj).forEach(dataKey => {
                sumObj[dataKey] += parseFloat(item[dataKey]) * 10;
              });
              return sumObj;
            }, {
              TEM: 0,
              RHU: 0,
              WIN_S_Avg_2mi: 0
            });
            finalData.WIN = finalData.WIN_S_Avg_2mi;
            delete finalData.WIN_S_Avg_2mi;
            Object.keys(finalData).forEach(key => {
              finalData[key] = ((finalData[key] / 24) / 10).toFixed(1);
            });
            let exit = WeatherModel.count({
              where: {
                station_id: stationId,
                date
              }
            });
            if (exit) {
              await WeatherModel.update(finalData, {
                where: {
                  station_id: stationId,
                  date
                }
              })
            } else {
              await WeatherModel.create(Object.assign(finalData, {
                station_id: stationId,
                date
              }));
            }
          }
        }
      } else {
        console.log(response);
        throw Error('return code:' + response.returnCode);
      }
    } catch (err) {
      console.error(`[job] get weather fail at the ${i}th try, err:`, err)
    }
  }
};
getWeather();
module.exports = {
  createJob () {
    Schedule.scheduleJob('0 0 9 * * *', getWeather);
  }
}
