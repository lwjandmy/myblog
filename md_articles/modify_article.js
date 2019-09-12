if (process.argv.length != 3) {
	console.log('Usage: node modify_article.js <文章名>');
	return ;
}

var article_title = process.argv[2];

var fs = require('fs');


	var title = article_title.replace(/\s+$/, '');
		
	var date = new Date();
		
	// 把1位的数字前面加上0
	var int2Date = function (i) {
		var s = '' + i;
		if (s.length == 1)
			s = '0' + s;
		return s;
	};
	
	var lastmodifiedtime = '' + date.getFullYear() + int2Date(date.getMonth() + 1) + int2Date(date.getDate()) + '一' + int2Date(date.getHours()) + int2Date(date.getMinutes()) + int2Date(date.getSeconds());
		
	
	fs.readdir('.', function (err, files) {
		files.forEach(function (file_path) {
		
			file_name = file_path.replace('\.md', '');
			keys = file_name.split('+.+');
			var article = {};
			for (var i = 1; i < keys.length - 1; i += 2)
			{		
				article[keys[i]] = keys[i+1];
			}
			
			if (article['title'] == title)
			{
				var new_file_path = file_path.replace(/(\+\.\+lastmodifiedtime\+\.\+)\d{4}\d{2}\d{2}一\d{2}\d{2}\d{2}(\+\.\+)/, '$1' + lastmodifiedtime + '$2');
				fs.rename(file_path, new_file_path, function (){
					console.log(file_path + ' to ' + new_file_path);
				});
				return ;
			}
		});

	});

