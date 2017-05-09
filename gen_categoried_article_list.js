var fs = require('fs');

// 字符串转日期格式, 字符串格式: 20160101一010101
var readDate = function (str)
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
var writeDate = function (date)
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

// 移除旧文件列表
var remove_file_list = function (callback) {
	fs.unlink('js/categoried_article_list.js', function (err) {
		callback && callback();
	});
}

// 扫描文章列表, 回调函数参数返回list, 每个元素为map, 每个map为文件名分隔符分割后的键值对
var scan_file_list = function (callback) {
	fs.readdir('articles', function (err, files) {
		var article_list = [];
		files.forEach(function (file_path) {
			if (file_path.match('\.html$') == null || // html结尾
				file_path.match(/^\+\.\+/)  == null || // 首尾都有特殊符号
				file_path.match(/\+\.\+\.html$/)  == null)
			{
				console.log('ignore ' + file_path);
				return ;
			}
			file_name = file_path.replace('\.html', '');
			var keys = file_name.split('\+\.\+');
			var article = {};
			article['path'] = 'articles/' + file_path;
			for (var i = 1; i < keys.length - 1; i += 2)
			{		
				article[keys[i]] = keys[i+1];
			}
			article_list.push(article);
			
		});
		callback && callback(article_list);
	});
};


// 将文章分类, 返回map, 键是分类名, 值是article_list
var category_article_list = function (article_list) {
	
	// 对map, 的key重新排序, 用于对分类排序, 返回排序的map
	var sort_map_key = function (map) {
		keys = Object.keys(map);
		keys.sort();
		var sorted_map = {};
		keys.forEach(function (key) {
			sorted_map[key] = map[key];
		});
		return sorted_map;
	}
	
	var categories = {}; // 文章分类 -> article_list
	article_list.forEach(function (article) {
		// 建立文章分类
		if (undefined == categories[article.category])
			categories[article.category] = [];
		// 文章加入分类
		categories[article.category].push(article);
		// 去掉文章分类属性
		delete article.category;
	});
	
	// 对文章分类, 加上分类下文章数量
	categories_keys = Object.keys(categories);
	categories_keys.forEach(function (categories_key) {
		var length = categories[categories_key].length;
		var new_categories_key = categories_key + " (" + length + ")";
		categories[new_categories_key] = categories[categories_key];
		delete categories[categories_key];;
	});
	
	// 按分类排序
	var sorted_categories = sort_map_key(categories);
	return sorted_categories;
};

// 对分类后文章, 每类文章按修改时间倒序排序, 返回值是分类后按修改时间倒序排序的文章
var sort_by_modified_time_desc_categoried_article_list = 
function (categoried_article_list) {
	var categories = Object.keys(categoried_article_list);
	categories.forEach(function (category) {
		categoried_article_list[category].sort(function (a, b) {
			return readDate(b['lastmodifiedtime']) - readDate(a['lastmodifiedtime']);
		});
	});
	return categoried_article_list;
}

remove_file_list(function () { // 移除旧文件列表
	scan_file_list(function(article_list) { // 扫描文章列表
	
		var categoried_article_list = category_article_list(article_list); // 文章列表分类
	
		categoried_article_list = sort_by_modified_time_desc_categoried_article_list(categoried_article_list); // 对分类后文章, 每类文章按修改时间倒序排序
		
		console.log(categoried_article_list);
	
		// 保存文件
		fs.appendFile('js/categoried_article_list.js', 'categoried_article_list = ' + 
			JSON.stringify(categoried_article_list) + ';',
			'utf8'
			, function (err) {
				console.log('finish');
			});

	});
});
