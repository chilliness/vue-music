function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice(0)
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

export function debounce(fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
