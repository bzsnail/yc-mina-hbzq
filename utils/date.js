
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = (date, now) => {
  const ts = now.getTime() - date.getTime()
  if (ts < 60 * 1000) {
    return '刚刚'
  } else if (ts < 60 * 60 * 1000) {
    return Math.floor(ts / 1000 / 60) + '分钟前'
  } else if (ts < 24 * 60 * 60 * 1000) {
    return Math.floor(ts / 1000 / 60 / 60) + '小时前'
  } else {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}

module.exports = {
  formatDate: formatDate,
}
