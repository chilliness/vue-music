import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index == 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function saveSearch(query) {
  let searches = loadSearch()
  insertArray(searches, query, (item) => {
    return item == query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = loadSearch()
  deleteFromArray(searches, (item) => {
    return item == query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function savePlay(song) {
  let songs = loadPlay()
  insertArray(songs, song, (item) => {
    return item.id == song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

export function saveFavorite(song) {
  let songs = loadFavorite()
  insertArray(songs, song, (item) => {
    return item.id == song.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = loadFavorite()
  deleteFromArray(songs, (item) => {
    return item.id == song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
