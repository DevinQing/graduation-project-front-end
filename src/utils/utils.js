import moment from 'moment'
/**
 * 保留小数位函数
 */

export const keepDecimal = (num, len = 0) => {
  if (isNaN(num)) return num
  const arr = (num + '').split('.')
  // 如果能直接整除 保留一位
  if (!arr[1]) arr[1] = '00000000'
  arr[1] = arr[1].substring(0, len)
  if (len == 0) {
    return arr[0]
  } else {
    return arr.join('.')
  }
}
/**
 * 增加若干时间
 */
export const addDays = (now, days) => {
  if (days == '' || days == undefined) {
    days = 1
  }
  const date = new Date(now)
  date.setDate(date.getDate() + days)
  return moment(date).format('YYYY-MM-DD')
}
/**
 * 格式化时间
 */

export const formatTime = (time, str) => {
  return moment(time).format(str)
}
