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

let okm = new ObjectKeyMap();
console.log(okm.get({a: 1}, {b: 2}));
console.log(okm.all());
let a1 = okm.get({a: 1}, {b: 2});
a1.b = 100;
console.log(okm.all());
console.log(okm.get([1, 'b'], {b: 2}));
console.log(okm.all());
okm.forEach((key, value) => {
  console.log(key, value);
});

module.exports = ObjectKeyMap;