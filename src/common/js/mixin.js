import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from './config'
import {shuffle} from './until'

export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  },
  watch: {
    playlist: {
      handler(val) {
        this.handlePlaylist(val)
      },
      deep: true
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.playMode == playMode.sequence ? 'icon-sequence' : this.playMode == playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters(['sequenceList', 'currentSong', 'playlist', 'playMode', 'favoriteList'])
  },
  methods: {
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      let index = this.favoriteList.findIndex((item) => {
        return item.id == song.id
      })
      return index > -1
    },
    changeMode() {
      let mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode == playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id == this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    blurInput() {
      this.$refs.search.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    addQuery(query) {
      this.$refs.search.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}
