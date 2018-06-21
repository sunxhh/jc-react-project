// 降序排序
export function sortUpByProperty(data, propertyName) {
  if ((typeof data[0][propertyName]) !== 'number') {
    return data.sort(function(object1, object2) {
      const value1 = object1[propertyName]
      const value2 = object2[propertyName]
      return value2.localeCompare(value1)
    })
  } else {
    return data.sort(function(object1, object2) {
      const value1 = object1[propertyName]
      const value2 = object2[propertyName]
      return value2 - value1
    })
  }
}
