import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import slider from './base/slider'
import scroll from './base/scroll'
import topTip from './base/top-tip'
import confirm from './base/confirm'
import loading from './base/loading'
import listview from './base/listview'
import switches from './base/switches'
import noResult from './base/no-result'
import songList from './base/song-list'
import searchBox from './base/search-box'
import searchList from './base/search-list'
import progressBar from './base/progress-bar'
import progressCircle from './base/progress-circle'

import './common/scss/index.scss'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})

Vue.use(slider)
Vue.use(scroll)
Vue.use(topTip)
Vue.use(confirm)
Vue.use(loading)
Vue.use(listview)
Vue.use(switches)
Vue.use(noResult)
Vue.use(songList)
Vue.use(searchBox)
Vue.use(searchList)
Vue.use(progressBar)
Vue.use(progressCircle)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
