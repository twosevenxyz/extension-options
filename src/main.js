import Vue from 'vue'

Vue.config.productionTip = false

;(async () => {
  if (process.env.VUE_APP_MODE === 'dev') {
    const tests = await import('@/js/tests')
    window.tests = tests
  }
  const App = (await import('./App.vue')).default
  new Vue({
    render: h => h(App)
  }).$mount('#app')
})()
