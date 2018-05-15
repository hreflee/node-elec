const bestFilePath = require('../../config/config').bestItemsDeltasPath;
const bestModelInfoFile = require(bestFilePath);

module.exports = {
  getModelInfoByCollectPointNo (collectPointNo) {
    let modelInfo = bestModelInfoFile.find(item => item.collect_point_no === collectPointNo);
    return modelInfo.items.reduce((paramArray, itemsValue) => {
      return modelInfo.deltas.reduce((subArray, deltasValue) => {
        return subArray.concat([{
          item: itemsValue,
          delta: deltasValue,
          keyName: `before_${itemsValue}_${deltasValue}`
        }]);
      }, []);
    }, []);
  }
};