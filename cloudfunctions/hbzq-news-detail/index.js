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
    .replace(/\<\/div\>/igm, '</div>\n')
    .replace(/\<p[\s\S]*?\>/igm, '<p>')
    .replace(/\<div[\s\S]*?\>/igm, '<div>')
    .replace(/\<\!--[\s\S]*?--\>/igm, '')
    .replace(/\<img[\s\S]*?src="(.+?)"[\s\S]*?\/\>/igm, '<img src="$1" />')
    .replace(/\<strong\>([\s\S]*?)\<\/strong\>/igm, '$1')
    .replace(/\<span[\s\S]*?\>(.*?)\<\/span\>/igm, '$1')
    .replace(/\<strong\>([\s\S]*?)\<\/strong\>/igm, '$1')
    .replace(/\<span[\s\S]*?\>(.*?)\<\/span\>/igm, '$1')
    .replace(/\<p\>&nbsp;\<\/p\>/igm, '')
    .replace(/\<p\>\<\/p\>/igm, '')
    .replace(/\<br \/\>/igm, '<YC>text_')
    .replace(/\<br\/\>/igm, '<YC>text_')
    .replace(/\<a[\s\S]*?\>(.*?)\<\/a\>/igm, '$1')
    .replace(/\<img src="(.*?)" \/\>/igm, '<YC>image_$1<YC>text_')
    .replace(/\<video src="(.*?)" \/\>/igm, '<YC>video_$1<YC>text_')
    .replace(/\<h2\>([\s\S]*?)\<\/h2\>/igm, '<YC>H2_$1<YC>text_')
    .replace(/\<p\>([\s\S]*?)\<\/p\>/igm, '<YC>text_$1<YC>text_')
    .replace(/\<div\>([\s\S]*?)\<\/div\>/igm, '<YC>text_$1<YC>text_')

  return cont
}

/**
 * 从文本中过滤出图片
 */
const getContentObj = function (str) {

  let list = []

  let array = str.split('<YC>')

  for (let j = 0; j < array.length; j++) {
    if (array[j].trim().length == 0) {
      continue
    }

    let s = array[j].trim()
    let i = s.indexOf('_')

    if (i > -1) {
      let v = s.substr(i + 1).trim()

      if (v != '' && v != undefined) {
        list.push({
          "type": s.substring(0, i),
          "value": v
        })
      }
    }
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