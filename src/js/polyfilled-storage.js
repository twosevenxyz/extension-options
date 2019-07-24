import is from 'is_js'

// Chrome expects a callback whereas firefox returns a promise

let polyfilledStorage
;(() => {
  const browser = window.chrome || window.browser
  const isChrome = is.chrome()

  class PolyfilledStorageArea {
    constructor (name) {
      this.name = name
      this.storageArea = browser.storage[name]
    }
    commonHandle (fn, ...args) {
      if (isChrome) {
        return new Promise(function (resolve, reject) {
          fn.call(this.storageArea, ...args, resolve)
        }.bind(this))
      }
      return fn.call(this.storageArea, ...args)
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
