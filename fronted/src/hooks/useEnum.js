export const useEnum = (enumObj) => {
  // 获取枚举值对象
  function getValueEnum() {
    const result = Object.entries(enumObj).reduce((acc, [key, valueObj]) => {
      acc[key] = valueObj.value
      return acc
    }, {})
    return Object.freeze(result)
  }

  // 获取枚举标签对象
  function getLabelEnum() {
    const result = Object.entries(enumObj).reduce((acc, [key, valueObj]) => {
      acc[key] = valueObj.label
      return acc
    }, {})
    return Object.freeze(result)
  }

  // 获取数组List
  function getList() {
    const result = Object.entries(enumObj).reduce((acc, [, valueObj]) => {
      acc.push(valueObj)
      return acc
    }, [])
    return result
  }

  // 获取label-value的Map
  function getLabelMap() {
    const result = Object.entries(enumObj).reduce((acc, [, valueObj]) => {
      acc.set(valueObj.label, valueObj.value)
      return acc
    }, new Map())
    return result
  }

  // 获取value-label的Map
  function getValueMap() {
    const result = Object.entries(enumObj).reduce((acc, [, valueObj]) => {
      acc.set(valueObj.value, valueObj.label)
      return acc
    }, new Map())
    return result
  }
  return {
    getValueEnum,
    getLabelEnum,
    getList,
    getLabelMap,
    getValueMap,
  }
}
