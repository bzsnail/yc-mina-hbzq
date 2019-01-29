// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let { pno } = event  
  pno = defaultValue(pno, '1')

  var url = 'http://www.dongqiudi.com/archives/1?page=' + pno
  console.log(url)
  let requestStart = new Date().getTime()
  return await new Promise((resolve, reject) => {

    request(url, function (error, response, body) {

      let list = []
      if (!error && response.statusCode == 200) {
        let requestEnd = dealDataStart = new Date().getTime()
        console.log('request-time:' + (requestEnd - requestStart))

        list = getNewsList(body)

        let dealDataEnd = new Date().getTime()
        console.log('deal-data-time:' + (dealDataEnd - dealDataStart))
      }
      resolve(list)
    })

  });

}

/**
 * 从文本中过滤出新闻
 */
const getNewsList = (str) => {

  let list = []
  list = JSON.parse(str).data

  return list
}

/**
 * 处理默认值
 */
const defaultValue = (v, defaultValue) => {
  if (v == undefined || v == null || v == '') {
    v = defaultValue
  }
  return v
}