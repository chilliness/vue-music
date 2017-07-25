export function addClass(el, cls) {
  if (hasClass(el, cls)) {
    return
  }
  let newCls = el.className.split(' ')
  newCls.push(cls)
  el.className = newCls.join(' ')
}

export function hasClass(el, cls) {
  let reg = new RegExp('(^|\\s)' + cls + '(\\s|$)')
  return reg.test(el.cls)
}

export function getData(el, name) {
  name = 'data-' + name
  return el.getAttribute(name)
}

let elStyle = document.createElement('div').style

let vender = (() => {
  let browserNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in browserNames) {
    if (elStyle[browserNames[key]] != undefined) {
      return key
    }
  }
  // 所有都不支持，说明是非主流浏览器
  return false
})()

export function prefixStyle(style) {
  if (vender == false) {
    return false
  }
  if (vender == 'standard') {
    return style
  }
  return vender + style.charAt(0).toUpperCase() + style.substr(1)
}
