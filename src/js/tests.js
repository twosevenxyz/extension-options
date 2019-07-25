import is from 'is_js'

;(() => {
  const browser = window.chrome || window.browser
  if (!browser.storage) {
    let commonAPI
    if (is.chrome()) {
      commonAPI = {
        async get (key, cb) {
          const result = { [key]: localStorage.getItem(key) }
          cb(result)
        },
        async set (data, cb) {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value)
          })
          cb()
        },
        async getBytesInUse () {
          return 0
        },
        async remove (keys, cb) {
          if (!(keys instanceof Array)) {
            keys = [keys]
          }
          keys.forEach(key => localStorage.removeItem(key))
          cb()
        },
        async clear () {
          localStorage.clear()
        }
      }
    } else if (is.firefox()) {
      commonAPI = {
        async get (key) {
          return localStorage.getItem(key)
        },
        async set (data) {
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value)
          })
        },
        async getBytesInUse () {
          return 0
        },
        async remove (keys) {
          if (!(keys instanceof Array)) {
            keys = [keys]
          }
          keys.forEach(key => localStorage.removeItem(key))
        },
        async clear () {
          localStorage.clear()
        }
      }
    }
    browser.storage = {
      sync: commonAPI,
      local: commonAPI,
      managed: commonAPI
    }
  }

  browser.extension = {
    getBackgroundPage () {
      return window
    }
  }
})()
