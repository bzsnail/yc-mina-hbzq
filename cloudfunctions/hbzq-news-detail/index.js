// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  let { requestUrl } = event

  requestUrl = defaultValue(requestUrl, 'http://www.hebeizuqiu.net/news/30940.html')

  var url = requestUrl
  console.log(url)

  return await new Promise((resolve, reject) => {

    request(url, function (error, response, body) {

      let news = {}
      if (!error && response.statusCode == 200) {
        news = getNewsDetail(body)
      }
      resolve(news)
    })

  });

}

/**
 * 从文本中过滤出新闻
 */
const getNewsDetail = (str) => {

  const reg = /\<h1 class="article-title"\>\<a[\s\S]*?\>(.+?)\<\/a\>\<\/h1\>[\s\S]*?\<ul class="article-meta"\>[\s\S]*?\<li\>(.+?)\<\/li\>[\s\S]*?\<article class="article-content"\>([\s\S]*?)\<p class="post-copyright"\>/igm;

  let r = reg.exec(str)

  let news = {
    title: r[1],
    time: r[2],
    content: getContentObj(dealNewsContent(r[3]))
  }

  return news
}

/**
 * 处理文章内容，替换图片和文本标签
 */
const dealNewsContent = function (str) {

  let cont = str

  cont = cont.replace(/\<\/p\>/igm, '</p>\n')
    .replace(/\<img[\s\S]*?src="(.+?)"[\s\S]*?\/\>/igm, '<img src="$1" />')
    .replace(/\<strong\>(.*?)\<\/strong\>/igm, '$1')
    .replace(/\<span[\s\S]*?\>(.*?)\<\/span\>/igm, '$1')
    .replace(/(\<p\>)([\s\S]*?)(\<img src=".*" \/\>)([\s\S]*?)(\<\/p\>)/igm, '$1$2$5$3$1$4$5')
    .replace(/\<strong\>(.*?)\<\/strong\>/igm, '$1')
    .replace(/\<span[\s\S]*?\>(.*?)\<\/span\>/igm, '$1')
    .replace(/\<p\>&nbsp;\<\/p\>/igm, '')
    .replace(/\<p\>\<\/p\>/igm, '')
    .replace(/\<br \/\>/igm, '')
    .replace(/\<br\/\>/igm, '')
    .replace(/\<a[\s\S]*?\>(.*?)\<\/a\>/igm, '$1')
    .replace(/\<p\>([\s\S]*?)\<\/p\>/igm, '<YC>text_$1</YC>')
    .replace(/\<img src="(.*?)" \/\>/igm, '<YC>image_$1</YC>')
    .replace(/\<video src="(.*?)" \/\>/igm, '<YC>video_$1</YC>')
    .replace(/\<h2\>([\s\S]*?)\<\/h2\>/igm, '<YC>H2_$1</YC>')

    return cont
}

/**
 * 从文本中过滤出图片
 */
const getContentObj = function (str) {

  let list = []

  const reg = /\<YC\>([\s\S]*?)\<\/YC\>/igm;

  var r = ''
  while (r = reg.exec(str)) {

    let s = r[1]
    let i = s.indexOf('_')

    list.push({
      "type": s.substring(0, i),
      "value": s.substr(i + 1).trim()
    })

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