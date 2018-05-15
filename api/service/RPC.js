const PROTO_PATH = __dirname + '/proto/ElectricityServer.proto';
const RPC_PORT = require('../../config/config').rpcPort;

const grpc = require('grpc');

const electricityProto = grpc.load(PROTO_PATH).electricity;
const electricityClient = new electricityProto.PowerCutService('localhost:' + RPC_PORT, grpc.credentials.createInsecure());

let methods = {
  validArray (stationHistory) {
    stationHistory = stationHistory.map(item => {
      let collectPointNo = item.collectPointNo;
      delete item.collectPointNo;
      return {
        collectPointNo,
        historyItem: item
      };
    });
    return new Promise((resolve, reject) => {
      electricityClient.validArray({historyArray: stationHistory}, function (err, response) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(JSON.stringify(response));
          response = response.resultArray;
          response = response.map(item => {
            item.resultItem.collectPointNo = item.collectPointNo;
            return item.resultItem;
          });
          resolve(response);
        }
      })
    });
  }
};

module.exports = methods;