import {playMode} from '../common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '../common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: null,
  playlist: [],
  sequenceList: [],
  playMode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state
