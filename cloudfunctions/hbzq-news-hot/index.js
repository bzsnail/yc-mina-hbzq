// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  var url = 'http://www.hebeizuqiu.net'

  return await new Promise((resolve, reject) => {
    
    request(url, function (error, response, body) {

      let list = []
      if (!error && response.statusCode == 200) {
        list = getNewsList(body)
      }
      resolve(list)
    })

  });

}
/**
 * 从文本中过滤出新闻
 */
const getNewsList = function (str) {

  let list = []
  const reg = /\<li class="item"\>\<a[\s\S]*?href="(.*?)"[\s\S]*?\>\<img[\s\S]*?data-original="(.*?)"[\s\S]*?class="thumb"\/\>(.*?)\<\/a\>\<\/li\>/igm;

  var r = ''
  while (r = reg.exec(str)) {

    if (r[2] == 'http://www.hebeizuqiu.net/wp-content/themes/xiu/images/thumbnail.png') {
      continue
    }

    list.push({
      url: r[1],
      image: r[2].replace('-120x80', ''),
      title: r[3].replace(/\<.*?\>/igm, '').replace(/\<\/.*?\>/igm, ''),
    })
  }

  return list
}
