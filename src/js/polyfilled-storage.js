// Chrome expects a callback whereas firefox returns a promise
// But because Firefox polyfills window.chrome to be equivalent to Chrome's implementation
// and because we do browser = window.chrome || window.browser, we're always using
// the chrome implementation

// Additionally, since onChanged is unimplemented in Firefox, this polyfill
// implements this logic in-house across both, Chrome and Firefox.
import Emittery from 'emittery'

let polyfilledStorage
;(() => {
  const browser = window.chrome || window.browser

  class PolyfilledStorageArea {
    constructor (name, onChangedEventKey = '__polyfill-storage-update__') {
      this.name = name
      this.storageArea = browser.storage[name]
      this.onChanged = this.storageArea.onChanged
      this.onChangedEventKey = onChangedEventKey

      this.emittery = new Emittery()
      this.callbackMap = new Map()
      browser.runtime.onMessage.addListener(msg => {
        if (!msg.action || msg.action !== this.onChangedEventKey || msg.storageArea !== name) {
          return
        }
        const { changes, namespace } = msg
        this.emittery.emit(this.onChangedEventKey, { changes, namespace })
      })

      this.onChanged = {
        addListener: (cb) => {
          const realCallback = ({ changes, namespace }) => cb(changes, namespace)
          this.emittery.on(this.onChangedEventKey, realCallback)
          this.callbackMap.set(cb, realCallback)
        },
        removeListener: (cb) => {
          const realCallback = this.callbackMap.get(cb)
          if (!realCallback) {
            return
          }
          this.emittery.off(this.onChangedEventKey, realCallback)
          this.callbackMap.delete(cb)
        },
        hasListener: (cb) => {
          return !!this.callbackMap.get(cb)
        }
      }
    }

    commonHandle (fn, ...args) {
      return new Promise((resolve, reject) => {
        fn.call(this.storageArea, ...args, resolve)
      })
    }

    get (...args) {
      return this.commonHandle(this.storageArea.get, ...args)
    }

    set (items, ...args) {
      const result = this.commonHandle(this.storageArea.set, items, ...args)
      result.then(() => {
        const changes = {}
        for (const [k, v] of Object.entries(items)) {
          changes[k] = { newValue: v }
        }
        browser.runtime.sendMessage({
          action: this.onChangedEventKey,
          storageArea: this.name,
          changes
        })
      })
      return result
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
