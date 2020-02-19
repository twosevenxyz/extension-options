module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import \'~@/style/bulma-imports.scss\';'
      }
    }
  }
}
