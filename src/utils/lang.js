
/** Used to check objects for own properties. */
// const hasOwnProperty = Object.prototype.hasOwnProperty;

function isObject(value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}

function isArray(value) {
  const _isArray = Array.isArray || (_arg => Object.prototype.toString.call(_arg) === '[object Array]')
  return _isArray(value)
}

function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (isObject(value)) return Object.keys(value).length === 0
  if (isArray(value)) return value.length === 0

  return false
}

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]'
}

function objectHandler(obj, handler) {
  const finalObj = Object.keys(obj)
    .reduce((a, c) => ({
      ...a,
      [c]: handler(obj[c])
    }), {})
  return finalObj
}

function trim(str) {
  if (Object.prototype.toString.call(str) === '[object String]') {
    return str.trim()
  }
  return str
}

function baseGet(object, path) {
  path = path.split('.')

  let index = 0
  const length = path.length

  while (object != null && index < length) {
    object = object[path[index++]]
  }
  return (index && index === length) ? object : undefined
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @see has, hasIn, set, unset
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * get(object, 'a[0].b.c')
 * // => 3
 *
 * get(object, ['a', '0', 'b', 'c'])
 * // => 3
 *
 * get(object, 'a.b.c', 'default')
 * // => 'default'
 */
function get(object, path, defaultValue) {
  const result = object == null ? undefined : baseGet(object, path)
  return result === undefined ? defaultValue : result
}

export {
  isString,
  isObject,
  isArray,
  isEmpty,
  objectHandler,
  trim,
  get,
}
