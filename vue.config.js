let cssData = ''
for (let v in process.env) {
  if (/VUE_APP_/i.test(v)) {
    cssData += `$${v}: "${process.env[v]}";`
  }
}

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: cssData
      }
    }
  }
}
