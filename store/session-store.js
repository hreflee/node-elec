module.exports =  {
  storage: {},
  get (key, maxAge) {
    return this.storage[key]
  },
  set (key, sess, maxAge) {
    this.storage[key] = sess
  },
  destroy (key) {
    delete this.storage[key]
  }
}