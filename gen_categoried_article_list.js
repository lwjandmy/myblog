const co = require('./co')
const Promise = require('./bluebird-release/bluebird')
const fs = Promise.promisifyAll(require('fs'))

// 字符串转日期格式, 字符串格式: 20160101一010101
const readDate = function (str)
{
  var res = str.match(new RegExp(/(\d{4})(\d{2})(\d{2})一(\d{2})(\d{2})(\d{2})/));
  var date = new Date();
  date.setFullYear(res[1]);
  date.setMonth(res[2] - 1);
  date.setDate(res[3]);
  date.setHours(res[4]);
  date.setMinutes(res[5]);
  date.setSeconds(res[6]);
  return date;
}
// 日期转字符串格式, 字符串格式: 20160101一010101
const writeDate = function (date)
{
  // 把1位的数字前面加上0
  var int2Date = function (i) {
    var s = '' + i;
    if (s.length == 1)
      s = '0' + s;
    return s;
  };
  var str = '' + int2Date(date.getFullYear()) + int2Date(date.getMonth() + 1) + int2Date(date.getDate()) + '一' + 
      int2Date(date.getHours()) + int2Date(date.getMinutes()) + int2Date(date.getSeconds());
  return str;
}



co(function* () {
  // 移除旧文件列表
  yield fs.unlinkAsync('js/categoried_article_list.js')
  
  // 解析文件名+.+category+.+脚本Lua+.+title+.+学习_ENV和_G+.+createtime+.+20150423一210500+.+lastmodifiedtime+.+20150423一210500+.+
  // 为: { category: '脚本Lua', title: '学习_ENV和_G', ... }
  const parse_file_name = file_name => {
    const article = {}
    const attrs = file_name.split('\+\.\+')
    for (var i = 1; i < attrs.length - 1; i += 2)
      article[attrs[i]] = attrs[i+1];
    return article
  }
  
  // 扫描文章列表, 组装出文件信息列表article_list
  const article_list = (yield fs.readdirAsync('articles'))
    .filter(file_path =>
      file_path.match(/^\+\.\+/) // 开头是+.+
      && file_path.match(/\+\.\+\.html$/) // 结尾是+.+.html
    )
    .map(file_path => {
      const file_name = file_path.replace('\.html', '')
      const article = { path: 'articles/' + file_path }
      Object.assign(article, parse_file_name(file_name))
      return article
    })

  // 将文章分类, 返回map, 键是分类名, 值是article_list
  var categories = {}; // categories: 文章分类 -> article_list
  article_list.forEach(function (article) {
    // 建立文章分类
    if (undefined == categories[article.category])
      categories[article.category] = [];
    // 文章加入分类
    categories[article.category].push(article);
    // 去掉文章分类属性
    delete article.category;
  });
  
  // 对文章分类categories, 加上分类下文章数量
  Object.keys(categories).forEach(function (category) {
    var length = categories[category].length;
    var new_category = category + " (" + length + ")";
    categories[new_category] = categories[category];
    delete categories[category];
  });
  
  // 对map, 的key重新排序, 用于对分类排序, 返回排序的map
  const sort_map_key = function (map) {
    keys = Object.keys(map);
    keys.sort();
    const sorted_map = {};
    keys.forEach(function (key) {
      sorted_map[key] = map[key];
    });
    return sorted_map;
  }
  
  // 按分类排序
  categories = sort_map_key(categories);

  // 对分类后文章, 每类文章按修改时间倒序排序, 返回值是分类后按修改时间倒序排序的文章
  Object.keys(categories).forEach(category =>
    categories[category].sort((a, b) =>
      readDate(b['lastmodifiedtime']) - readDate(a['lastmodifiedtime'])))

  // 保存文件
  yield fs.appendFileAsync(
    'js/categoried_article_list.js',
    'categoried_article_list = ' + JSON.stringify(categories) + ';',
    'utf8')

})

