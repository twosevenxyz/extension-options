// Chrome expects a callback whereas firefox returns a promise
// But because Firefox polyfills window.chrome to be equivalent to Chrome's implementation
// and because we do browser = window.chrome || window.browser, we're always using
// the chrome implementation
let polyfilledStorage
;(() => {
  const browser = window.chrome || window.browser

  class PolyfilledStorageArea {
    constructor (name) {
      this.name = name
      this.storageArea = browser.storage[name]
    }
    commonHandle (fn, ...args) {
      return new Promise(function (resolve, reject) {
        fn.call(this.storageArea, ...args, resolve)
      }.bind(this))
    }

    get (...args) {
      return this.commonHandle(this.storageArea.get, ...args)
    }
    set (...args) {
      return this.commonHandle(this.storageArea.set, ...args)
    }
    getBytesInUse () {
      return this.commonHandle(this.storageArea.getBytesInUse)
    }
    remove (...args) {
      return this.commonHandle(this.storageArea.remove, ...args)
    }
    clear () {
      return this.commonHandle(this.storageArea.clear)
    }
  }
  polyfilledStorage = {
    sync: new PolyfilledStorageArea('sync'),
    local: new PolyfilledStorageArea('local'),
    managed: new PolyfilledStorageArea('managed')
  }
})()

export default polyfilledStorage
