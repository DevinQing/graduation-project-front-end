/**
 * 保留小数位函数
 */

export const keepDecimal = (num, len = 0) => {
  if (isNaN(num)) return num
  const arr = (num + '').split('.')
  arr[1] = arr[1].substring(0, len)
  if (len == 0) {
    return arr[0]
  } else {
    return arr.join('.')
  }
}
