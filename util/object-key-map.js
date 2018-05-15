class ObjectKeyMap {
  constructor () {
    this.map = {};
  }

  get (key, defaultValue) {
    key = this._keystringify(key);
    if (defaultValue && this.map[key] === undefined) {
      this.map[key] = defaultValue;
    }
    return this.map[key];
  }

  all () {
    return this.map;
  }

  // cb(key, value)
  forEach (cb) {
    Object.keys(this.map).forEach((key) => {
      let keyObj = JSON.parse(key);
      cb(keyObj, this.map[key]);
    })
  }

  _keystringify (key) {
    if (typeof key === 'object') {
      key = JSON.stringify(key);
    }
    return key;
  }
}

module.exports = ObjectKeyMap;