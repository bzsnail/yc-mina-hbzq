// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let { requestUrl, pno } = event
  requestUrl = defaultValue(requestUrl, 'http://www.hebeizuqiu.net/')
  pno = defaultValue(pno, '1')

  var url = requestUrl + '/page/' + pno
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

  const reg = /\<article[\s\S]*?\<header\>[\s\S]*?\<h2\>\<a[\s\S]*?href="(.*?)"[\s\S]*?\>(.*?)\<\/a\>\<\/h2\>[\s\S]*?\<\/header\>[\s\S]*?\<p class="text-muted time"\>(.*?)\<\/p\>[\s\S]*?\<p class="focus"\>([\s\S]*?)\<\/p\>[\s\S]*?\<p class="note"\>([\s\S]*?)\<\/p\>[\s\S]*?\<p class="text-muted views"\>([\s\S]*?)\<\/p\>[\s\S]*?\<\/article\>[\s\S]*?/igm;

  var r = ''
  while (r = reg.exec(str)) {

    let imageList = getImageList(r[4])
    let tagList = getTagList(r[6])

    list.push({
      url: r[1],
      title: r[2],
      time: r[3],
      imageList: imageList,
      desc: r[5].trim(),
      tagList: tagList
    })
  }

  return list
}

/**
 * 从文本中过滤出图片
 */
const getImageList = (str) => {

  let list = []

  const reg = /\<img[\s\S]*?data-original="(.*?)"[\s\S]*?class="thumb"\/\>/igm;

  var r = ''
  while (r = reg.exec(str)) {
    list.push(r[1].replace('-120x80', ''))
  }

  return list
}
/**
 * 从文本中过滤出标签
 */
const getTagList = (str) => {

  let list = []

  const reg = /\<a[\s\S]*?rel="tag"\>(.+?)\<\/a\>/igm;

  var r = ''
  while (r = reg.exec(str)) {
    list.push(r[1])
  }

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